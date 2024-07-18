#  Task Management System Backend

## Description

This is a  backend for a task management system built with Node.js. It supports the following functionalities:

- Retrieve tasks
- Add tasks
- Update tasks
- Delete tasks
- Search tasks by name or author

The system implements role-based authentication to differentiate between Admin and User roles:
- **Admin**: Can perform all operations (get, add, update, delete, search) on any task.
- **User**: Can only perform operations on tasks they own.


## Technology Stack

- Node.js, Typescript
- Optionally, GraphQL for search functionality
- ExpressJs for structured codebase
- JWT for authentication
- Database: MongoDB 

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/task-management-system-backend.git
    cd task-management-system-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret
    DATABASE_URL=your_database_url
    ```

4. Start the server:
    ```sh
    npm start
    ```

## API Endpoints
.

### RESTful APIs

1. **POST user/register**
    - **Description**: register the user using email,username&password
    - **Roles**: Admin, User
    - **Returns**: success message

1. **POST user/login**
    - **Description**: Login the user using email & password
    - **Roles**: Admin, User
    - **Returns**: Token 

1. **GET /tasks**
    - **Description**: Retrieves tasks based on the user's role.
    - **Roles**: Admin, User
    - **Returns**: List of tasks

2. **POST /tasks**
    - **Description**: Adds a new task.
    - **Roles**: Admin, User
    - **Request Body**: Task details (e.g., title, description)
    - **Returns**: Newly created task object

3. **PUT /tasks/:taskId**
    - **Description**: Updates an existing task.
    - **Roles**: Admin, User
    - **Parameters**: Task ID, Updated task details
    - **Returns**: Updated task object

4. **DELETE /tasks/:taskId**
    - **Description**: Deletes a task.
    - **Roles**: Admin, User
    - **Parameters**: Task ID
    - **Returns**: Success message or confirmation

### GraphQL API

1. **Query: searchTasks**(http://localhost:3000/graphql/search)
    - **Description**: Searches tasks based on name (for users) or name and author (for admins).
    - **Roles**: Admin, User
    - **Parameters**: Search criteria (name, author for admin)
    - **Returns**: List of tasks matching the search criteria

