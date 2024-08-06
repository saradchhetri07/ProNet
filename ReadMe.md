# ProNet

ProNet is a comprehensive professional networking platform that combines social networking features with job-related functionalities. It provides users with a space to connect, share, and advance their careers.

## Features

- **User Authentication**: Secure sign-up and login system.
- **Profile Management**: Create and edit detailed professional profiles.
- **Social Networking**:
  - Follow other users
  - Friend recommendations based on connections
  - View and interact with user posts
- **Job-related Features**:
  - Create and post job listings
  - Apply for jobs
  - Job recommendations based on user profile and interests
- **Content Management**:
  - Create, edit, and delete posts
  - Create, edit, and delete job listings
- **Search Functionality**: Find users, posts, and job listings

## Technologies Used

- **Frontend**: Vanilla TypeScript, HTML, CSS
- **Backend**: Node.js, TypeScript,Knex query builder
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm (Node Package Manager)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/pro-net.git
   cd pro-net
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=
   JWT_SECRET=
   DB_CLIENT=
   DB_PORT=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

4. Set up the database:

   ```bash
   npx knex migrate:latest
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Usage

- Access the application at `http://localhost:3000`
- Sign up or log in to start using the platform
- Create and manage your profile
- Connect with other users and follow their posts
- Create and apply for job listings

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Log in a user

### User Profile

- **GET /users/:id**: Get user profile by ID

### Social Networking

- \*\*POST /connect/:id/: Follow a user

### Posts

- **GET /posts**: Get all posts
- **POST /posts**: Create a new post

### Job Listings

- **GET /jobs**: Get all job listings
- **POST /jobs**: Create a new job listins
- **DELETE /jobs/:id**: Delete a job listing

## Contribution

We welcome contributions from the community! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Create a new Pull Request.
