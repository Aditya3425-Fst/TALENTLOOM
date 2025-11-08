# Learnato Discussion Forum

A real-time discussion forum microservice built with React, Node.js, Express, MongoDB, and Socket.IO. This application enables users to create posts, add replies, upvote content, and see updates in real-time.

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │◄───────►│   Express   │◄───────►│   MongoDB   │
│  Frontend   │  HTTP   │   Backend   │         │             │
│  (Vite)     │         │  (Node.js)  │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │
      │                        │
      └──────── Socket.IO ─────┘
         (Real-time Updates)
```

## Features

### Core Features
- ✅ **Authentication**: Signup, Login, Logout with JWT tokens
- ✅ **Create Posts**: Users can create posts with title and content
- ✅ **List Posts**: View all posts, sortable by recent or votes
- ✅ **View Post**: View single post with all replies
- ✅ **Add Reply**: Add replies to posts
- ✅ **Upvote Post**: Upvote posts (one vote per user per post)
- ✅ **Real-time Updates**: Socket.IO for live updates
- ✅ **Responsive UI**: Mobile-friendly with Tailwind CSS

### Technical Features
- **MongoDB Database**: Persistent data storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Joi validation for all inputs
- **Error Handling**: Consistent error responses
- **Real-time Events**: Socket.IO broadcasts for posts, replies, and upvotes

## Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

## Project Structure

```
learnato-forum/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── posts.controller.js
│   │   ├── db/
│   │   │   ├── mongo.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   ├── error.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Reply.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── posts.routes.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   └── posts.service.js
│   │   ├── sockets/
│   │   │   └── index.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── post.validator.js
│   │   ├── app.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostList.jsx
│   │   │   ├── PostDetailView.jsx
│   │   │   ├── ReplyList.jsx
│   │   │   ├── NewPostForm.jsx
│   │   │   ├── NewReplyForm.jsx
│   │   │   ├── UpvoteButton.jsx
│   │   │   └── SortToggle.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── PostDetail.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- **MongoDB** (required)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/learnato
   JWT_SECRET=your-secret-key-here
   FRONTEND_URL=http://localhost:5173
   ```

   **Note**: MongoDB must be installed and running before starting the backend.

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE=http://localhost:4000
   VITE_SOCKET_URL=http://localhost:4000/forum
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## API Documentation

### Base URL
All API endpoints are prefixed with `/api`

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",        // either email or username required
  "displayName": "User Name",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "displayName": "User Name"
  },
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",  // or username
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "displayName": "User Name"
  },
  "token": "jwt_token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "displayName": "User Name"
  }
}
```

### Forum Endpoints

#### Create Post (Auth Required)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Post Title",
  "content": "Post content..."
}
```

**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "post_id",
    "title": "Post Title",
    "content": "Post content...",
    "votes": 0,
    "authorId": "user_id",
    "author": {
      "id": "user_id",
      "displayName": "User Name"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### List Posts
```http
GET /api/posts?sort=recent&page=1&limit=10
```

**Query Parameters:**
- `sort`: `recent` or `votes` (default: `recent`)
- `page`: Page number (default: `1`)
- `limit`: Items per page (default: `10`, max: `100`)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### Get Post by ID
```http
GET /api/posts/:id
```

**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "post_id",
    "title": "Post Title",
    "content": "Post content...",
    "votes": 5,
    "authorId": "user_id",
    "author": {
      "id": "user_id",
      "displayName": "User Name"
    },
    "replies": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Reply (Auth Required)
```http
POST /api/posts/:id/replies
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Reply content..."
}
```

**Response:**
```json
{
  "success": true,
  "reply": {
    "_id": "reply_id",
    "postId": "post_id",
    "content": "Reply content...",
    "authorId": "user_id",
    "author": {
      "id": "user_id",
      "displayName": "User Name"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Upvote Post (Auth Required)
```http
POST /api/posts/:id/upvote
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "post_id",
    "votes": 6,
    ...
  }
}
```

### Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR`: Input validation failed
- `AUTH_REQUIRED`: Authentication required
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., user already exists)
- `INTERNAL_ERROR`: Internal server error

## WebSocket Events

### Socket.IO Namespace: `/forum`

### Client to Server Events

#### Connect
```javascript
socket.on('connect', () => {
  console.log('Connected');
});
```

### Server to Client Events

#### Post Created
```javascript
socket.on('post:created', (data) => {
  console.log('New post:', data.post);
});
```

#### Post Updated (Upvote)
```javascript
socket.on('post:updated', (data) => {
  console.log('Post updated:', data.post);
});
```

#### Reply Created
```javascript
socket.on('reply:created', (data) => {
  console.log('New reply:', data.reply);
  console.log('Post ID:', data.postId);
});
```

## Data Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  displayName: String (2-40 chars),
  passwordHash: String,
  createdAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  title: String (4-120 chars),
  content: String (1-10000 chars),
  votes: Number (default: 0),
  voters: [ObjectId],
  authorId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Reply
```javascript
{
  _id: ObjectId,
  postId: ObjectId (ref: Post),
  authorId: ObjectId (ref: User),
  content: String (1-5000 chars),
  createdAt: Date
}
```

## Validation Rules

### Authentication
- **Email**: Valid email format
- **Username**: Alphanumeric, 3-30 chars
- **Note**: Either email or username is required (user must provide at least one)
- **Password**: Minimum 6 characters
- **Display Name**: 2-40 characters

### Posts
- **Title**: 4-120 characters
- **Content**: 1-10,000 characters

### Replies
- **Content**: 1-5,000 characters

## Running the Application

### Development Mode

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Known Limitations

1. **No Email Verification**: Users can signup without email verification
2. **No Password Reset**: Password reset functionality is not implemented
3. **No Search**: Post search functionality is not included
4. **No Pagination UI**: Backend supports pagination, but frontend loads all posts
5. **No Mark as Answered**: No way to mark replies as solutions

## Deployment Notes

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables:
   - `PORT` (usually auto-set by platform)
   - `MONGO_URL` (MongoDB connection string - required)
   - `JWT_SECRET` (secure random string)
   - `FRONTEND_URL` (your frontend URL)

2. Build command: `npm run build` (if needed)
3. Start command: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Set environment variables:
   - `VITE_API_BASE` (your backend URL)
   - `VITE_SOCKET_URL` (your Socket.IO URL)

2. Build command: `npm run build`
3. Output directory: `dist`

## License

ISC

## Inspiration

Learnato Forum is designed to empower learning through conversation. It provides a simple, fast, and clean platform for communities to discuss topics, share knowledge, and learn from each other. The real-time updates ensure that users stay engaged with the latest discussions, making it an ideal platform for educational communities and knowledge-sharing forums.

