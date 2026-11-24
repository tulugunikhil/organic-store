import time

import boto3
from botocore.exceptions import ClientError


def _is_missing(error):
    return error.response["Error"]["Code"] in {
        "ResourceNotFoundException",
        "ResourceNotFound",
        "InvalidVpcID.NotFound",
        "InvalidVolume.NotFound",
        "InvalidSubnetID.NotFound",
        "InvalidRouteTableID.NotFound",
        "InvalidInternetGatewayID.NotFound",
        "InvalidGroup.NotFound",
    }


def _delete_nodegroups(eks, cluster_name):
    names = eks.list_nodegroups(clusterName=cluster_name)["nodegroups"]
    for name in names:
        try:
            eks.delete_nodegroup(clusterName=cluster_name, nodegroupName=name)
        except ClientError as error:
            if not _is_missing(error):
                raise
        waiter = eks.get_waiter("nodegroup_deleted")
        waiter.wait(
            clusterName=cluster_name,
            nodegroupName=name,
            WaiterConfig={"Delay": 15, "MaxAttempts": 24},
        )


def _delete_cluster(eks, cluster_name):
    try:
        eks.delete_cluster(name=cluster_name)
    except ClientError as error:
        if not _is_missing(error):
            raise
        return

    eks.get_waiter("cluster_deleted").wait(
        name=cluster_name,
        WaiterConfig={"Delay": 15, "MaxAttempts": 24},
    )


def _delete_volumes(ec2, cluster_name):
    volumes = ec2.describe_volumes(
        Filters=[
            {
                "Name": f"tag:kubernetes.io/cluster/{cluster_name}",
                "Values": ["owned", "shared"],
            }
        ]
    )["Volumes"]

    for volume in volumes:
        volume_id = volume["VolumeId"]
        for _ in range(24):
            try:
                state = ec2.describe_volumes(VolumeIds=[volume_id])["Volumes"][0]["State"]
            except ClientError as error:
                if _is_missing(error):
                    break
                raise
            if state == "available":
                ec2.delete_volume(VolumeId=volume_id)
                break
            time.sleep(10)
        else:
            raise RuntimeError(f"Volume {volume_id} is still attached")


def _delete_vpc(ec2, cluster_name):
    vpcs = ec2.describe_vpcs(
        Filters=[
            {"Name": "tag:Name", "Values": [f"{cluster_name}-vpc"]},
            {"Name": "tag:Project", "Values": ["PureHarvest"]},
            {"Name": "tag:ManagedBy", "Values": ["Terraform"]},
        ]
    )["Vpcs"]
    for vpc in vpcs:
        vpc_id = vpc["VpcId"]
        for _ in range(24):
            interfaces = ec2.describe_network_interfaces(
                Filters=[{"Name": "vpc-id", "Values": [vpc_id]}]
            )["NetworkInterfaces"]
            if not interfaces:
                break
            time.sleep(10)
        else:
            raise RuntimeError(f"Network interfaces still exist in VPC {vpc_id}")

        route_tables = ec2.describe_route_tables(
            Filters=[{"Name": "vpc-id", "Values": [vpc_id]}]
        )["RouteTables"]
        for table in route_tables:
            if not any(association.get("Main") for association in table["Associations"]):
                for association in table["Associations"]:
                    association_id = association.get("RouteTableAssociationId")
                    if association_id:
                        ec2.disassociate_route_table(AssociationId=association_id)

        subnets = ec2.describe_subnets(
            Filters=[{"Name": "vpc-id", "Values": [vpc_id]}]
        )["Subnets"]
        for subnet in subnets:
            ec2.delete_subnet(SubnetId=subnet["SubnetId"])

        for table in route_tables:
            if not any(association.get("Main") for association in table["Associations"]):
                ec2.delete_route_table(RouteTableId=table["RouteTableId"])

        gateways = ec2.describe_internet_gateways(
            Filters=[{"Name": "attachment.vpc-id", "Values": [vpc_id]}]
        )["InternetGateways"]
        for gateway in gateways:
            ec2.detach_internet_gateway(
                InternetGatewayId=gateway["InternetGatewayId"],
                VpcId=vpc_id,
            )
            ec2.delete_internet_gateway(
                InternetGatewayId=gateway["InternetGatewayId"]
            )

        groups = ec2.describe_security_groups(
            Filters=[{"Name": "vpc-id", "Values": [vpc_id]}]
        )["SecurityGroups"]
        for group in groups:
            if group["GroupName"] == "default":
                continue
            group_id = group["GroupId"]
            if group["IpPermissions"]:
                ec2.revoke_security_group_ingress(
                    GroupId=group_id,
                    IpPermissions=group["IpPermissions"],
                )
            if group["IpPermissionsEgress"]:
                ec2.revoke_security_group_egress(
                    GroupId=group_id,
                    IpPermissions=group["IpPermissionsEgress"],
                )
        for group in groups:
            if group["GroupName"] != "default":
                ec2.delete_security_group(GroupId=group["GroupId"])

        ec2.delete_vpc(VpcId=vpc_id)


def handler(event, _context):
    cluster_name = event["cluster_name"]
    region = event.get("region", "us-east-1")
    eks = boto3.client("eks", region_name=region)

    try:
        _delete_nodegroups(eks, cluster_name)
        _delete_cluster(eks, cluster_name)
    except ClientError as error:
        if not _is_missing(error):
            raise

    ec2 = boto3.client("ec2", region_name=region)
    _delete_volumes(ec2, cluster_name)
    _delete_vpc(ec2, cluster_name)

    ecr = boto3.client("ecr", region_name=region)
    for repository in ("pureharvest-api", "pureharvest-web"):
        try:
            ecr.delete_repository(repositoryName=repository, force=True)
        except ClientError as error:
            if not _is_missing(error):
                raise

    logs = boto3.client("logs", region_name=region)
    try:
        logs.delete_log_group(logGroupName=f"/aws/eks/{cluster_name}/cluster")
    except ClientError as error:
        if error.response["Error"]["Code"] != "ResourceNotFoundException":
            raise

    return {"deleted": cluster_name}
