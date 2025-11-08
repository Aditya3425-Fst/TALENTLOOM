# MongoDB Setup Guide

This guide will help you set up MongoDB for the Learnato Forum application.

## Installation

### macOS (using Homebrew)

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install MongoDB Community Edition**:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

3. **Start MongoDB**:
   ```bash
   brew services start mongodb-community
   ```

4. **Verify MongoDB is running**:
   ```bash
   brew services list
   # You should see mongodb-community started
   ```

### Linux (Ubuntu/Debian)

1. **Import the public key**:
   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Add MongoDB repository**:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Update packages and install MongoDB**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Verify MongoDB is running**:
   ```bash
   sudo systemctl status mongod
   ```

### Windows

1. **Download MongoDB Installer**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows platform
   - Download the MSI installer

2. **Run the Installer**:
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Click "Install"

3. **Verify Installation**:
   - MongoDB should start automatically as a Windows service
   - Check Services (services.msc) to verify MongoDB is running

### Docker (Cross-platform)

If you have Docker installed, you can run MongoDB in a container:

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb-data:/data/db \
  mongo:latest
```

To stop: `docker stop mongodb`
To start: `docker start mongodb`
To remove: `docker rm mongodb`

## Verify MongoDB Installation

1. **Check MongoDB version**:
   ```bash
   mongod --version
   ```

2. **Connect to MongoDB shell**:
   ```bash
   mongosh
   # or
   mongo  # for older versions
   ```

3. **Test connection**:
   ```javascript
   // In MongoDB shell
   db.version()
   // Should return your MongoDB version
   ```

4. **Exit MongoDB shell**:
   ```bash
   exit
   ```

## Configure Backend

1. **Update backend/.env file**:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/learnato
   JWT_SECRET=learnato-forum-secret-key-change-in-production
   USE_INMEMORY=false
   FRONTEND_URL=http://localhost:5173
   ```

   **Important**: Set `USE_INMEMORY=false` to use MongoDB.

## Start the Application

1. **Make sure MongoDB is running**:
   ```bash
   # macOS
   brew services list | grep mongodb
   
   # Linux
   sudo systemctl status mongod
   
   # Windows
   # Check Services panel
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm install  # First time only
   npm run dev
   ```

   You should see:
   ```
   MongoDB connected successfully
   Server running on port 4000
   Environment: MongoDB
   ```

3. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install  # First time only
   npm run dev
   ```

4. **Open browser**: http://localhost:5173

## MongoDB Management

### Using MongoDB Compass (GUI)

1. **Download MongoDB Compass**:
   - Visit: https://www.mongodb.com/products/compass
   - Download and install

2. **Connect to MongoDB**:
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Database**:
   - You'll see the `learnato` database
   - Browse collections: `users`, `posts`, `replies`

### Using MongoDB Shell

1. **Connect to database**:
   ```bash
   mongosh
   ```

2. **Switch to learnato database**:
   ```javascript
   use learnato
   ```

3. **View collections**:
   ```javascript
   show collections
   ```

4. **View documents**:
   ```javascript
   db.users.find()
   db.posts.find()
   db.replies.find()
   ```

5. **Count documents**:
   ```javascript
   db.users.countDocuments()
   db.posts.countDocuments()
   db.replies.countDocuments()
   ```

### Backup Database

```bash
# Create backup
mongodump --db=learnato --out=./backup

# Restore backup
mongorestore --db=learnato ./backup/learnato
```

### Reset Database

```bash
# Drop database (WARNING: This deletes all data!)
mongosh
use learnato
db.dropDatabase()
```

## Troubleshooting

### MongoDB won't start

**macOS**:
```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

**Linux**:
```bash
# Check status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check logs
sudo journalctl -u mongod
```

**Windows**:
- Open Services (services.msc)
- Find "MongoDB" service
- Right-click and select "Start"

### Connection refused error

1. **Check if MongoDB is running**:
   ```bash
   # macOS/Linux
   ps aux | grep mongod
   
   # Or check port
   lsof -i :27017
   ```

2. **Check MongoDB logs for errors**

3. **Verify connection string** in `backend/.env`:
   ```
   MONGO_URL=mongodb://localhost:27017/learnato
   ```

### Port 27017 already in use

1. **Find process using port 27017**:
   ```bash
   # macOS/Linux
   lsof -i :27017
   
   # Windows
   netstat -ano | findstr :27017
   ```

2. **Stop the conflicting process or change MongoDB port**

### Permission denied errors

**Linux**:
```bash
# Fix data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
```

## MongoDB Atlas (Cloud Option)

If you prefer a cloud-hosted MongoDB:

1. **Sign up for MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

2. **Create a free cluster**

3. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update backend/.env**:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/learnato?retryWrites=true&w=majority
   ```

5. **Add your IP to whitelist** in Atlas dashboard

## Next Steps

- ✅ MongoDB is installed and running
- ✅ Backend is configured to use MongoDB
- ✅ Data will persist across server restarts
- 🚀 Start creating posts and building your forum!

## Additional Resources

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB University: https://university.mongodb.com/
- MongoDB Compass: https://www.mongodb.com/products/compass

