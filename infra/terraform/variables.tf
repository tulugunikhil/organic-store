variable "aws_region" {
  description = "AWS region for the EKS cluster and ECR repositories."
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the production EKS cluster."
  type        = string
  default     = "pureharvest-prod"
}

variable "kubernetes_version" {
  description = "EKS Kubernetes version."
  type        = string
  default     = "1.37"
}

variable "node_instance_type" {
  description = "On-demand EC2 type for each EKS worker node."
  type        = string
  default     = "t3.medium"
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "IPv4 CIDRs allowed to reach the public EKS API endpoint. Kubernetes access still requires IAM authentication."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "github_oidc_subject" {
  description = "Immutable GitHub OIDC subject allowed to deploy from the main branch."
  type        = string
  default     = "repo:tulugunikhil@195653965/organic-store@1328594102:ref:refs/heads/main"
}
