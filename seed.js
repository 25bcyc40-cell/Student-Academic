const bcrypt = require('bcrypt');
const db = require('./config/db');

function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Check if admin already exists
    const existing = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
    if (existing) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Hash password and insert admin
    const hash = bcrypt.hashSync('admin@123', 10);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'admin');
    console.log('✓ Admin user created: username=admin, password=admin@123');

    // Insert sample semesters
    const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
    for (const sem of semesters) {
      const existing_sem = db.prepare('SELECT * FROM semesters WHERE semester_name = ?').get(sem);
      if (!existing_sem) {
        db.prepare('INSERT INTO semesters (semester_name) VALUES (?)').run(sem);
      }
    }
    console.log('✓ Sample semesters added');
    console.log('✓ Seed completed successfully');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
