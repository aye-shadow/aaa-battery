# Project Setup Guide

Before running any part of this project, ensure you have the following installed:

- **Node.js**: version 22
- **JDK**: version 17
- **Maven**: version 3.9.9

---

## Running the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Copy the example environment file and rename it:
   ```bash
   cp .env.example .env.local
   ```

3. Edit the newly created `.env.local` file with the required environment variables.

4. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

5. Your frontend will be running at:
   ```bash
   http://localhost:3000/
   ```

---

## Running the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file and rename it:
   ```bash
   cp .env.example .env
   ```

3. Edit the newly created `.env` file with the required environment variables.

4. Build and run the backend:
   > **Note for Windows users:** Use Git Bash or WSL to run the following command.
   ```bash
   ./build.sh
   ```

5. Your backend calls will be routed to:
   ```bash
   http://localhost:8080/
   ```

6. All backend endpoints are available at:
   ```bash
   http://localhost:8080/actuator/mappings
   ```

7. For more details refer to the `README.MD` file inside the `backend` directory.

---

Feel free to reach out if you encounter any issues during setup!