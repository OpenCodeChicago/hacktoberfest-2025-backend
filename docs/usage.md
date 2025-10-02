# Usage Guide

This document explains how to set up and run the backend locally.

---

## Prerequisites

- Node.js (v20 or later)
- npm (comes with Node.js)
- MongoDB (local or Atlas connection)

---

## Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/OpenCodeChicago/hacktoberfest-2025-backend.git
   cd hacktoberfest-2025-backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your own values for `MONGODB_URI` and other variables.
   Example:
   ```bash
   PORT=5000
   # Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/hacktoberfest
   # or MongoDB Atlas
   # MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hacktoberfest
   ```
4. **Seed the database**
   Run the seed script to populate your local database with sample data:
   ```bash
   npm run seed
   ```
5. **Start the server**
   ```bash
   npm run dev
   ```
   By default the API will be available at `http://localhost:5000`

---

## Project Scripts

- `npm run dev` → start server with auto-reload (Nodemon)
- `npm run start` → start production server
- `npm run lint` → run ESLint checks
- `npm run test` → run tests (if available)

---

## Using Docker

1. **Build the image**
   ```bash
   docker build -t hacktoberfest-backend .
   ```
2. **Run the container**
   ```bash
   docker run -d -p 5000:5000 --env-file .env hacktoberfest-backend
   ```

---

> **Note:** Automated CI checks are included and run on every push or pull request via GitHub Actions. See the Actions tab on GitHub for results.

---

## Workflow for Contributing

1. Fork this repository
2. Create a new branch for your feature or fix
3. Commit your changes
4. Open a Pull Request (PR) with a clear description of what you did

For more details, see [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Troubleshooting

- If you see an error like **command not found: npm**, make sure **Node.js** and **npm** are installed.
- If the dev server doesn’t start, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
- Still stuck? Ask in [main Hacktoberfest Discussion](https://github.com/orgs/OpenCodeChicago/discussions/2) or on [Discord](https://discord.gg/t6MGsCqdFX)

---

## ⭐ Support the Project

If you find this project helpful, please consider starring it on GitHub! It helps us grow and reach more contributors.