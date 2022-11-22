FROM mongo

RUN apt update -y
RUN apt install curl wget gnupg -y
RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN bash /tmp/nodesource_setup.sh
RUN apt install nodejs mongodb-mongosh -y
RUN node -v
