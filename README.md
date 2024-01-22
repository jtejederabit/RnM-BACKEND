
# R&M BACKEND

Coding test

## Run Locally

Clone the project

```bash
  git clone https://github.com/jtejederabit/RnM-BACKEND.git
```

Go to the project directory

```bash
  cd RnM-BACKEND
```

Install dependencies

```bash
  npm install
```

Start the server in dev mode

```bash
  npm run start:dev
```

Build the project

```bash
  npm run start
```




## Deployment

To deploy this project with Docker

```bash
  docker-compose up --build
```


## Base URL

```bash
  http://localhost:3000
```

## Extra Libraries

- Jest (Testing) - Used to test the API endpoints
- Supertest (Testing) - Used to test the API endpoints
- Axios (HTTP Client) - Used to fetch data from the R&M API
- bcrypt (Password hashing) - Used to hash the user's password
- jsonwebtoken (JWT) - Used to generate the JWT token
- NeDB (Database) - Used to store the user's data