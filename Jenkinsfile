// This Jenkinsfile defines a Continuous Integration/Continuous Deployment (CI/CD) pipeline for a full-stack Node.js application.
pipeline{
    agent any
    // The 'tools' block ensures the Node.js binaries (including npm) are automatically 
    // added to the execution PATH for all subsequent steps, resolving the "npm: not found" error.
    tools {
        // !!! IMPORTANT: The string below MUST match the 'Name' you gave your 
        // Node.js installation in: Manage Jenkins -> Global Tool Configuration.
        nodejs 'NodeJS_Home'
    }
stages {
//     # --- Stage 1: Build Frontend ---
    stage('Build Front-End') {
        steps {
            echo 'Building Front-end React + Vite'
            dir('frontend') {
                sh 'npm install'
                // Re-enabled: Assumes "build": "vite build" is now committed to frontend/package.json
            }
        }
    }


//     # --- Stage 2: Build Backend ---
    stage('Build Backend') {
        steps {
            echo 'Building the Node.js Backend...'
            dir('express-backend') {
                sh 'npm install'
            }
        }
    }
    
//     # --- Stage 3: Test Frontend ---
    stage('Test Frontend') {
        steps {
            echo 'Running frontend tests (vitest)...'
            dir('FrontEnd') {
                // DEBUGGING STEP ADDED: THIS MUST SHOW UP IN CONSOLE OUTPUT IF THE FILE IS CORRECTLY COMMITTED
                sh 'rm -rf node_modules'
                sh 'npm install --include=dev'
                sh 'npm test' // Runs "vitest"
            }
        }
    }
    
//     # --- Stage 4: Test Backend ---
    stage('Test Backend') {
        steps {
            echo 'Running backend tests (jest)...'
            dir('express-backend') {
                // DEBUGGING STEP ADDED: THIS MUST SHOW UP IN CONSOLE OUTPUT IF THE FILE IS CORRECTLY COMMITTED
                sh 'npm test' // Runs "npx jest"
            }
        }
    }

//     # --- Stage 5: Deploy ---
    stage('Deploy') {
        
        steps {
            
withCredentials([string(credentialsId: 'docker-pwd', variable: 'Docker-jenkins')]) {

    sh 'docker login -u dhineshdine -p${Docker-jenkins}'

    
                dir ('frontend'){
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
