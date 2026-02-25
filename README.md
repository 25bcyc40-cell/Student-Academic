# Student Performance Analytics System

A lightweight, 100% client-side academic dashboard. No backend or database required!

## Quick Start

### 1. Start Local Server
```bash
python -m http.server 8000
```

### 2. Open Browser
```
http://localhost:8000
```

### 3. Login
- **Username:** admin
- **Password:** admin@123

## Features

✨ Dashboard with statistics & real-time charts  
📊 Student management (add, edit, delete)  
📚 Subject and marks entry with auto-grading  
🎓 GPA calculation (weighted by credits)  
📈 Visualizations (Chart.js)  
📄 PDF report generation  
💾 Data persists in browser storage  
📱 Responsive design  

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete application UI |
| `style.css` | Glassmorphism styling & responsive layout |
| `app.js` | All application logic (4 JavaScript classes) |
| `README.md` | This file |

## How to Use

### Dashboard Tab
- View: Total Students, Average GPA, Top Performer, Total Subjects
- Charts: Semester-wise GPA trend, Subject-wise average marks

### Students Tab
- Add, edit, or delete students
- All changes saved to browser storage

### Subjects Tab
- Add subjects with credit hours
- Assign to semesters (1-8)

### Marks Tab
- Enter marks (0-100) for students
- Auto-grade: O(90-100), A+(85-89), A(80-84), B+(75-79), B(70-74), C(60-69), F(<60)
- Charts update in real-time

### Reports Tab
- Download PDF reports for any student

### Settings Tab
- Change admin password
- Clear all data (⚠️ cannot undo)

## Technical Details

**Built With:**
- HTML5, CSS3, Vanilla JavaScript
- Chart.js 3.9.1 (CDN)
- html2pdf.js (CDN)
- localStorage for data persistence

**Data Storage:**
All data saved to browser's localStorage (5-10MB capacity):
```
users, students, subjects, semesters, marks, currentUser
```

**GPA Formula:**
```
GPA = Σ(grade point × credits) / Σ(credits)
```

## Browser Support

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile browsers  

## Tips

- **Offline:** Works after first load (all libraries cached)
- **Data Persists:** Refresh page - data remains
- **Private Mode:** Data not saved in private/incognito
- **Reset:** Settings → Clear Data
- **Debug:** Press F12 → Console to see logs

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Dashboard blank after login | Refresh page (Ctrl+Shift+R), check console (F12) |
| Charts not showing | Verify Chart.js loads (DevTools → Network tab) |
| Data not saving | Check localStorage enabled, not in private mode |
| PDF download fails | Ensure student exists, try different browser |

---

**Version:** 1.0 | **License:** MIT
