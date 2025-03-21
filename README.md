before running any of this, make sure you have the following installed:

- **Node.js**: version 22
- **JDK**: version 17
- **Maven**: version 3.9.9

to run the frontend:

```bash
cd frontend
cp .env.example .env.local
```

edit your newly created .env.local file with the required env variables. then run:

```bash
npm install
npm run dev
```

your frontend will be running on:

```bash
http://localhost:3000/
```

to run the backend:

```bash
cd backend
cp .env.example .env
```

edit your newly created .env file with the required env variables. then run:

```bash
./build.sh
```

your backend calls will be routed to:

```bash
http://localhost:8080/
```