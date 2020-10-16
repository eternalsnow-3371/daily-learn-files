#!/bin/sh
gradle clean build -x test
rm ~/java-build-test/apache-tomcat-9.0.39/webapps/* -r
rm ~/java-build-test/apache-tomcat-9.0.39/logs/* -r
cp ~/daily-learn-files/javaee-project/javaee-project-server/build/libs/javaee-project-server-0.0.1.war ~/java-build-test/apache-tomcat-9.0.39/webapps/
sh ~/java-build-test/apache-tomcat-9.0.39/bin/startup.sh
