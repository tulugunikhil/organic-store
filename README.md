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

## CI/CD deployment (GitHub Actions + Jenkins + Kubernetes + Docker Hub)

GitHub Actions builds the frontend and checks backend JavaScript on pull requests and pushes to `main`. After validation on `main`, it builds both Docker images, publishes commit-tagged images to Docker Hub, then triggers Jenkins with that exact commit SHA. Jenkins deploys those images to Kubernetes and waits for both rollouts to finish. The web service is exposed on NodePort `30080`; the API remains an internal cluster service.

### Setup

1. Create a Kubernetes cluster (for example, k3s on a Linux VM) and make sure its API is reachable from the Jenkins agent. Install `kubectl` on the agent.
2. As a cluster administrator, create the application namespace and Jenkins' namespace-scoped deployer account:
   ```sh
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/jenkins-rbac.yaml
   ```
   Create a kubeconfig for the `jenkins-deployer` service account and store it in Jenkins as a **Secret file** credential with ID `pureharvest-kubeconfig`. Use the cluster's supported service-account token workflow and keep this kubeconfig private; it only needs to manage deployments, services, and pods in the `pureharvest` namespace.
3. Create Docker Hub repositories named `<username>/pureharvest-api` and `<username>/pureharvest-web`. For private repositories, create a read-only Docker Hub access token and a Kubernetes pull secret:
   ```sh
   kubectl -n pureharvest create secret generic dockerhub-pull \
     --from-file=.dockerconfigjson=<path-to-protected-docker-config.json> \
     --type=kubernetes.io/dockerconfigjson
   ```
   Keep that config file private and out of source control. For public repositories, remove the `imagePullSecrets` entries from the Kubernetes Deployment manifests instead.
4. Configure the API's Kubernetes Secret with production settings. At minimum, set a strong `JWT_SECRET`; add `MONGO_URI` for persistence and the `SMTP_*` settings for real OTP email delivery:
   ```sh
   kubectl -n pureharvest create secret generic pureharvest-api-secrets \
     --from-env-file=<path-to-protected-api-env-file>
   ```
   Put the required `JWT_SECRET` and any optional `MONGO_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` values in that file. Protect it and keep it out of source control. Store Kubernetes secrets securely.
5. In GitHub repository Actions secrets, add:
   - `DOCKERHUB_USERNAME`: Docker Hub namespace that owns both image repositories
   - `DOCKERHUB_TOKEN`: Docker Hub access token with permission to push to both repositories
   - `JENKINS_URL`: Jenkins base URL, such as `https://jenkins.example.com`
   - `JENKINS_JOB`: job name (`pureharvest-deploy`; use slash-separated folders for a nested job)
   - `JENKINS_USER`: Jenkins username
   - `JENKINS_API_TOKEN`: that user's API token
6. Create a Jenkins Pipeline job named `pureharvest-deploy`. Configure it to use this Git repository, the `main` branch, and `Jenkinsfile` from SCM. The first manual build registers the Jenkinsfile parameters and may stop because `DOCKERHUB_USERNAME` has no value yet; run it again with the Docker Hub namespace to verify the initial deployment. The Jenkins user/API token needs `Overall/Read`, `Job/Read`, and `Job/Build` permissions.
7. Configure cluster networking/firewall to allow inbound TCP port `30080` to the Kubernetes nodes, then open `http://<node-ip>:30080`. For production, expose the web service using an Ingress controller and configure HTTPS with a domain.

Pull requests run validation only and never publish images or deploy. A push to `main` fails rather than silently skipping image publication or Jenkins deployment if required credentials are missing. To run locally with Docker Compose, use `docker compose up --build -d` from the repository root; the app is available at `http://localhost:8080`.

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
