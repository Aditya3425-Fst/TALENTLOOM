# Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional - can use in-memory mode)

## Running the Application

### Option 1: Using In-Memory Database (Quick Start - No MongoDB Required)

#### Step 1: Start Backend Server

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. The `.env` file is already configured with `USE_INMEMORY=true`, so you don't need MongoDB.

4. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Using in-memory database (MongoDB skipped)
   Server running on port 4000
   Environment: In-Memory
   ```

#### Step 2: Start Frontend Server

1. Open a **new terminal window/tab**

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

5. Open your browser and navigate to: **http://localhost:5173**

---

### Option 2: Using MongoDB (Production-like Setup)

#### Step 1: Install and Start MongoDB

1. Install MongoDB on your system (if not already installed)
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew:
   brew services start mongodb-community

   # On Linux:
   sudo systemctl start mongod

   # On Windows:
   # Start MongoDB from Services or run mongod.exe
   ```

#### Step 2: Configure Backend

1. Edit `backend/.env` file:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/learnato
   JWT_SECRET=learnato-forum-secret-key-change-in-production
   USE_INMEMORY=false
   FRONTEND_URL=http://localhost:5173
   ```

   Change `USE_INMEMORY=false` to use MongoDB.

#### Step 3: Start Backend Server

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   MongoDB connected successfully
   Server running on port 4000
   Environment: MongoDB
   ```

#### Step 4: Start Frontend Server

1. Open a **new terminal window/tab**

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to: **http://localhost:5173**

---

## Running Commands Summary

### Backend Commands
```bash
cd backend
npm install          # Install dependencies (first time only)
npm run dev          # Start development server with auto-reload
npm start            # Start production server
npm run lint         # Run linter
```

### Frontend Commands
```bash
cd frontend
npm install          # Install dependencies (first time only)
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

---

## Troubleshooting

### Backend Issues

**Port 4000 already in use:**
- Change `PORT` in `backend/.env` to a different port (e.g., `4001`)
- Update `VITE_API_BASE` in `frontend/.env` to match

**MongoDB connection error:**
- Make sure MongoDB is running
- Check `MONGO_URL` in `backend/.env`
- Or set `USE_INMEMORY=true` to skip MongoDB

**Module not found errors:**
- Run `npm install` in the backend directory
- Make sure you're using Node.js v18 or higher

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port
- Check the terminal output for the actual port

**Cannot connect to backend:**
- Make sure backend is running on port 4000
- Check `VITE_API_BASE` in `frontend/.env`
- Check CORS settings in backend

**Socket.IO connection errors:**
- Make sure backend is running
- Check `VITE_SOCKET_URL` in `frontend/.env`
- Check browser console for specific error messages

---

## Testing the Application

1. **Sign Up:**
   - Click "Sign Up" in the header
   - Fill in the form (email OR username, display name, password)
   - Click "Sign Up"

2. **Create a Post:**
   - After signing up, you'll be logged in
   - Click "New Post" button
   - Enter title and content
   - Click "Create Post"

3. **View Post:**
   - Click on any post to view details
   - See replies and upvote count

4. **Add Reply:**
   - Click on a post to view details
   - Scroll to the reply section
   - Enter your reply and click "Post Reply"

5. **Upvote:**
   - Click the upvote button (↑) on any post
   - Vote count increases

6. **Real-time Updates:**
   - Open the app in two browser windows
   - Create a post in one window
   - See it appear instantly in the other window!

---

## Environment Variables Reference

### Backend (.env)
- `PORT`: Server port (default: 4000)
- `MONGO_URL`: MongoDB connection string (default: mongodb://localhost:27017/learnato)
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `USE_INMEMORY`: Use in-memory database instead of MongoDB (true/false)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

### Frontend (.env)
- `VITE_API_BASE`: Backend API URL (default: http://localhost:4000)
- `VITE_SOCKET_URL`: Socket.IO server URL (default: http://localhost:4000/forum)

---

## Next Steps

- Create your first post!
- Invite others to join and start discussions
- Explore real-time updates by opening multiple browser windows

Happy coding! 🚀

