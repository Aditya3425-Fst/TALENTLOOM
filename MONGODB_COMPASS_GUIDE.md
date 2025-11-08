# MongoDB Compass Guide - How Data is Stored

## Overview

MongoDB Compass is a GUI tool for viewing and managing your MongoDB data. This guide explains how the Learnato Forum data is stored and how to view it in MongoDB Compass.

## Installation

1. **Download MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Install** the application
3. **Launch** MongoDB Compass

## Connecting to Your Database

1. **Open MongoDB Compass**
2. **Connection String**: Enter `mongodb://localhost:27017`
3. **Click "Connect"**

You should see your databases listed, including the `learnato` database.

## Database Structure

### Database: `learnato`

The database contains **3 collections**:

1. **`users`** - User accounts
2. **`posts`** - Forum posts
3. **`replies`** - Replies to posts

---

## Collection: `users`

### Document Structure

Each user document looks like this:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "John Doe",
  "passwordHash": "$2a$10$hashedpassword...",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

### Fields Explained

- **`_id`**: Unique MongoDB ObjectId (automatically generated)
- **`email`**: User's email address (unique if provided)
- **`username`**: User's username (unique if provided)
- **Note**: Either email or username is required (user must provide at least one)
- **`displayName`**: Name shown in the forum (required, 2-40 characters)
- **`passwordHash`**: Bcrypt hashed password (never stored in plain text)
- **`createdAt`**: Account creation timestamp

### Viewing Users in Compass

1. Click on **`learnato`** database
2. Click on **`users`** collection
3. You'll see all user documents
4. Click on any document to view details

---

## Collection: `posts`

### Document Structure

Each post document looks like this:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "title": "How to use MongoDB?",
  "content": "I'm new to MongoDB and want to learn...",
  "votes": 5,
  "voters": [
    ObjectId("507f1f77bcf86cd799439011"),
    ObjectId("507f1f77bcf86cd799439013")
  ],
  "authorId": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-01-15T11:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T12:30:00.000Z")
}
```

### Fields Explained

- **`_id`**: Unique MongoDB ObjectId
- **`title`**: Post title (required, 4-120 characters)
- **`content`**: Post content (required, 1-10,000 characters)
- **`votes`**: Total upvote count (default: 0)
- **`voters`**: Array of user ObjectIds who upvoted (prevents double voting)
- **`authorId`**: Reference to User who created the post
- **`createdAt`**: Post creation timestamp
- **`updatedAt`**: Last update timestamp (set when post is edited)

### Viewing Posts in Compass

1. Click on **`learnato`** database
2. Click on **`posts`** collection
3. You'll see all post documents
4. Use filters to search by title, author, etc.

### Understanding References

- **`authorId`** is an ObjectId reference to a user in the `users` collection
- **`voters`** is an array of ObjectIds referencing users who voted
- To see the actual user data, you'd need to query the `users` collection with the ObjectId

---

## Collection: `replies`

### Document Structure

Each reply document looks like this:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "postId": ObjectId("507f1f77bcf86cd799439012"),
  "authorId": ObjectId("507f1f77bcf86cd799439013"),
  "content": "Great question! Here's how you can...",
  "createdAt": ISODate("2024-01-15T11:30:00.000Z")
}
```

### Fields Explained

- **`_id`**: Unique MongoDB ObjectId
- **`postId`**: Reference to the Post this reply belongs to
- **`authorId`**: Reference to User who created the reply
- **`content`**: Reply content (required, 1-5,000 characters)
- **`createdAt`**: Reply creation timestamp

### Viewing Replies in Compass

1. Click on **`learnato`** database
2. Click on **`replies`** collection
3. You'll see all reply documents
4. Filter by `postId` to see all replies for a specific post

---

## How Data Relationships Work

### One-to-Many Relationships

1. **User → Posts**: One user can create many posts
   - Find all posts by a user: Filter `posts` collection where `authorId` = user's `_id`

2. **User → Replies**: One user can create many replies
   - Find all replies by a user: Filter `replies` collection where `authorId` = user's `_id`

3. **Post → Replies**: One post can have many replies
   - Find all replies for a post: Filter `replies` collection where `postId` = post's `_id`

### Example: Viewing a Post with its Author and Replies

1. **Find a post** in the `posts` collection
2. **Note the `authorId`** (e.g., `507f1f77bcf86cd799439011`)
3. **Find the author**: In `users` collection, search for `_id` = `507f1f77bcf86cd799439011`
4. **Find replies**: In `replies` collection, filter by `postId` = post's `_id`

---

## Using MongoDB Compass Features

### 1. Viewing Documents

- **List View**: See all documents in a table
- **Document View**: Click a document to see full details
- **JSON View**: See the raw JSON structure

### 2. Filtering Data

Click the **Filter** button and use MongoDB query syntax:

**Examples:**
- Find posts by title: `{ "title": { "$regex": "MongoDB", "$options": "i" } }`
- Find posts with votes > 5: `{ "votes": { "$gt": 5 } }`
- Find posts by author: `{ "authorId": ObjectId("507f1f77bcf86cd799439011") }`
- Find replies for a post: `{ "postId": ObjectId("507f1f77bcf86cd799439012") }`

### 3. Sorting Data

- Click column headers to sort
- Or use the **Sort** button with MongoDB syntax:
  - Sort by votes (descending): `{ "votes": -1 }`
  - Sort by date (newest first): `{ "createdAt": -1 }`

### 4. Searching

- Use the **Search** bar to find text in documents
- Searches across all fields

### 5. Viewing Indexes

- Click **Indexes** tab to see database indexes
- Indexes improve query performance
- Common indexes:
  - `email` (unique)
  - `username` (unique)
  - `authorId` (for faster post lookups)
  - `postId` (for faster reply lookups)

---

## Data Flow Example

### When a User Creates a Post:

1. **User signs up** → Document created in `users` collection
   ```json
   {
     "_id": ObjectId("..."),
     "email": "alice@example.com",
     "displayName": "Alice",
     "passwordHash": "...",
     "createdAt": ISODate("...")
   }
   ```

2. **User creates post** → Document created in `posts` collection
   ```json
   {
     "_id": ObjectId("..."),
     "title": "My First Post",
     "content": "Hello world!",
     "authorId": ObjectId("..."), // References user's _id
     "votes": 0,
     "voters": [],
     "createdAt": ISODate("...")
   }
   ```

3. **Another user replies** → Document created in `replies` collection
   ```json
   {
     "_id": ObjectId("..."),
     "postId": ObjectId("..."), // References post's _id
     "authorId": ObjectId("..."), // References replier's _id
     "content": "Great post!",
     "createdAt": ISODate("...")
   }
   ```

4. **User upvotes** → `posts` document updated
   ```json
   {
     "votes": 1, // Incremented
     "voters": [ObjectId("...")] // User's _id added
   }
   ```

---

## Common Operations in Compass

### View All Users
1. Select `learnato` database
2. Click `users` collection
3. See all registered users

### View All Posts
1. Select `learnato` database
2. Click `posts` collection
3. See all forum posts

### Find Posts by Author
1. Go to `posts` collection
2. Click **Filter**
3. Enter: `{ "authorId": ObjectId("USER_ID_HERE") }`
4. Click **Find**

### Find Replies for a Post
1. Go to `replies` collection
2. Click **Filter**
3. Enter: `{ "postId": ObjectId("POST_ID_HERE") }`
4. Click **Find**

### Count Documents
- Compass shows document count at the top of each collection
- Or use aggregation: `{ "$count": "total" }`

### Delete a Document
1. Click on the document
2. Click **Delete** button
3. Confirm deletion

⚠️ **Warning**: Deleting a user will leave orphaned posts/replies. The application handles this gracefully, but it's better to delete through the API.

---

## Data Persistence

### How Data is Saved

1. **When you create a post/reply/user**:
   - Data is immediately saved to MongoDB
   - MongoDB writes to disk (persistent storage)
   - Data survives server restarts

2. **Storage Location**:
   - Default: `/data/db` (Linux/Mac) or `C:\data\db` (Windows)
   - Can be configured in MongoDB settings

3. **Data Format**:
   - MongoDB stores data in BSON (Binary JSON) format
   - Compass displays it as JSON for readability

### Backup and Restore

**Backup**:
```bash
mongodump --db=learnato --out=./backup
```

**Restore**:
```bash
mongorestore --db=learnato ./backup/learnato
```

---

## Understanding ObjectIds

### What is an ObjectId?

- **Format**: 24-character hexadecimal string
- **Example**: `507f1f77bcf86cd799439011`
- **Structure**:
  - First 8 chars: Timestamp
  - Next 6 chars: Machine identifier
  - Next 4 chars: Process ID
  - Last 6 chars: Counter

### Why ObjectIds?

- **Unique**: Guaranteed unique across all documents
- **Sortable**: Can be sorted by creation time
- **No collisions**: Extremely low probability of duplicates

### In Compass

- ObjectIds are displayed as clickable links
- Click to copy the ObjectId
- Use in filters to find related documents

---

## Tips for Using Compass

1. **Use Filters**: Quickly find specific data
2. **Create Indexes**: Improve query performance (Compass can suggest indexes)
3. **Export Data**: Export collections as JSON/CSV
4. **Schema Validation**: View and validate document schemas
5. **Performance**: Monitor query performance
6. **Aggregations**: Use aggregation pipeline for complex queries

---

## Example Queries

### Find Most Voted Posts
```json
{ "votes": { "$gt": 10 } }
```

### Find Recent Posts (Last 24 hours)
```json
{ "createdAt": { "$gte": ISODate("2024-01-14T00:00:00.000Z") } }
```

### Find Posts by User Email
1. First, find user in `users`: `{ "email": "user@example.com" }`
2. Copy the `_id`
3. Filter `posts`: `{ "authorId": ObjectId("USER_ID") }`

### Count Total Posts
- Look at the collection count at the top
- Or use aggregation: `[{ "$count": "total" }]`

---

## Troubleshooting

### Can't See Data
- Check MongoDB is running: `mongosh` should connect
- Verify database name: Should be `learnato`
- Check connection string in `.env` file

### Data Not Appearing
- Refresh Compass (F5)
- Check if backend is saving data (check server logs)
- Verify MongoDB connection in backend logs

### Connection Issues
- Make sure MongoDB is running
- Check port 27017 is not blocked
- Verify connection string format

---

## Summary

- **Database**: `learnato`
- **Collections**: `users`, `posts`, `replies`
- **Relationships**: ObjectId references link documents
- **Storage**: Persistent on disk, survives restarts
- **Viewing**: Use MongoDB Compass to browse and query data

Your forum data is now permanently stored in MongoDB and can be viewed, queried, and managed through MongoDB Compass!

