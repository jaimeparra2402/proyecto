FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

RUN echo '#!/bin/bash \n\
orbd -ORBInitialPort 1050 -ORBInitialHost localhost & \n\
sleep 3 \n\
exec java -jar app.jar --server.port=9090 \n\
' > entrypoint.sh


RUN chmod +x entrypoint.sh

EXPOSE 9090
ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]