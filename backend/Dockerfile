FROM alpine:3.20
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk add --no-cache openjdk21-jre-headless
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]
