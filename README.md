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

  # Diagram for jwt and pbulic/private keys

  [Diagram](https://app.diagrams.net/#G1jZLJSN-uofARwPeEUqH7qE7CWQa833Ff)
