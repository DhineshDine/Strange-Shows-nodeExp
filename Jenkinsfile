// # The 'stages' block contains a sequence of logical stages for the pipeline.
pipeline{
    agent any 
    tools {
  nodejs 'nodejs-23.9.0'
}

stages {
//    # --- Stage 1: Build Frontend ---
//    # This stage navigates into the frontend directory, installs dependencies,
//    # and builds the production-ready React application.
    stage('Build Front-End') {
        steps {
            echo 'Building Front-end React + Vite'
            dir('frontend') {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }



//    # --- Stage 2: Build Backend ---
//    # This stage handles the Node.js backend. For most Node.js apps,
 //   # 'build' primarily means installing dependencies.
    stage('Build Backend') {
        steps {
            echo 'Building the Node.js Backend...'
            dir('express-backend') {
                sh 'npm install'
            }
        }
    }
    
//    # --- Stage 3: Test Frontend ---
//    # This stage runs automated tests for the React frontend.
    stage('Test Frontend') {
        steps {
            echo 'Running frontend tests...'
            dir('frontend') {
                sh 'npm test'
            }
        }
    }
    
 //   # --- Stage 4: Test Backend ---
//    # This stage runs automated tests for the Node.js backend.
    stage('Test Backend') {
        steps {
            echo 'Running backend tests...'
            dir('express-backend') {
                sh 'npm test'
            }
        }
    }

 //   # --- Stage 5: Deploy ---
//    # This stage deploys the application. This example is conditional,
//    # only running for the 'main' branch to prevent accidental deployments.
    stage('Deploy') {
      
        steps {
          
withCredentials([string(credentialsId: 'docker-pwd', variable: 'docker-pwd')]) {
           
            dir ('FrontEnd'){
                sh 'docker build -t dhineshdine/strange-shows-nodeexp-frontend:latest .'
                sh 'docker push dhineshdine/strange-shows-nodeexp-frontend:latest'
            }
                dir ('express-backend'){
                sh 'docker build -t dhineshdine/strange-shows-nodeexp-express-backend:latest .'
                sh 'docker push dhineshdine/strange-shows-nodeexp-express-backend:latest'
            }
}
            echo 'Deployment Completed for main branch.'
        }
    }
}

// # The 'post' block defines actions that will run at the end of the pipeline.
post {
    always {
        echo 'This will always run after the pipeline completes.'
    }
    success {
        echo 'Pipeline finished Successfully'
    }
    failure {
        echo 'Pipeline failed'
    }
    cleanup {
        echo 'Cleaning up workspace..'
    }
}
}
