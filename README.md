# Bank Proxy Web App

## Features
1. Let user send the location of china proxy
2. Decrypt the request of https and get the cookie and session

## Getting Started
```sh
npm install

# for develop
npm run dev
```

## Production Steps

### 1. Install neccesary package on server
Because we need to use proxy server to get http request, so sure you have installed the package `ca-certificates`

```sh
sudo yum install ca-certificates
```

### 2. Create trusted root certification

Change directory to the project where you uploaded, then run the following command:

```sh
npx anyproxy-ca
```

Then it will show the following message, please type `y` to generate the settings.
```text
detecting CA status...
AnyProxy CA does not exist.
? Would you like to generate one ? (Y/n)
```

### 3. Add the trusted root certification from project to system

First, There's a `rootCA.tar.gz` file in the project, please uncompress it to the `/root/.anyproxy/certificates/`, then you should see two files under the location `rootCA.crt` and `rootCA.key`.

Second, copy the `rootCA.crt` from `/root/.anyproxy/certificates` to `/etc/pki/ca-trust/source/anchors/` 

Finally, let run the following command to trust the certification we setted:

```sh
update-ca-trust extract
```

> Note: You might need to reboot server to apply the setting

### 4. Run the project
For this project we use pm2 for host, remember install pm2 before run the following code.

```sh
npm run deploy
```

> Note: The settings for production was written in ecosystem.config.js

## For client

You need to install the same `rootCA.crt` in your OS before using the proxy server, or you won't able to use browser