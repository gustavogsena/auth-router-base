# Base Server with Authentication

This is a base project for a server with authentication using Typescript, Routing-contollers, Prisma, Express and Express-Session.

## Setup

### Prerequisites

- Node.js
- NPM (or Yarn)
- Redis server
- Any Prisma compatible database

### Installation

1. Clone the repository:

```
git clone https://github.com/Gaudereto-Sena/auth-router-base.git
```

2. Install dependencies:

```
cd auth-router-base
npm install
```

### Environment Variables

Rename the `.env.example` file to `.env` and configure the necessary environment variables.

## Usage

To start the server, run:

```
npm run server:dev
```

The routes can be easily tested using the .rest files

## Project Structure

- `src/`
  - `user/`:
    - `dtos/`: User DTO files
    - `user.controller.ts` Controller to handle user routes
    - `user.repository.ts` Repository to handle user routes
    - `user.services.ts` Services to handle user routes

  - `types/`: Application type definitions 
  
  - `utils/`: General utilities
    - `middlewares/`: Custom middlewares
    - `interceptors/`: Custom interceptors
    - `validators/`: Custom validators
    - `services/`: Generic app services
    - `errors/`: Custom errors
  - `index.ts`: Routing Controller Express configuration and initialization

- `test/` Test files (unit and integration tests)

## Contribution

Feel free to contribute with improvements, bug fixes, or new features. Open an issue to discuss your ideas or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
