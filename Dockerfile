FROM amazonlinux:latest
#we use this containter to build native npm modules that will work on lambda


# set locale
RUN echo LC_ALL=en_GB.UTF-8 >> /etc/environment
ENV LC_ALL=en_GB.UTF-8

# install node and build tools
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - && \
    yum install -y nodejs gcc-c++ make git

# install serverless
RUN npm install -g serverless


ENV APP_DIR "/usr/src/app"
ENV IOTA_PROXY_DIR "/usr/src/app/sls_iotaproxy"
RUN mkdir -p "$APP_DIR"
RUN mkdir -p "$IOTA_PROXY_DIR"
WORKDIR "$APP_DIR"

COPY ./sls_iotaproxy/package.json "$IOTA_PROXY_DIR"/
RUN cd $IOTA_PROXY_DIR && npm install


CMD ["tail", "-f", "/dev/null"]
