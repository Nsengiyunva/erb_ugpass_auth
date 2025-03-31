pipeline {
    agent any 

    stages {
        stage( "stopping old containers for authentication ugpass service" ) {
            steps {
                sh "sudo docker-compose stop"
            }
        }

        stage( "removing old containers for authentication ugpass service" ) {
            steps {
                sh "sudo docker-compose down"
            }
        }

        stage( "build new containers for authentication ugpass service" ) {
            steps {
                sh "sudo docker-compose build"
            }
        }

        stage( "start the containers in detached mode" ) {
            steps {
                sh "sudo docker-compose up -d"
            }
        }
    }
}