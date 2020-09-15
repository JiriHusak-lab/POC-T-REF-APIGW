FROM docker.io/library/centos:7

RUN yum install -y epel-release
RUN /usr/bin/curl --silent --location https://rpm.nodesource.com/setup_12.x | bash -
RUN yum install -y nodejs


RUN mkdir -p /usr/src/apps/gateway
RUN chmod -R 777 /usr/src/apps/gateway
WORKDIR /usr/src/apps/gateway
COPY  package.json /usr/src/apps/gateway
COPY . /usr/src/apps/gateway
RUN ls /usr/src/apps/gateway

RUN npm i  && ln -s /app/node_modules/ /node_modules


ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#RUN apt update && apt install
#RUN /bin/bash -c 'source $HOME/.bashrc; date'

#RUN npm install
#RUN npm update
RUN npm rebuild bcrypt --build-from-source

ENV PATH /opt/IBM/node/bin:$PATH

EXPOSE 3000

RUN /bin/bash -c 'date'
RUN /bin/bash -c 'cat /etc/timezone'
RUN /bin/bash -c 'pwd'
RUN /bin/bash -c 'ls -ld'
CMD ["npm", "run", "start"]
