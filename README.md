## Task Management Application
This is a task management application built using Node.js, Express, MongoDB, and JWT-based authentication. It allows for task creation, editing, and management with role-based access control. The application has an admin role that can manage users and tasks, a manager role that can manage their tasks and those of assigned users, and a user role that can manage their own tasks.

## Features
User Registration and Login with JWT authentication.
Role-based Access Control (Admin, Manager, and User roles).
Admin can create, edit, delete, and view all users.
Managers can view and manage tasks for assigned users.
Users can manage their own tasks.
Task management with CRUD operations.

## Technologies Used
Node.js
Express.js
MongoDB with Mongoose
JWT (JSON Web Tokens) for authentication
bcrypt for password hashing
Validation with express-validator
Role-based authorization

# Prerequisites
Node.js installed on your system
MongoDB installed and running locally or a MongoDB cloud instance (e.g., MongoDB Atlas)
Postman or any API testing tool for testing the APIs

# Getting Started
1. Clone the repository
git clone https://github.com/ahmad5373/task-management-Nodejs.git

# cd task-management-app
2. Install dependencies
npm install
3. Set up environment variables
Create a .env file in the root directory and add the following environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8080
4. Run the application
npm start
The application will run at http://localhost:8080.

# API Endpoints
User Routes
POST /api/users/register

# Admin-only: Registers a new user (Admin, Manager, or User).
Body parameters:
name (String)
email (String)
password (String)
role (Integer: 1 for Admin, 2 for Manager, 3 for User)
assignedUsers (Array of User IDs for Managers)
POST /api/users/login

# Logs in a user and returns a JWT token.
Body parameters:
email (String)
password (String)
GET /api/users

Admin-only: Fetches all users except the logged-in user.
GET /api/users/:id

Admin-only: Fetches user details by ID, including assigned users and tasks.
PUT /api/users/:id

Admin-only: Edits user details.
DELETE /api/users/:id

Admin-only: Deletes a user and all their associated tasks.
Task Routes
POST /api/tasks/create

# Creates a new task.
Body parameters:
title (String)
description (String)
dueDate (Date)
status (String: Pending, In Progress, Completed)
GET /api/tasks

Fetches tasks based on the role of the logged-in user:
Admin: All tasks
Manager: Tasks for themselves and their assigned users
User: Their own tasks
GET /api/tasks/:id

Fetches task details by task ID.
PUT /api/tasks/:id

Updates a task based on task ID.
DELETE /api/tasks/:id

Deletes a task by task ID.

## Validation
User registration and task creation have validation using express-validator.
The following fields are validated:
Email format
Required fields such as name, email, password for user registration, and title, description for task creation.
Authentication and Authorization
All routes except for /login are protected using JWT.
Role-based authorization is implemented:
Admin (Role 1) has full access.
Manager (Role 2) can manage their own tasks and assigned users’ tasks.
User (Role 3) can only manage their own tasks.

##  Structure
├── config
│   └── db.js              # MongoDB connection setup
├── controllers
│   ├── userController.js   # User-related controllers
│   └── taskController.js   # Task-related controllers
├── models
│   ├── user.js             # User schema/model
│   └── task.js             # Task schema/model
├── middlewares
│   ├── auth.js             # Authentication and authorization middleware
├── validations
│   ├── index.js            # Validation rules for requests
├── routes
│   ├── userRoutes.js       # User-related routes
│   └── taskRoutes.js       # Task-related routes
├── utility
│   └── api.js              # Utility functions for API responses
├── .env                    # Environment variables
├── server.js               # Main server file
└── README.md               # Project documentation

# Register as an Admin

Log in with your credentials to receive a JWT token.
Use the token to access protected routes by including it in the request headers:
Authorization: Bearer <token>
License
This project is licensed under the MIT License - see the LICENSE file for details.
