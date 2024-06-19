# URL Shortener Backend

This is the backend server for the URL Shortener web application. It provides RESTful APIs for managing users, URLs, and analytics.

## Technologies Used

- Node.js: JavaScript runtime for building the server-side application.
- Express.js: Web application framework for Node.js used for building APIs.
- MongoDB: NoSQL database used for storing user data, URLs, and analytics.
- Mongoose: MongoDB object modeling tool used for interacting with the database.
- JSON Web Tokens (JWT): Used for user authentication and authorization.

## Getting Started

Follow these instructions to set up and run the backend server locally.

### Installation

1. Clone the repository:

git clone <repository_url>

markdown
Copy code

2. Install dependencies:

cd server
npm install

javascript
Copy code

3. Set up environment variables:

Create a `.env` file in the root directory of the `server` folder and add the following variables:

PORT=3001
MONGODB_URI=<mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

typescript
Copy code

Replace `<mongodb_connection_string>` with your MongoDB connection string and `<your_jwt_secret>` with a secret key for JWT.

### Running the Server

To start the backend server, run:

npm start

csharp
Copy code

The server will run on the port specified in the `.env` file (default is 3001).

## API Documentation

Detailed documentation for the RESTful APIs provided by the backend server can be found [here](API_DOCUMENTATION.md).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the [MIT License](LICENSE).
