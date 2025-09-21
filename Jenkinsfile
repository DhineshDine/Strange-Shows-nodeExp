# The 'stages' block contains a sequence of logical stages for the pipeline.
stages {
    # --- Stage 1: Build Frontend ---
    # This stage navigates into the frontend directory, installs dependencies,
    # and builds the production-ready React application.
    stage('Build Front-End') {
        steps {
            echo 'Building Front-end React + Vite'
            dir('frontend') {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }

    # --- Stage 2: Test Frontend ---
    # This stage runs automated tests for the React frontend.
    stage('Test Frontend') {
        steps {
            echo 'Running frontend tests...'
            dir('frontend') {
                sh 'npm test'
            }
        }
    }

    # --- Stage 3: Build Backend ---
    # This stage handles the Node.js backend. For most Node.js apps,
    # 'build' primarily means installing dependencies.
    stage('Build Backend') {
        steps {
            echo 'Building the Node.js Backend...'
            dir('backend') {
                sh 'npm install'
            }
        }
    }

    # --- Stage 4: Test Backend ---
    # This stage runs automated tests for the Node.js backend.
    stage('Test Backend') {
        steps {
            echo 'Running backend tests...'
            dir('backend') {
                sh 'npm test'
            }
        }
    }

    # --- Stage 5: Deploy ---
    # This stage deploys the application. This example is conditional,
    # only running for the 'main' branch to prevent accidental deployments.
    stage('Deploy') {
        when {
            branch 'main'
        }
        steps {
            echo 'Deploying to Production With Docker...'

            sh 'docker build -t Strange-shows-Frontend ./frontend'
            sh 'docker build -t Strange-shows-Backend ./backend'

            sh 'docker push Strange-shows-Frontend'
            sh 'docker push Strange-shows-Backend'

            echo 'Deployment Completed for main branch.'
        }
    }
}

# The 'post' block defines actions that will run at the end of the pipeline.
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
