pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  parameters {
    string(name: 'GIT_SHA', defaultValue: '', description: 'Commit SHA that passed GitHub Actions')
    string(name: 'DOCKERHUB_USERNAME', defaultValue: '', description: 'Docker Hub namespace containing the published images')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          if (params.GIT_SHA?.trim()) {
            if (!(params.GIT_SHA ==~ /^[0-9a-fA-F]{40}$/)) {
              error('GIT_SHA must be a full 40-character commit SHA')
            }
            sh 'git fetch --no-tags origin "$GIT_SHA" && git checkout --detach "$GIT_SHA"'
          }
          if (!(params.DOCKERHUB_USERNAME ==~ /^[a-z0-9][a-z0-9_-]{0,29}$/)) {
            error('DOCKERHUB_USERNAME must be a valid Docker Hub namespace')
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: 'pureharvest-kubeconfig', variable: 'KUBECONFIG_FILE')]) {
          sh '''
            set -eu
            export KUBECONFIG="$KUBECONFIG_FILE"
            IMAGE_TAG="${GIT_SHA:-$(git rev-parse HEAD)}"
            export IMAGE_TAG
            kubectl apply -f k8s/api-deployment.yaml -f k8s/web-deployment.yaml
            kubectl -n pureharvest set image deployment/pureharvest-api api="docker.io/${DOCKERHUB_USERNAME}/pureharvest-api:${IMAGE_TAG}"
            kubectl -n pureharvest set image deployment/pureharvest-web web="docker.io/${DOCKERHUB_USERNAME}/pureharvest-web:${IMAGE_TAG}"
            kubectl -n pureharvest rollout status deployment/pureharvest-api --timeout=180s
            kubectl -n pureharvest rollout status deployment/pureharvest-web --timeout=180s
          '''
        }
      }
    }
  }
}
