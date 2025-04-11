# ✨ V2 Payload ✨

🚀 Spin up a local development environment for your Payload CMS v3 project using Docker Compose!

This setup provides:
* A container for your Payload (Next.js) application.
* A container for your database (MongoDB or PostgreSQL).
* Volume mounting for live code updates.
* Easy access to common development tasks like migrations.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/) (Often included with Docker Desktop)
* A code editor (like VS Code)
* Git (for cloning, if applicable)

---

## ⚙️ Setup Instructions

1.  **Clone Your Project (If applicable):**
    ```bash
    git clone https://github.com/Veent-OJT/ojt-main
    cd v2-payload
    ```

2.  **Create Environment File:**
    * Copy the example environment file (if one exists) or create a new file named `.env` in the root of your project.
        ```bash
        cp .env.example .env
        ```
        OR
        ```bash
        touch .env
        ```
    * **Edit `.env`:** Add the necessary environment variables. At a minimum, you'll likely need:
        ```dotenv
        # payload.config.ts needs this! Make it long and random.
        PAYLOAD_SECRET=REPLACE_THIS_WITH_A_STRONG_SECRET

        # Check your docker-compose.yml for the correct service name 

        # Example for PostgreSQL using the service name 'postgres':
        POSTGRES_USER=aaa          # Example custom user
        POSTGRES_PASSWORD=aaa
        POSTGRES_DB=aaa      # Example custom DB name
        POSTGRES_PORT=5433              # Example: Expose Postgres on host port 5433 (optional)

        # Add any other environment variables your payload.config.ts or app needs
        REDIS_PORT=6380
        NEXT_PUBLIC_SERVER_URL=http://localhost:3000
        AWS_ACCESS_KEY_ID=''
        AWS_SECRET_ACCESS_KEY=''
        ```
        *Refer to your `docker-compose.yml` and Payload config for the exact variables required.*

---

## ▶️ Running the Application

1.  **Build & Start Containers:**
    * Open your terminal in the project root directory.
    * Run the following command:
        ```bash
        docker-compose up --build -d
        ```
        * `--build`: Rebuilds the images if your code or Dockerfile has changed. Omit this if you haven't made changes and just want to start existing containers.
        * Add `-d` to run in detached mode (in the background): `docker-compose up -d --build`

2. **Important** **Running Migrations:**

    Get inside docker-desktop and look for `v2_payload` container.

    Go to the Exec Tab and run: (To Start a fresh database)

    ```bash
    pnpm payload migrate:fresh
    ```

    To check migrations

    ```bash
    pnpm payload migrate:status
    ```

    And then start migrations

    ```bash
    pnpm payload migrate
    ```

3.  **Access Payload:**
    * **Admin Panel:** Open your browser to [http://localhost:3000/admin](http://localhost:3000/admin) (or the port configured in your `docker-compose.yml`).
    * **API:** Your API will be available at [http://localhost:3000/api](http://localhost:3000/api) (or your configured port/API route).

---

## 🐳 Useful Docker Compose Commands

Run these from your project's root directory:

* **Start Containers (background):**
    ```bash
    docker-compose up -d
    ```
* **Stop Containers:**
    ```bash
    docker-compose down
    ```
* **View Logs (Live):**
    ```bash
    # View all logs
    docker-compose logs -f

    # View logs for a specific service (e.g., 'payload')
    docker-compose logs -f payload
    ```
    *(Press `Ctrl+C` to stop following)*
    
* **Execute Commands Inside Container (Interactive):**
    * This is essential for running Payload CLI commands like migrations. Replace `payload` with your service name if different, and `pnpm` with `npm run` or `yarn` if needed.
    * **Get an interactive shell:**
        ```bash
        docker-compose exec payload sh
        # Now you are inside the container, run commands like 'ls', 'pnpm install', etc.
        # Type 'exit' to leave.
        ```
    * **Run a specific Payload command (e.g., check migration status):**
        ```bash
        docker-compose exec payload pnpm payload migrate:status
        ```
    * **Run an interactive command (like creating migrations):**
        ```bash
        # Use 'run --rm' for one-off interactive tasks
        docker-compose run --rm payload pnpm payload migrate:create my_new_migration
        # Respond to prompts directly in your terminal!
        ```
    * **Force recreate DB (Use with caution in dev!):**
        ```bash
        docker-compose run --rm payload pnpm payload migrate:fresh
        ```

---

## 💡 Notes

* Make sure the database service name in your `POSTGRES_DB` (e.g. `postgres`) matches the service name defined in your `docker-compose.yml`.
* Database data is typically persisted using Docker volumes defined in your `docker-compose.yml`. Check the `volumes` section to see where data is stored. You can remove these volumes if you want a truly fresh start (e.g., `docker-compose down -v`). **Warning:** This deletes database data permanently.
* Modify the `docker-compose.yml` and `Dockerfile` as needed for your specific project requirements (e.g., different Node versions, additional services, custom build steps).

Happy developing! 🎉