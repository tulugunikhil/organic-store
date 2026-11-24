output "aws_region" {
  description = "Region used by GitHub Actions."
  value       = var.aws_region
}

output "cluster_name" {
  description = "EKS cluster name used by GitHub Actions."
  value       = aws_eks_cluster.main.name
}

output "github_deploy_role_arn" {
  description = "Set this as the GitHub Actions repository variable AWS_DEPLOY_ROLE_ARN."
  value       = aws_iam_role.github_actions_deployer.arn
}

output "api_ecr_repository_url" {
  description = "Private ECR repository for the API image."
  value       = aws_ecr_repository.app["api"].repository_url
}

output "web_ecr_repository_url" {
  description = "Private ECR repository for the frontend image."
  value       = aws_ecr_repository.app["web"].repository_url
}
