# Student Performance Analytics System - Pure Frontend

A 100% client-side academic dashboard using HTML5, CSS3, and Vanilla JavaScript with localStorage for data persistence. No backend or database required!

## What Was Fixed

The dashboard was not displaying after login. The following issues were resolved:

✅ Chart.js library timing issues  
✅ Dashboard initialization and prop population  
✅ Event listener binding safety  
✅ Comprehensive logging and error handling  

## Features

✨ **Dashboard** - Summary cards, semester GPA chart, subject marks chart  
🔐 **Authentication** - Simple localStorage-based admin login  
📊 **Data Management** - Add/edit/delete students, subjects, marks; automatic grading  
📄 **PDF Reports** - Download academic reports with student details  
🎨 **Modern UI** - Glassmorphism design, responsive, Poppins font, smooth animations  
💾 **No Backend** - Pure client-side, all data in localStorage  

## Quick Start (3 Steps)

## Quick Start (3 Steps)

### 1. Start HTTP Server
```bash
cd "Student Performance Analytics System"
python -m http.server 8000
```

### 2. Open in Browser
```
http://localhost:8000
```

### 3. Login
- Username: `admin`
- Password: `admin@123`

That's it! Dashboard loads with stats and charts.

## How to Use

**Dashboard Tab**
- View statistics: total students, average GPA, top performer, total subjects
- See semester-wise GPA line chart
- See subject-wise average marks bar chart

**Students Tab**
- Add new students with name, email, course
- Edit or delete existing students
- All changes saved to localStorage

**Subjects Tab**
- Add subjects with credit hours
- Assign to semesters (1-8)
- Used for GPA calculation

**Marks Tab**
- Enter marks (0-100) for students
- Auto-grades: O(90-100), A+(85-89), A(80-84), B+(75-79), B(70-74), C(60-69), F(<60)
- Charts update in real-time

**Reports Tab**
- Select student
- Download PDF report with academic details

**Settings Tab**
- Change admin password
- ⚠️ Clear all data (cannot be undone)

## Files

- `index.html` - Complete UI with all views
- `style.css` - Glassmorphism styling with responsive design
- `app.js` - All application logic (847 lines)
- `diagnostic.html` - DOM structure test
- `test-integration.html` - App logic tests
- `README.md` - This file

## Architecture

**JavaScript Classes:**

```javascript
AppStorage    // localStorage management
UI            // DOM rendering and views
Calculations  // GPA and grade scoring
Charts        // Chart.js visualization
App           // Main controller
```

**Data Storage (localStorage):**

```json
{
  "users": [{"id": 1, "username": "admin", "password": "admin@123"}],
  "students": [],
  "subjects": [],
  "semesters": [{"id": 1, "name": "Semester 1"}, ...],
  "marks": [],
  "currentUser": null
}
```

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js 3.9.1 (CDN)
- **PDF**: html2pdf.js (CDN)
- **Storage**: Browser localStorage (~5-10MB)
- **Fonts**: Google Fonts (Poppins)
- **No Dependencies**: Pure client-side

## GPA Calculation

```
GPA = Σ(grade point × credits) / Σ(credits)

Grade Points:
- O (Outstanding): 10
- A+ (Excellent): 9  
- A (Very Good): 8
- B+ (Good): 7
- B (Above Average): 6
- C (Average): 5
- F (Fail): 0
```

## Debugging

If dashboard doesn't show:

1. **Check Console (F12)**
   - Open DevTools → Console
   - Login and look for logs:
     - `App.init() called`
     - `User logged in: admin`
     - `Charts rendered successfully`

2. **Verify DOM Elements**
   - Open DevTools → Elements
   - Look for: `#gpaChart`, `#marksChart`, `#totalStudents`

3. **Run Tests**
   - `diagnostic.html` - Tests DOM and libraries
   - `test-integration.html` - Tests app logic

## Browser Support

- ✅ Chrome, Firefox, Edge
- ✅ Safari (with -webkit- prefixes)
- ✅ Mobile browsers
- ✅ Works offline after first load

## Notes

- All data saved to **localStorage** (browser storage)
- Data persists across sessions
- Each browser/device has separate storage
- Storage limit: ~5-10MB per origin
- Clear browser data = app reset to defaults
- No server required (HTTP server just serves files)

## Example Usage

```
1. Login as admin/admin@123
2. Click "Students" → Add Student
3. Name: "John", Email: "john@uni.edu", Course: "CSE"
4. Click "Subjects" → Add Subject
5. Name: "Database", Credits: 4, Semester: 1
6. Click "Marks" → Add Mark
7. Select John, Database, Enter 85
8. Grade auto-assigned: A (80-84) → 8 points
9. Dashboard updates with stats and charts
10. Download PDF from Reports tab
```

## Troubleshooting

**Dashboard blank after login:**
- Close browser dev console (sometimes blocks rendering)
- Clear localStorage: Settings → Clear Data
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check console for errors (F12)

**Charts not showing:**
- Check that Chart.js loads (check Network tab in DevTools)
- Ensure canvas elements exist in HTML
- Try adding some sample data first

**PDF download fails:**
- Check html2pdf loads (Network tab)
- Make sure student exists before downloading
- Try in different browser

**Data not saving:**
- Check localStorage enabled (browser settings)
- Not in private/incognito mode
- Try different browser

## Features Roadmap

**Auth**: POST /auth/login, POST /auth/logout  
**Students**: GET/POST/PUT/DELETE /api/students  
**Subjects**: GET/POST /api/subjects  
**Marks**: GET/POST /api/marks  
**Reports**: GET /api/reports/student/:id

## Project Structure

```
├── config/db.js
├── controllers/ (auth, student, subject, mark, report)
├── models/ (user, student, subject, semester, mark)
├── routes/ (auth, students, subjects, marks, reports)
├── public/ (dashboard.html, login.html, css/, js/)
├── utils/auth.js
├── server.js
├── schema.sql
└── seed.js
```

## Troubleshooting

**Port 5000 in use**: `$env:PORT=5001 ; npm start`  
**DB connection error**: Check .env credentials and MySQL is running  
**npm audit fix failed**: This is non-blocking, proceed with npm start
