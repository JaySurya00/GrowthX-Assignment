# GrowthX Assignment

This project is a backend API for a task management system where users can register, upload assignments, and admins can manage assignments by accepting or rejecting them.

## Project Structure

```plaintext
GrowthX-assignment
│
├── /config
│   └── db.js                  # Database connection settings
│
├── /errors                   
│   ├── bad-request-error.js      
│   └── database-connection-error.js        
│   ├── not-authorize-error.js    
│   └── request-validation-error.js        
│  
├── /middlewares
│   ├── error-handler.js       # Global error handling middleware
│   └── validate-auth.js         # Authentication handling middleware
│   ├── validate-req.js       # Request validator and sanitizers handling middleware
│   └── validate-auth.js         # Authentication handling middleware
│
├── /models
│   ├── admin-model.js           # Admin model schema
│   ├── task-model.js            # Assignment model schema
│   └── user-model.js            # User model schema
│   ├── accepted-task-model.js   # Accepted task model schema
│   └── rejected-task-model.js   # Rejected task model schema
│
├── /routes
│   ├── adminRoutes.js           # Admin-related routes
│   └── userRoutes.js            # User-related routes
│
├── /utils
│   ├── bcrypt.js                # Password hashing and comparing.
│   └── generate-token.js        # Token generation for JWT
│
├── app.js                        
├── .index.js     
├── .env                         # Environment variables (like database URL, JWT secret, etc.)
├── .gitignore                   # Ignoring unnecessary files from Git
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Lock file for dependencies
├── server.js                    # Entry point of the application
└── README.md                    # Instructions and documentation

---

## Endpoints

### User Endpoints:
- **POST** `/api/users/register` - Register a new user.
- **POST** `/api/users/login` - User login.
- **POST** `/api/users/upload` - Upload an assignment.
- **GET** `/api/users/admins` - Fetch all admins.

### Admin Endpoints:
- **POST** `/api/admins/register` - Register a new admin.
- **POST** `/api/admins/login` - Admin login.
- **GET** `/api/admins/assignments` - View assignments tagged to the admin.
- **POST** `/api/admins/assignments/:id/accept` - Accept an assignment.
- **POST** `/api/admins/assignments/:id/reject` - Reject an assignment.

---

## How to Setup the Project

### 1. Environment Setup
Create a `.env` file in the root folder of the project with the following keys and their respective values:

### 2. Install Dependencies
Run the following command to install the project dependencies:
```bash
npm install
### 2. Start Project
npm start
