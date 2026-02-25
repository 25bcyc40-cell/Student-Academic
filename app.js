// ==================== STORAGE MANAGEMENT ====================
class AppStorage {
  static get(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static init() {
    if (!this.get('users')) {
      this.set('users', [{
        id: 1,
        username: 'admin',
        password: 'admin@123'
      }]);
    }
    if (!this.get('students')) this.set('students', []);
    if (!this.get('subjects')) this.set('subjects', []);
    if (!this.get('semesters')) {
      this.set('semesters', [
        { id: 1, name: 'Semester 1' },
        { id: 2, name: 'Semester 2' },
        { id: 3, name: 'Semester 3' },
        { id: 4, name: 'Semester 4' },
        { id: 5, name: 'Semester 5' },
        { id: 6, name: 'Semester 6' },
        { id: 7, name: 'Semester 7' },
        { id: 8, name: 'Semester 8' }
      ]);
    }
    if (!this.get('marks')) this.set('marks', []);
  }
}

// ==================== UI MANAGEMENT ====================
class UI {
  static showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  static showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${viewName}-view`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
  }

  static openModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
  }

  static closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
  }

  static renderStudentsList() {
    const students = AppStorage.get('students');
    const container = document.getElementById('studentsList');
    
    if (students.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No students yet. Click "Add Student" to create one.</p></div>';
      return;
    }

    container.innerHTML = students.map(s => `
      <div class="list-item">
        <div class="list-item-content">
          <h4>${s.name}</h4>
          <p>${s.email || 'No email'} • ${s.course || 'No course'}</p>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-small ghost" onclick="App.editStudent(${s.id})">Edit</button>
          <button class="btn btn-small ghost" onclick="App.deleteStudent(${s.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  static renderSubjectsList() {
    const subjects = AppStorage.get('subjects');
    const semesters = AppStorage.get('semesters');
    const container = document.getElementById('subjectsList');
    
    if (subjects.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No subjects yet. Click "Add Subject" to create one.</p></div>';
      return;
    }

    container.innerHTML = subjects.map(s => {
      const sem = semesters.find(x => x.id === s.semesterId);
      return `
        <div class="list-item">
          <div class="list-item-content">
            <h4>${s.name}</h4>
            <p>Credits: ${s.credits} • ${sem ? sem.name : 'N/A'}</p>
          </div>
          <div class="list-item-actions">
            <button class="btn btn-small ghost" onclick="App.deleteSubject(${s.id})">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  static renderMarksList() {
    const marks = AppStorage.get('marks');
    const students = AppStorage.get('students');
    const subjects = AppStorage.get('subjects');
    const semesters = AppStorage.get('semesters');
    const container = document.getElementById('marksList');
    
    if (marks.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No marks entered yet. Click "Add Mark" to create one.</p></div>';
      return;
    }

    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Semester</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${marks.map(m => {
            const st = students.find(x => x.id === m.studentId);
            const su = subjects.find(x => x.id === m.subjectId);
            const se = semesters.find(x => x.id === m.semesterId);
            return `
              <tr>
                <td>${st ? st.name : 'Unknown'}</td>
                <td>${su ? su.name : 'Unknown'}</td>
                <td>${se ? se.name : 'Unknown'}</td>
                <td>${m.marks}</td>
                <td><span style="color: var(--primary); font-weight: 600;">${m.grade}</span></td>
                <td><button class="btn btn-small ghost" onclick="App.deleteMark(${m.id})">Delete</button></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  static renderReportsList() {
    const students = AppStorage.get('students');
    const container = document.getElementById('reportsList');
    
    if (students.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No students to generate reports for.</p></div>';
      return;
    }

    container.innerHTML = students.map(s => `
      <div class="list-item">
        <div class="list-item-content">
          <h4>${s.name}</h4>
          <p>${s.email || 'No email'}</p>
        </div>
        <button class="btn btn-small primary" onclick="App.generatePDF(${s.id})">Download Report</button>
      </div>
    `).join('');
  }
}

// ==================== CALCULATIONS ====================
class Calculations {
  static gradeFromMarks(marks) {
    if (marks >= 90) return 'O';
    if (marks >= 80) return 'A+';
    if (marks >= 70) return 'A';
    if (marks >= 60) return 'B+';
    if (marks >= 50) return 'B';
    return 'C';
  }

  static gradePoint(grade) {
    const map = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 0 };
    return map[grade] || 0;
  }

  static calculateGPA(studentId) {
    const marks = AppStorage.get('marks').filter(m => m.studentId === studentId);
    const subjects = AppStorage.get('subjects');

    if (marks.length === 0) return 0;

    let sum = 0;
    let totalCredits = 0;

    marks.forEach(m => {
      const subject = subjects.find(s => s.id === m.subjectId);
      const credits = subject ? subject.credits : 3;
      const gp = this.gradePoint(m.grade);
      sum += gp * credits;
      totalCredits += credits;
    });

    return totalCredits === 0 ? 0 : +(sum / totalCredits).toFixed(2);
  }

  static getDashboardStats() {
    const students = AppStorage.get('students');
    const subjects = AppStorage.get('subjects');
    const marks = AppStorage.get('marks');

    let totalGPA = 0;
    if (students.length > 0) {
      const gpas = students.map(s => this.calculateGPA(s.id));
      totalGPA = +(gpas.reduce((a, b) => a + b, 0) / students.length).toFixed(2);
    }

    let topPerformer = '—';
    if (students.length > 0) {
      const studentGPAs = students.map(s => ({
        name: s.name,
        gpa: this.calculateGPA(s.id)
      }));
      const best = studentGPAs.reduce((max, s) => s.gpa > max.gpa ? s : max);
      topPerformer = best.gpa > 0 ? best.name : '—';
    }

    return {
      totalStudents: students.length,
      avgGPA: totalGPA,
      topPerformer: topPerformer,
      totalSubjects: subjects.length
    };
  }
}

// ==================== CHARTS ====================
class Charts {
  static gpaChart = null;
  static marksChart = null;

  static renderGPAChart() {
    try {
      console.log('renderGPAChart called, Chart available:', typeof Chart !== 'undefined');
      const canvas = document.getElementById('gpaChart');
      if (!canvas) {
        console.warn('GPA chart canvas not found');
        return;
      }
      console.log('GPA canvas found, proceeding with chart rendering');

      const students = AppStorage.get('students');
      const semesters = AppStorage.get('semesters');

      // Group by semester
      const semesterGPAs = {};
      semesters.forEach(sem => semesterGPAs[sem.id] = []);

      AppStorage.get('marks').forEach(mark => {
        const gp = Calculations.gradePoint(mark.grade);
        const subject = AppStorage.get('subjects').find(s => s.id === mark.subjectId);
        const credits = subject ? subject.credits : 3;
        
        if (!semesterGPAs[mark.semesterId]) semesterGPAs[mark.semesterId] = [];
        semesterGPAs[mark.semesterId].push({ gp, credits });
      });

      const labels = semesters.map(s => s.name);
      const data = semesters.map(sem => {
        const marks = semesterGPAs[sem.id];
        if (marks.length === 0) return 0;
        const sum = marks.reduce((acc, m) => acc + (m.gp * m.credits), 0);
        const credits = marks.reduce((acc, m) => acc + m.credits, 0);
        return +(sum / credits).toFixed(2);
      });

      if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded!');
        return;
      }

      const ctx = canvas.getContext('2d');
      
      if (this.gpaChart) this.gpaChart.destroy();
      
      this.gpaChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Semester GPA',
            data: data,
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108, 99, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#6c63ff',
            pointBorderColor: 'white',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { font: { family: "'Poppins', sans-serif", size: 12 } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              ticks: { callback: v => v.toFixed(1) }
            }
          }
        }
      });
      console.log('GPA chart rendered successfully');
    } catch (e) {
      console.error('Error rendering GPA chart:', e.message);
    }
  }

  static renderMarksChart() {
    try {
      const canvas = document.getElementById('marksChart');
      if (!canvas) {
        console.warn('Marks chart canvas not found');
        return;
      }

      const subjects = AppStorage.get('subjects');
      const marks = AppStorage.get('marks');

      const subjectMarks = {};
      subjects.forEach(s => subjectMarks[s.id] = []);

      marks.forEach(m => {
        if (subjectMarks[m.subjectId]) {
          subjectMarks[m.subjectId].push(Number(m.marks));
        }
      });

      const labels = subjects.slice(0, 8).map(s => s.name);
      const data = subjects.slice(0, 8).map(s => {
        const marks = subjectMarks[s.id];
        if (marks.length === 0) return 0;
        return +(marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
      });

      const ctx = canvas.getContext('2d');
      
      if (this.marksChart) this.marksChart.destroy();
      
      this.marksChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Average Marks',
            data: data,
            backgroundColor: [
              '#6c63ff', '#8b82ff', '#a5a0ff', '#bfb9ff',
              '#667eea', '#764ba2', '#f093fb', '#4facfe'
            ],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'x',
          plugins: {
            legend: {
              display: true,
              labels: { font: { family: "'Poppins', sans-serif", size: 12 } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    } catch (e) {
      console.error('Error rendering marks chart:', e.message);
    }
  }

  static updateAll() {
    console.log('Charts.updateAll() called');
    // Give more time for Chart.js to load
    setTimeout(() => {
      try {
        if (typeof Chart === 'undefined') {
          console.warn('Chart.js not yet available, retrying...');
          setTimeout(() => this.updateAll(), 500);
          return;
        }
        console.log('Rendering GPA chart...');
        this.renderGPAChart();
        console.log('Rendering marks chart...');
        this.renderMarksChart();
        console.log('All charts rendered');
      } catch (e) {
        console.error('Error in Chart update:', e);
      }
    }, 200);
  }
}

// ==================== PDF GENERATION ====================
function generatePDF(studentId) {
  const students = AppStorage.get('students');
  const marks = AppStorage.get('marks').filter(m => m.studentId === studentId);
  const subjects = AppStorage.get('subjects');
  const semesters = AppStorage.get('semesters');
  const student = students.find(s => s.id === studentId);

  if (!student) return;

  const element = document.createElement('div');
  element.style.cssText = `
    font-family: Arial, sans-serif;
    padding: 40px;
    max-width: 900px;
    background: white;
    color: #333;
  `;

  const gpa = Calculations.calculateGPA(studentId);
  const marksHTML = marks.map(m => {
    const subject = subjects.find(s => s.id === m.subjectId);
    const semester = semesters.find(s => s.id === m.semesterId);
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${semester ? semester.name : 'N/A'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject ? subject.name : 'N/A'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject ? subject.credits : 3}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${m.marks}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #6c63ff; font-weight: bold;">${m.grade}</td>
      </tr>
    `;
  }).join('');

  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #6c63ff; padding-bottom: 20px;">
      <h1 style="color: #6c63ff; margin: 0 0 10px 0; font-size: 32px;">Academic Report</h1>
      <p style="color: #666; margin: 0;">Student Performance Analytics System</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; margin-bottom: 10px;">Student Information</h2>
      <p><strong>Name:</strong> ${student.name}</p>
      <p><strong>Email:</strong> ${student.email || 'N/A'}</p>
      <p><strong>Course:</strong> ${student.course || 'N/A'}</p>
      <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; margin-bottom: 15px;">Marks & Grades</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Semester</th>
            <th style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</th>
            <th style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Credits</th>
            <th style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Marks</th>
            <th style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${marksHTML}
        </tbody>
      </table>
    </div>

    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
      <h2 style="color: #6c63ff; margin-top: 0; font-size: 24px;">Overall GPA: ${gpa.toFixed(2)}</h2>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
      <p>This is an automatically generated report. For official records, contact the administration.</p>
    </div>
  `;

  html2pdf().set({
    margin: 10,
    filename: `Report_${student.name.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  }).save(element);
}

// ==================== MAIN APP ====================
class App {
  static currentUser = null;

  static init() {
    console.log('App.init() called');
    AppStorage.init();
    console.log('AppStorage initialized');
    this.setupEventListeners();
    console.log('Event listeners set up');
    this.checkAuth();
    console.log('Auth check complete');
  }

  static checkAuth() {
    console.log('Checking authentication...');
    const user = AppStorage.get('currentUser');
    console.log('Current user:', user);
    if (user) {
      this.currentUser = user;
      console.log('User found, showing dashboard');
      this.showDashboard();
    } else {
      console.log('No user, showing login');
      this.showLogin();
    }
  }

  static showLogin() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('dashboardPage').style.display = 'none';
  }

  static showDashboard() {
    console.log('Showing dashboard...');
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    if (loginPage) loginPage.style.display = 'none';
    if (dashboardPage) dashboardPage.style.display = 'block';
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay && this.currentUser) userDisplay.textContent = this.currentUser.username;
    console.log('Dashboard displayed, loading stats...');
    this.loadDashboard();
  }

  static setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      console.log('Login form found, attaching submit listener');
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        this.handleLogin();
      });
    } else {
      console.warn('Login form not found!');
    }

    // Navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    console.log('Found', navBtns.length, 'nav buttons');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        console.log('Nav clicked, view:', view);
        UI.showView(view);
        if (view === 'dashboard') this.loadDashboard();
        if (view === 'students') UI.renderStudentsList();
        if (view === 'subjects') UI.renderSubjectsList();
        if (view === 'marks') UI.renderMarksList();
        if (view === 'reports') UI.renderReportsList();
      });
    });

    // Add buttons
    const addStudentBtn = document.getElementById('addStudentBtn');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const addMarkBtn = document.getElementById('addMarkBtn');
    
    if (addStudentBtn) addStudentBtn.addEventListener('click', () => this.showAddStudentModal());
    if (addSubjectBtn) addSubjectBtn.addEventListener('click', () => this.showAddSubjectModal());
    if (addMarkBtn) addMarkBtn.addEventListener('click', () => this.showAddMarkModal());

    // Settings
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', () => this.changePassword());
    if (clearDataBtn) clearDataBtn.addEventListener('click', () => this.clearAllData());

    // Modal
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => UI.closeModal());
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') UI.closeModal();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Logout clicked');
        AppStorage.set('currentUser', null);
        this.currentUser = null;
        this.showLogin();
        UI.showToast('Logged out successfully');
      });
    }
    
    console.log('Event listeners set up complete');
  }

  static handleLogin() {
    console.log('handleLogin called');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    console.log('Login attempt for username:', username);
    const users = AppStorage.get('users');
    console.log('Users in storage:', users);
    const user = users.find(u => u.username === username && u.password === password);
    console.log('User found:', user);

    if (user) {
      console.log('Login successful for:', user.username);
      AppStorage.set('currentUser', { id: user.id, username: user.username });
      this.currentUser = { id: user.id, username: user.username };
      console.log('CurrentUser set:', this.currentUser);
      this.showDashboard();
      UI.showToast('Login successful!');
    } else {
      console.log('Login failed - invalid credentials');
      document.getElementById('loginError').textContent = 'Invalid username or password';
      UI.showToast('Invalid credentials', 'error');
    }
  }

  static loadDashboard() {
    console.log('Loading dashboard stats...');
    try {
      const stats = Calculations.getDashboardStats();
      console.log('Stats calculated:', stats);
      
      const totalStudentsEl = document.getElementById('totalStudents');
      const avgGPAEl = document.getElementById('avgGPA');
      const topPerformerEl = document.getElementById('topPerformer');
      const totalSubjectsEl = document.getElementById('totalSubjects');
      
      if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
      if (avgGPAEl) avgGPAEl.textContent = stats.avgGPA.toFixed(2);
      if (topPerformerEl) topPerformerEl.textContent = stats.topPerformer;
      if (totalSubjectsEl) totalSubjectsEl.textContent = stats.totalSubjects;
      
      console.log('Stats inserted into DOM, rendering charts...');
      Charts.updateAll();
      console.log('Charts rendered');
    } catch (e) {
      console.error('Error loading dashboard:', e);
    }
  }

  static showAddStudentModal() {
    const html = `
      <form id="studentForm">
        <div class="form-group">
          <label>Name *</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email">
        </div>
        <div class="form-group">
          <label>Course</label>
          <input type="text" name="course">
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="submit" class="btn primary">Save</button>
          <button type="button" class="btn secondary" onclick="UI.closeModal()">Cancel</button>
        </div>
      </form>
    `;
    UI.openModal('Add Student', html);
    document.getElementById('studentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const student = {
        id: Date.now(),
        name: form.name.value,
        email: form.email.value,
        course: form.course.value
      };
      const students = AppStorage.get('students');
      students.push(student);
      AppStorage.set('students', students);
      UI.closeModal();
      UI.renderStudentsList();
      this.loadDashboard();
      UI.showToast('Student added successfully!');
    });
  }

  static editStudent(id) {
    const students = AppStorage.get('students');
    const student = students.find(s => s.id === id);
    if (!student) return;

    const html = `
      <form id="editStudentForm">
        <div class="form-group">
          <label>Name *</label>
          <input type="text" name="name" value="${student.name}" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value="${student.email || ''}">
        </div>
        <div class="form-group">
          <label>Course</label>
          <input type="text" name="course" value="${student.course || ''}">
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="submit" class="btn primary">Update</button>
          <button type="button" class="btn secondary" onclick="UI.closeModal()">Cancel</button>
        </div>
      </form>
    `;
    UI.openModal('Edit Student', html);
    document.getElementById('editStudentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      student.name = form.name.value;
      student.email = form.email.value;
      student.course = form.course.value;
      AppStorage.set('students', students);
      UI.closeModal();
      UI.renderStudentsList();
      this.loadDashboard();
      UI.showToast('Student updated successfully!');
    });
  }

  static deleteStudent(id) {
    if (confirm('Are you sure? This will also delete all marks for this student.')) {
      let students = AppStorage.get('students');
      students = students.filter(s => s.id !== id);
      AppStorage.set('students', students);
      let marks = AppStorage.get('marks');
      marks = marks.filter(m => m.studentId !== id);
      AppStorage.set('marks', marks);
      UI.renderStudentsList();
      this.loadDashboard();
      UI.showToast('Student deleted successfully!');
    }
  }

  static showAddSubjectModal() {
    const semesters = AppStorage.get('semesters');
    const html = `
      <form id="subjectForm">
        <div class="form-group">
          <label>Subject Name *</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Credits *</label>
          <input type="number" name="credits" value="3" min="1" max="10" required>
        </div>
        <div class="form-group">
          <label>Semester *</label>
          <select name="semesterId" required>
            <option value="">Select Semester</option>
            ${semesters.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="submit" class="btn primary">Save</button>
          <button type="button" class="btn secondary" onclick="UI.closeModal()">Cancel</button>
        </div>
      </form>
    `;
    UI.openModal('Add Subject', html);
    document.getElementById('subjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const subject = {
        id: Date.now(),
        name: form.name.value,
        credits: parseInt(form.credits.value),
        semesterId: parseInt(form.semesterId.value)
      };
      const subjects = AppStorage.get('subjects');
      subjects.push(subject);
      AppStorage.set('subjects', subjects);
      UI.closeModal();
      UI.renderSubjectsList();
      this.loadDashboard();
      UI.showToast('Subject added successfully!');
    });
  }

  static deleteSubject(id) {
    if (confirm('Are you sure?')) {
      let subjects = AppStorage.get('subjects');
      subjects = subjects.filter(s => s.id !== id);
      AppStorage.set('subjects', subjects);
      UI.renderSubjectsList();
      this.loadDashboard();
      UI.showToast('Subject deleted successfully!');
    }
  }

  static showAddMarkModal() {
    const students = AppStorage.get('students');
    const subjects = AppStorage.get('subjects');
    const semesters = AppStorage.get('semesters');

    if (students.length === 0 || subjects.length === 0) {
      UI.showToast('Please add students and subjects first', 'error');
      return;
    }

    const html = `
      <form id="markForm">
        <div class="form-group">
          <label>Student *</label>
          <select name="studentId" required>
            <option value="">Select Student</option>
            ${students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Subject *</label>
          <select name="subjectId" required>
            <option value="">Select Subject</option>
            ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Semester *</label>
          <select name="semesterId" required>
            <option value="">Select Semester</option>
            ${semesters.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Marks (0-100) *</label>
          <input type="number" name="marks" min="0" max="100" required>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="submit" class="btn primary">Save</button>
          <button type="button" class="btn secondary" onclick="UI.closeModal()">Cancel</button>
        </div>
      </form>
    `;
    UI.openModal('Add Mark', html);
    document.getElementById('markForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const marks = Number(form.marks.value);
      const grade = Calculations.gradeFromMarks(marks);
      const mark = {
        id: Date.now(),
        studentId: parseInt(form.studentId.value),
        subjectId: parseInt(form.subjectId.value),
        semesterId: parseInt(form.semesterId.value),
        marks: marks,
        grade: grade
      };
      const marksList = AppStorage.get('marks');
      marksList.push(mark);
      AppStorage.set('marks', marksList);
      UI.closeModal();
      UI.renderMarksList();
      this.loadDashboard();
      UI.showToast('Mark added successfully!');
    });
  }

  static deleteMark(id) {
    if (confirm('Are you sure?')) {
      let marks = AppStorage.get('marks');
      marks = marks.filter(m => m.id !== id);
      AppStorage.set('marks', marks);
      UI.renderMarksList();
      this.loadDashboard();
      UI.showToast('Mark deleted successfully!');
    }
  }

  static generatePDF(studentId) {
    generatePDF(studentId);
  }

  static changePassword() {
    const newPassword = document.getElementById('newPassword').value.trim();
    if (!newPassword) {
      UI.showToast('Please enter a new password', 'error');
      return;
    }
    const users = AppStorage.get('users');
    const user = users.find(u => u.id === this.currentUser.id);
    if (user) {
      user.password = newPassword;
      AppStorage.set('users', users);
      document.getElementById('newPassword').value = '';
      UI.showToast('Password changed successfully!');
    }
  }

  static clearAllData() {
    if (confirm('⚠️ WARNING: This will delete ALL data including students, subjects, marks, and reset to default settings. Are you sure?')) {
      if (confirm('This action cannot be undone. Click OK to confirm.')) {
        AppStorage.init(); // Reset to initial state
        this.loadDashboard();
        UI.showView('dashboard');
        UI.showToast('All data cleared. App reset to default.', 'success', 4000);
      }
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
