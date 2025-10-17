# Hacktoberfest 2025 – Backend

<img align="right" src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" width="120"/>

[![GitHub last commit](https://img.shields.io/github/last-commit/OpenCodeChicago/hacktoberfest-2025-backend)](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits/main)
[![CI](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/OpenCodeChicago/hacktoberfest-2025-backend)](LICENSE)
[![Open Issues](https://img.shields.io/github/issues/OpenCodeChicago/hacktoberfest-2025-backend)](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/OpenCodeChicago/hacktoberfest-2025-backend)](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/pulls)
[![Contributors](https://img.shields.io/github/contributors/OpenCodeChicago/hacktoberfest-2025-backend)](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/OpenCodeChicago/hacktoberfest-2025-backend?style=flat-square)](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/stargazers)

---

## Welcome Hacktoberfest Contributors!

This repo is part of [Open Code Chicago](https://opencodechicago.org)’s Hacktoberfest 2025 initiative.  
Whether it’s your **first pull request** or your **50th**, you are welcome here!

Contribute to real-world open source code, learn backend development, and collaborate with a global community.

### ⭐ Support the Project!
If you like this project, please consider giving it a ⭐ on GitHub!
More stars help us reach a wider audience, attract new contributors, and make your contributions even more visible and valuable for your portfolio or employer.
Thank you for helping our open source community grow!

![Hacktoberfest 2025 - Open Code Chicago](./docs/assets/hacktoberfest2025.png)

---

## Table of Contents

- [Description](#description)
- [Who is this for?](#who-is-this-for)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Features](#features)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Hacktoberfest Contribution Guide](#hacktoberfest-contribution-guide)
- [Documentation](#documentation)
- [Contributors](#contributors)
- [License](#license)
- [Feedback](#feedback)
- [Support](#support)
- [Connect with us](#connect-with-us)

---

## Description

This is the **backend project** for Hacktoberfest 2025.  
It’s built with **Node.js, Express.js, and MongoDB**, and set up for **easy contributions, testing, and collaboration**.  
New contributors can help with APIs, database models, and documentation.

---

## Who is this for?

- Beginners making their **first open source contribution**  
- Intermediate devs learning **Node.js, Express.js, REST APIs**  
- Experienced contributors who want to **mentor others**  

---

## Tech Stack

- **Node.js** – runtime  
- **Express.js** – server framework  
- **ESLint + Prettier** – linting & formatting  
- **Jest / Supertest** – (optional) testing  
- **GitHub Actions** – CI/CD pipelines  

---



## Quick Start

See the [Usage Guide](docs/usage.md) for full setup.

```bash
# Clone the repo
git clone https://github.com/OpenCodeChicago/hacktoberfest-2025-backend.git
cd hacktoberfest-2025-backend
```

```bash
# Install dependencies
npm install
```

```bash
# Start dev server
npm run dev
```

---

## Local Development Setup

To work on this project locally, follow these steps:

1. **Set up your own MongoDB database**
  - You can use [MongoDB Atlas](https://www.mongodb.com/atlas/database) (free tier) or run MongoDB locally.
2. **Copy environment variables**
  - Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
  - Fill in your own values for `MONGODB_URI` and other variables in `.env`.
3. **Seed the database**
  - Run the seed script to populate your local database with sample data:
    ```bash
    npm run seed
    ```
4. **Start the development server**
  - Run:
    ```bash
    npm run dev
    ```
5. **Lint your code before committing**
  - Run:
    ```bash
    npm run lint
    ```
6. **Ready to contribute!**
  - Pick an issue, create a branch, and start coding.

---

## Features

- Simple **Express.js backend** ready to extend
- Developer-friendly setup
- Preconfigured **linting & formatting**
- GitHub Actions for **CI/CD**
- Open for **community collaboration**

---

## Project Structure

```bash
hacktoberfest-2025-backend/
├── .github/              # Workflows, templates, CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── ...
├── docs/                 # Usage guide, FAQ
├── src/                  # Backend source code
│   ├── server.js         # Server entry
│   └── routes/           # Example routes
├── .eslintrc             # ESLint config
├── .prettierrc           # Prettier config
├── CONTRIBUTING.md       # How to contribute
├── CODE_OF_CONDUCT.md    # Code of conduct
├── SECURITY.md           # Security policy
├── LICENSE               # MIT License
└── README.md             # This file
```

---

## Contributing

We welcome contributions from **everyone**!
Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.  

---


## Hacktoberfest Contribution Guide

1. Fork this repository
2. Check our [Project Board](https://github.com/orgs/OpenCodeChicago/projects/2)
  - Look for an issue you’d like to work on
  - Comment on the issue to let others know you’re taking it
  - Maintainers may assign you to it (to avoid duplicates)
3. Create a new branch:
  ```bash
  git checkout -b my-new-feature
  ```
4. Set up your local environment (see above)
  - Make sure your `.env` is configured and your database is seeded
5. Make your changes (small, clear commits)
6. Run `npm run lint` before pushing
7. Open a Pull Request
  - All PRs are automatically checked for linting in CI
  - Tip: Start with [Good First Issues](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/labels/good%20first%20issue)

---

## Documentation

- [Usage Guide](docs/usage.md)  
- [FAQ](docs/faq.md)  
- [Contributing Guidelines](CONTRIBUTING.md)  
- [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)  
- [Code Owners](.github/CODEOWNERS)  
- [Issue Templates](.github/ISSUE_TEMPLATE/)  

---

## Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://alexsmagin.dev"><img src="https://avatars.githubusercontent.com/u/107826794?v=4?s=100" width="100px;" alt="Alex Smagin"/><br /><sub><b>Alex Smagin</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=Alexandrbig1" title="Code">💻</a> <a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=Alexandrbig1" title="Documentation">📖</a> <a href="#maintenance-Alexandrbig1" title="Maintenance">🚧</a> <a href="#projectManagement-Alexandrbig1" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://profilepress.vercel.app/public/aemon-targaryen#projects"><img src="https://avatars.githubusercontent.com/u/209061965?v=4?s=100" width="100px;" alt="Kaushik KS"/><br /><sub><b>Kaushik KS</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=kaushikkanduri" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/UsamaBinKashif"><img src="https://avatars.githubusercontent.com/u/80617842?v=4?s=100" width="100px;" alt="Usama Ahmed"/><br /><sub><b>Usama Ahmed</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=UsamaBinKashif" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/deepesh224-ux"><img src="https://avatars.githubusercontent.com/u/185037270?v=4?s=100" width="100px;" alt="Deepesh Dey"/><br /><sub><b>Deepesh Dey</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=deepesh224-ux" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mbm08"><img src="https://avatars.githubusercontent.com/u/185241615?v=4?s=100" width="100px;" alt="mbm08"/><br /><sub><b>mbm08</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=mbm08" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/shiv7shukla"><img src="https://avatars.githubusercontent.com/u/185540301?v=4?s=100" width="100px;" alt="shiv7shukla"/><br /><sub><b>shiv7shukla</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=shiv7shukla" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://dikamjit-borah.github.io"><img src="https://avatars.githubusercontent.com/u/36004021?v=4?s=100" width="100px;" alt="Dikamjit Borah"/><br /><sub><b>Dikamjit Borah</b></sub></a><br /><a href="https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/commits?author=dikamjit-borah" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org) specification.  

> Want to be listed here? [See how to add yourself!](./CONTRIBUTING.md#get-recognized-with-the-all-contributors-bot)

Contributions of any kind welcome!

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Feedback

We welcome feedback and suggestions to improve the template’s functionality and usability.  
Feel free to [open an issue](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/issues) or [start a discussion](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/discussions).  

---

## Support

📧 Contact: [info@opencodechicago.org](mailto:info@opencodechicago.org)

---

## Languages and Tools

---

## Connect with us

<div align="center">
<a href="https://www.youtube.com/@AlexSmaginDev" target="_blank">
<img src="https://img.shields.io/badge/youtube-%23FF0000.svg?&style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube" style="margin-bottom: 5px;" />
</a>
<a href="https://discord.gg/t6MGsCqdFX" target="_blank">
    <img src="https://img.shields.io/badge/discord-%237289DA.svg?&style=for-the-badge&logo=discord&logoColor=white" alt="Discord" style="margin-bottom: 5px;" />
</a>
<a href="https://www.linkedin.com/company/open-code-chicago" target="_blank">
<img src=https://img.shields.io/badge/linkedin-%231E77B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white alt=linkedin style="margin-bottom: 5px;" />
</a>
<a href="https://www.facebook.com/profile.php?id=61580367112591" target="_blank">
<img src="https://img.shields.io/badge/facebook-%231877F2.svg?&style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" style="margin-bottom: 5px;" />
</a>

</div>
