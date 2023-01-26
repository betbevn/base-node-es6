# How to run this project (Front End and Back End)?

- Run this command

```bash
docker compose up -d
```

- Access the website via: http://localhost:8181
- API end point: http://localhost:6868/api

# How to run specific Front End?

- You need to install **Live Server Extension** to serve an index.html file in client folder
- Access the website: Depend on the Live Server port serve. In my case, Live Server serve on 5500 port. So, i will access the website via: http://localhost:5500/client/index.httml

# How to run specific Back End?

In order to run a Back End, you need to have a already database. For this project, I set up a mongo database. So, we will have 3 ways to set up a database here:

- Option 1:
  - Run this command **docker compose up -d**
  - cd to app folder then run this command **yarn start:dev**
  - API end point: http://localhost:8080/api
- Option 2:
  - You can make an other docker compose file then use this script below to set up a mongo database
  ```bash
    mongodb:
        image: mongo:5.0.2
        restart: unless-stopped
        env_file: ./.env
        environment:
        - MONGO_INITDB_ROOT_USERNAME=$MONGODB_USER
        - MONGO_INITDB_ROOT_PASSWORD=$MONGODB_PASSWORD
        ports:
        - $MONGODB_LOCAL_PORT:$MONGODB_DOCKER_PORT
        volumes:
        - db:/data/db
    volumes:
        db:
  ```
  - cd to app folder then run this command **yarn start:dev**
  - API end point: http://localhost:8080/api

# SAML (Security Assertion Markup Language)

## Concept

- It's an XML based open standard for transferring identity data between two parties.
- The two parties being an identity provider and a service provider
- https://www.youtube.com/watch?v=eaIGGO_NQJA

## Benefits

- Improved user experience users only have to log in one time and be able to get access to multiple service providers
- Offers increased security. SAML gives you a signle point of authentication that happens with a secure identity provider.
  SAML transfers the identity information to the service providers, this ensures that the credentials are only sent to the
  identity provider directly, it loosens the decoupling of directories.
- Reduced costs for service providers. With SAML you do not have maintain account information across multiple different Services

# Setting up OpensSSL

Generate the self-sign certificate for IDP (Keycloak) to run in HTTPS mode

```bash
openssl req -newkey rsa:2048 -nodes  -keyout idp-server.key.pem -x509 -days 3650 -out idp-server.crt.pem

chmod 755 idp-server.crt.pem
chmod 755 idp-server.key.pem

```

Service Provider (NodeJs) app will also require a key/certificate for encryption and decryption of packets

```bash
openssl req -newkey rsa:2048 -nodes  -keyout sp-pvt.key.pem -x509 -days 3650 -out sp-pub.cert.pem
```
