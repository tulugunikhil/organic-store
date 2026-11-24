# PureHarvest Marketplace

A full-stack organic grocery marketplace built with React + Vite on the frontend and Express on the backend.

## Features
- Organic storefront with rotating daily deal banner
- Category pages for rice, fruits, pulses, oils, dairy, and vegetables
- Product cards with pricing and cart flow
- Checkout page with payment options
- Buyer, seller, and admin login flow
- Seller dashboard to add products and view stock
- Admin dashboard for store overview and inventory insights
- Demo backend mode with fallback product catalog when MongoDB is not configured

## Tech stack
- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Styling: custom CSS and responsive storefront layout

## Local setup

### 1. Install dependencies

Backend:
1. cd server
2. npm install

Frontend:
1. cd client
2. npm install

### 2. Run the app

Backend:
1. cd server
2. npm start

Frontend:
1. cd client
2. npm run dev

The app will run at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Automatic deployment (GitHub Actions + AWS EKS)

Pull requests build the frontend and check backend JavaScript. After those checks pass, a push to `main` builds both container images, pushes them to private Amazon ECR repositories, and deploys them to EKS. GitHub Actions assumes a narrowly scoped AWS role using OIDC; no long-lived AWS access key, Docker Hub credential, or public Jenkins endpoint is needed. The web app is exposed on NodePort `30080`, and its Nginx container proxies `/api` requests to the internal API service.

### AWS infrastructure setup

The Terraform configuration in `infra/terraform` creates a VPC with two public subnets, an EKS cluster and two on-demand `t3.medium` worker nodes, two private ECR repositories, and a GitHub OIDC role. The role trust is restricted to this repository's immutable GitHub subject for `main` and its Kubernetes administrator access is scoped to the `pureharvest` namespace.

1. Install Terraform 1.5+ and configure AWS CLI credentials with permission to create the listed EKS, EC2/VPC, ECR, IAM, and CloudWatch resources.
2. From `infra/terraform`, run `terraform init`, `terraform validate`, and `terraform plan`. Review the plan and the estimated ongoing charges below before applying. No AWS resources are created by `plan`.
3. Only after approving the reviewed plan, run `terraform apply`. The AWS identity that applies it receives cluster-creator administrator access for the initial namespace setup.
4. Configure `kubectl` and create the namespace:
   ```sh
   aws eks update-kubeconfig --region us-east-1 --name pureharvest-prod
   kubectl apply -f k8s/namespace.yaml
   ```
5. In the GitHub repository, add the Terraform output `github_deploy_role_arn` as an Actions **variable** named `AWS_DEPLOY_ROLE_ARN`. Add Actions **secrets** named `MONGO_URI` and `JWT_SECRET`. Use an externally reachable MongoDB connection string with TLS and a strong JWT secret; do not commit them or paste them into workflow files. If login OTP emails are required, also set the `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` secrets.
6. Push to `main`. The deploy workflow validates configuration, assumes the AWS role via OIDC, pushes images to ECR, updates the API secret, deploys both manifests, and waits for both rollouts.

The Terraform defaults target EKS 1.37 in `us-east-1` and two `t3.medium` nodes. Estimate at 730 hours/month: approximately $73 for the EKS standard-support control plane, $60.74 for worker compute, $7.30 for the workers' public IPv4 addresses, and $3.20 for 40 GB of gp3 disks — about **$144/month before ECR storage, CloudWatch logs, data transfer, taxes, and other usage**. Pricing varies by region and date. The cluster remains billable while running; `terraform destroy` removes it but also deletes its ECR repositories and images.

After deployment, obtain a node's public IP with `kubectl get nodes -o wide` and open `http://<node-public-ip>:30080`. The API service is internal to the cluster. The EKS public API endpoint defaults to accepting network connections from any IPv4 address, but still requires IAM authentication; use `cluster_endpoint_public_access_cidrs` to restrict it when you have stable client IPs. The worker nodes' public egress IPs can change when nodes are replaced, so update any MongoDB IP allowlist accordingly. This baseline does not provide a custom domain or HTTPS; add a load balancer and TLS before using it as a public production storefront. GitHub Actions deployments require the `pureharvest` namespace to exist before the first run.

Jenkins is not part of this deployment path. To run locally with Docker Compose, use `docker compose up --build -d` from the repository root; the app is available at `http://localhost:8080`.

## Demo login shortcuts
- Admin email: admin@pureharvest.com
- Admin password: admin123
- Seller email: seller@pureharvest.com
- Seller password: seller123

## Project structure
- client/src/pages: storefront, auth, seller, dashboard, category, checkout pages
- client/src/components: reusable storefront and UI components
- server/routes: Express routes for products and auth
- server/controllers: request handling logic
- server/models: MongoDB schema definitions

## Notes
- The backend runs in demo mode if MONGO_URI is not configured.
- Buyer and seller login send a one-time OTP by email after the password is accepted. Seller login also requires a GST number. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in `server/.env` for real delivery. Without SMTP, development mode returns the OTP in the API response for local testing only.
- This project is currently focused on storefront polish and marketplace UX before deeper production-grade features are added.
