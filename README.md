# Blog Platform API

A RESTful API for a blog platform built with Express.js and MySQL.

## Features

- User registration and authentication
- Create, read, update, and delete blog posts
- Tag management
- Proper error handling
- Database indexing for performance

## Database Schema

The database consists of four tables:

- `users`: Stores user information
- `posts`: Stores blog posts
- `tags`: Stores predefined tags
- `post_tags`: Junction table for the many-to-many relationship between posts and tags

## Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/blog-platform.git
   cd blog-platform
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file based on the `.env.example` file:
   \`\`\`
   cp .env.example .env
   \`\`\`

4. Update the `.env` file with your MySQL credentials and JWT secret.

5. Set up the database:
   \`\`\`
   mysql -u your_username -p < database/runInit.sql
   \`\`\`

## Running the Application

Start the server:
\`\`\`
npm start
\`\`\`

For development with auto-restart:
\`\`\`
npm run dev
\`\`\`

The server will run on http://localhost:3000 by default.
