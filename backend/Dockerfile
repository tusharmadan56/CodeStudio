FROM ubuntu:22.04

# Non-root user that the project runs as (least privilege inside the container).
RUN useradd -m -s /bin/bash sandbox

# Where the user's project gets mounted and where the terminal lands.
WORKDIR /home/sandbox/app

# Refresh the OS and install the basics (curl is needed to fetch Node).
RUN apt update && apt upgrade -y
RUN apt install -y curl nano

# Install Node.js 20 via the NodeSource setup script.
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt install -y nodejs

# Make the in-browser terminal prompt show the current working directory.
RUN echo "PS1='\w$ '" >> /home/sandbox/.bashrc
