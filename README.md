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

### 2. Run the project

in the root directory run:

```bash
docker compose up
```

### 3. Access the project

```bash
http://localhost:3000
```

### 4. Stop the project

```bash
docker compose down
```


## Accessing the database

1. Open a terminal either in docker desktop or just a normal terminal
2. Run the following command:
```bash
docker exec -it veent-payload-db-1 psql -U payload -d payload
```
3. Confirm the connection by running:
```bash
\l
```
4. You should see the list of databases

You can also use GUI tools like Postico or DBeaver to access the database.
    

