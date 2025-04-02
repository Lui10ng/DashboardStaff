# Instruction on running the docker container with payload cms


## Prerequisites
Before running the project, make sure you have the following installed:
pnpm ^9

- [pnpm ^9](https://pnpm.io/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Pull main or go to my branch if it's not merged yet

```bash
git pull origin main
git checkout payload
```

### 2. Setup the environment variables

Create a .env file in the root directory and add the following variables:

[discord](https://discord.com/channels/1326408878199406623/1333044401580015740/1353543951562313922)

### 3. Create a custom Docker network named app-network

```bash
docker network create app-network
```

### 4. Run the project

in the root directory run:

```bash
docker compose up
```

### 5. Access the project

```bash
http://localhost:3000
```

### 6. Stop the project

```bash
docker compose down
```


## Accessing the database

1. Open a terminal either in docker desktop or just a normal terminal
2. Run the following command:
```bash
docker exec -it 09b3ea95dbfd7735d9f87b946ba8a8d4ecd3f592b7e4b1732a554132c3d8df17 bash

psql -U payload
```
3. Confirm the connection by running:
```bash
\l
```
4. You should see the list of databases

You can also use GUI tools like Postico or DBeaver to access the database.
    

