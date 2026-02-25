## Setup Checklist & Troubleshooting

### Step 1: Verify Folder Structure
Ensure you have these folders:
- ✅ controllers/
- ✅ models/
- ✅ routes/
- ✅ config/
- ✅ public/
- ✅ utils/

### Step 2: Install Dependencies
```bash
npm install
```

If npm audit fix fails, ignore it and proceed. The modules are still functional.

### Step 3: MySQL Setup

#### Option A: Using XAMPP (Windows/Mac)
1. Start XAMPP
2. Start Apache + MySQL
3. Open http://localhost/phpmyadmin
4. Click "New" database, name it: `student_analytics`
5. Click Import, select `schema.sql` from project folder
6. Click Go

#### Option B: Command Line (All OS)
```bash
mysql -u root -p
CREATE DATABASE student_analytics;
USE student_analytics;
-- Then paste contents of schema.sql and press Enter
```

#### Option C: GUI Tools
- MySQL Workbench: File > Open SQL Script > schema.sql > Execute

### Step 4: Environment Configuration

**Create `.env` file** in project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=student_analytics
SESSION_SECRET=my-secret-key-12345
PORT=5000
```

**Windows users**: If you're using XAMPP, DB_PASSWORD should be empty or match your setup:
```
DB_PASSWORD=
```

### Step 5: Create Admin User

```bash
node seed.js
```

Expected output:
```
Admin user created: username=admin, password=admin@123
Sample semesters added
Seed completed successfully
```

If error "database does not exist":
→ Go back to Step 3 and verify schema.sql was imported

### Step 6: Start Server

```bash
npm start
```

Expected output:
```
Server running on http://localhost:5000
```

### Step 7: Login

1. Open browser: http://localhost:5000
2. You'll see login page
3. Enter credentials:
   - Username: `admin`
   - Password: `admin@123`
4. Click Login

### Step 8: Use Dashboard

After login, you should see:
- ✅ Dashboard with 3 summary cards
- ✅ Two charts (GPA line, Marks bar)
- ✅ Student list
- ✅ "Add Student" button
- ✅ Sidebar with navigation

### Troubleshooting

#### "Cannot find module" error
```
Error: Cannot find module '../controllers/studentController'
```
**Fix**: Check file spelling and location:
- File must be: `controllers/studentController.js` (case-sensitive on Linux/Mac)
- Check no typos in require() statements in routes/

#### Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Change port temporarily
$env:PORT=5001
npm start
```

Or kill the process:
```bash
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
npm start
```

#### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Fix**:
1. Start MySQL service:
   - Windows: Start XAMPP MySQL
   - Linux: `sudo systemctl start mysql`
   - Mac: `brew services start mysql`

2. Check credentials in `.env` match your MySQL setup

3. Test connection:
   ```bash
   mysql -h localhost -u root -p
   ```

#### Database queries failing
```
Error: Unknown database 'student_analytics'
```
**Fix**: Run schema.sql to create tables (Step 3)

#### No data showing after login
1. Click "Add Student" button
2. Fill in name, email, course
3. Click Save
4. Refresh to see student in list

#### Login always fails
1. Verify admin user exists:
   ```bash
   mysql -u root -p student_analytics
   SELECT * FROM users;
   ```
   Should show admin user

2. If empty, run:
   ```bash
   node seed.js
   ```

### File Reference

**Key Files**:
- `.env` - Configuration (create this)
- `server.js` - Express server
- `schema.sql` - Database tables
- `seed.js` - Create admin user
- `public/dashboard.html` - Main page
- `public/login.html` - Login page
- `public/css/style.css` - Styling
- `public/js/app.js` - Frontend logic

### Development Commands

```bash
# Run with auto-reload (if nodemon is installed)
npm run dev

# Run production
npm start

# Seed database
node seed.js
```

### Support

If still having issues:
1. Verify all files exist in their correct locations
2. Check `.env` file is in project root
3. Ensure MySQL is running
4. Verify database tables exist
5. Check admin user exists with `node seed.js`
