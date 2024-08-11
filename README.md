# Contact Management System

This is a contact management system built with Node.js, Express, Sequelize, MySQL, and React. The project uses AWS Lambda for backend functions and S3 for hosting the frontend.

## Features

- User authentication with JWT
- Add, edit, delete, and search contacts
- Secure API endpoints with token verification

## Installation

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install dependencies
    ```bash
   npm install
   ```
5. Run the backend locally
    ```bash
   npm start
   ```

### Frontend

1. Navigate to the `fronend` directory:
    ```bash
   cd frontend
    ```
3. Install dependencies
    ```bash
   npm install
    ```
5. Run the frontend locally
    ```bash
   npm start
   ```

## Deployment

### Backend

   Deploy the Lambda function:
   Zip the backend directory contents and upload to AWS Lambda.

### Frontend

   Build and deploy the frontend to S3:
   ```bash
   npm run build
   aws s3 sync build/ s3://your-s3-bucket-name
   ```

## API Endpoints

### Authentication

- `POST /auth/login`: Authenticate user and get a token.

### Contacts

- `GET /contacts`: Get all contacts.
- `GET /contacts/:id`: Get a specific contact by ID.
- `POST /contacts`: Create a new contact.
- `PUT /contacts/:id`: Update a contact by ID.
- `DELETE /contacts/:id`: Delete a contact by ID.

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
