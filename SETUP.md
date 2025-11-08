# Setup Instructions

## Prerequisites

Before starting, make sure you have:
- Node.js (v18 or higher) installed
- **MongoDB installed and running** (required - see MONGODB_SETUP.md for installation)

## Step 1: Install and Start MongoDB

**macOS** (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux** (Ubuntu/Debian):
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows**:
- Download and install from: https://www.mongodb.com/try/download/community
- MongoDB will start as a Windows service automatically

**Docker** (Alternative):
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
exit
```

For detailed MongoDB setup, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)

## Step 2: Create Backend .env File

The `.env` file has already been created in the `backend` directory with MongoDB configuration:

```env
PORT=4000
MONGO_URL=mongodb://localhost:27017/learnato
JWT_SECRET=learnato-forum-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

**Configuration:**
- `MONGO_URL` - MongoDB connection string (required)
- Update `MONGO_URL` if your MongoDB is on a different host/port
- **Note**: MongoDB is required - in-memory mode has been removed

## Step 3: Create Frontend .env File

Create a file named `.env` in the `frontend` directory with the following content:

```env
VITE_API_BASE=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000/forum
```

## Step 4: Run Backend

1. Open Terminal 1
2. Navigate to backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   MongoDB connected successfully
   Server running on port 4000
   Environment: MongoDB
   ```

   **If you see an error:**
   - Make sure MongoDB is running (see Step 1)
   - Verify `MONGO_URL` in `backend/.env` is correct
   - Check MongoDB connection: `mongosh` (should connect)

## Step 5: Run Frontend

1. Open Terminal 2 (new terminal window)
2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

5. Open your browser and go to: **http://localhost:5173**

---

## Quick Commands Reference

### Backend
```bash
cd backend
npm install    # First time only
npm run dev    # Start development server
```

### Frontend
```bash
cd frontend
npm install    # First time only
npm run dev    # Start development server
```

---

## Troubleshooting

### Backend won't start
- Make sure you created the `.env` file in the `backend` directory
- Check that Node.js is installed: `node --version` (should be v18+)
- **MongoDB is required** - make sure MongoDB is installed and running
- Check MongoDB connection: `mongosh` (should connect)
- Verify `MONGO_URL` in `backend/.env` is correct
- Make sure port 4000 is not already in use

### Frontend won't start
- Make sure you created the `.env` file in the `frontend` directory
- Check that the backend is running first
- Make sure port 5173 is not already in use (Vite will auto-use next port)

### Cannot connect to backend
- Verify backend is running on port 4000
- Check `VITE_API_BASE` in `frontend/.env` matches backend URL
- Check browser console for errors

### MongoDB connection errors
- **MongoDB is required** - the application no longer supports in-memory mode
- Make sure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check MongoDB logs for errors
- Verify `MONGO_URL` in `backend/.env` is correct
- Try connecting manually: `mongosh` or `mongo`
- See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed troubleshooting
- See [MONGODB_COMPASS_GUIDE.md](./MONGODB_COMPASS_GUIDE.md) for viewing data in MongoDB Compass

