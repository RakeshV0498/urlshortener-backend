# URL Shortener Backend API Documentation

This document provides detailed documentation for the RESTful APIs provided by the URL Shortener backend server.

## Base URL

All API endpoints are relative to the base URL of the backend server.

Base URL: http://localhost:8100/

markdown
Copy code

## Authentication

### Register User

Registers a new user.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Request Body:**
  - `name` (string, required): User's name.
  - `email` (string, required): User's email.
  - `password` (string, required): User's password.
- **Success Response:**
  - **Code:** 201 CREATED
  - **Content:** `{ message: "User registered successfully" }`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ error: "Email already exists" }`

### Login User

Logs in an existing user.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  - `email` (string, required): User's email.
  - `password` (string, required): User's password.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ token: "<JWT_token>" }`
- **Error Response:**
  - **Code:** 401 UNAUTHORIZED
  - **Content:** `{ error: "Invalid credentials" }`

### Forgot Password

Initiates the process for resetting the user's password.

- **URL:** `/auth/forgot-password`
- **Method:** `POST`
- **Request Body:**
  - `email` (string, required): User's email.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ message: "Password reset email sent successfully" }`
- **Error Response:**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ error: "User not found" }`

### Reset Password

Resets the user's password using a password reset token.

- **URL:** `/auth/reset-password/:token`
- **Method:** `POST`
- **URL Params:**
  - `token` (string, required): Password reset token.
- **Request Body:**
  - `password` (string, required): New password.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ message: "Password reset successfully" }`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ error: "Invalid token" }`

## URL Management

### Shorten URL

Shortens a long URL.

- **URL:** `/urls/shorten`
- **Method:** `POST`
- **Request Body:**
  - `longURL` (string, required): Long URL to be shortened.
- **Success Response:**
  - **Code:** 201 CREATED
  - **Content:** `{ shortURL: "<shortened_url>" }`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ error: "Invalid URL" }`

### Get All URLs

Retrieves all URLs created by the authenticated user.

- **URL:** `/urls`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `[{ id, shortURL, longURL, createdAt }]`

### Redirect Short URL

Redirects to the original long URL associated with the given short URL.

- **URL:** `/:shortURL`
- **Method:** `GET`

## Analytics

### Get Daily URL Count

Retrieves the count of URLs created each day.

- **URL:** `/analytics/daily-count`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `[{ date, count }]`

### Get Monthly URL Count

Retrieves the count of URLs created each month.

- **URL:** `/analytics/monthly-count`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `[{ date, count }]`
