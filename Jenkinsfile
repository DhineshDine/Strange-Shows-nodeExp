pipeline {
  agent any 
  stages  {
    #--Stage 1 :Build FrontEnd --
    stage ("Build Front-End")
    {
      echo "Building Front-end React + vite "
      sh  'cd frontend'
      sh 'npm install'
      sh 'npm run build'
      sh 'cd ..'
    }
  }
  # -- stage 2 :Testing Frontend --
    stage ('Test Frontend'){
      step {
        echo 'Running frontend tests...'
        sh 'cd frontend'
        sh 'npm test'
        sh 'cd ..'
      }
    }

  #--Stage 3: Build Backend --
    stage('Build BackEnd') {
      steps{
        echo 'Building the Node.js Backend...'
        sh 'cd backend'
        sh 'npm install'
        sh 'cd ..'
      }
    }
  #-- Stage 4: Test BackEnd --
    stage('Test Backend') {
      echo 'Running backend tests...'
      sh 'cd backend'
      sh 'npm test'
      sh 'cd ..'

    }
}

# --Stage 5 : Deploy -- 
  stage ('Deploy'){
    when {
      branch 'main'
    }
    steps {
      echo 'Deploying To Production...'

      sh 'docker build -t Strange-


    }
  }
    }
