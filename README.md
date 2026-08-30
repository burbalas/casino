# Casino Web Application

A full-stack casino-style web application built as a personal learning project.

The project combines a React frontend with an ASP.NET Core REST API and a MySQL database. It currently includes user authentication, account balances and a functional slot-machine game using virtual tokens.

> This is an educational/demo project only. It does not use real money or provide real gambling functionality.

## Features

* User registration and login
* JWT-based authentication
* Password hashing
* Persistent user accounts and virtual-token balances
* Authenticated account/profile endpoint
* Slot-machine game with weighted random outcomes
* Server-side bet and payout calculation
* Balance validation and database updates
* React frontend communicating with an ASP.NET Core API
* MySQL database accessed through Entity Framework Core

## Tech Stack

### Frontend

* React
* JavaScript
* React Router
* HTML / CSS

### Backend

* C#
* ASP.NET Core (.NET 8)
* REST API
* Entity Framework Core
* JWT authentication
* Swagger / OpenAPI

### Database

* MySQL
* Entity Framework Core migrations

## Project Structure

```text
casino/
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   └── Program.cs
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── contexts/
│       └── lib/
│
└── casino.sln
```

## Authentication

Users can create an account and log in through the API.

Passwords are stored as hashes rather than plain text. After a successful login, the backend generates a JWT that is used to access authenticated endpoints such as account information and slot gameplay.

## Slot Game

The slot game runs its outcome logic on the backend.

Each symbol has its own probability weight and payout multiplier. The backend:

1. Validates the user's bet and balance.
2. Generates three weighted random symbols.
3. Determines whether the result contains a winning combination.
4. Calculates the payout.
5. Updates the user's virtual-token balance in the database.
6. Returns the result to the frontend.

This keeps the game and balance logic on the server rather than relying on the client.

## Running Locally

### Requirements

* .NET 8 SDK
* Node.js / npm
* MySQL

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure a MySQL connection string and JWT secret using .NET user secrets:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "YOUR_MYSQL_CONNECTION_STRING"
dotnet user-secrets set "Jwt:Key" "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG"
```

Restore dependencies:

```bash
dotnet restore
```

Apply the database migrations:

```bash
dotnet ef database update
```

Start the API:

```bash
dotnet run
```

Swagger is available when running the backend in the development environment.

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The React application runs locally and communicates with the ASP.NET Core backend.

## Current Status

The project is still under development and is primarily used for learning and experimenting with full-stack development.

Possible future improvements include:

* Additional casino-style games
* Improved frontend design and responsiveness
* Better validation and error handling
* Automated backend and frontend tests
* Dockerized development environment
* Deployment
* More detailed user statistics and game history

## What I Learned

This project gave me practical exposure to:

* Structuring a frontend/backend application
* Building REST API endpoints
* Connecting a React frontend to an ASP.NET Core backend
* Working with authentication and JWTs
* Using Entity Framework Core and relational databases
* Managing application state and user data
* Debugging communication between different parts of an application

## Author

**Edgaras Burbulis**

GitHub: https://github.com/burbalas
