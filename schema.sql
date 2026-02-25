-- SQLite Schema for Student Performance Analytics
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
  semester_id INTEGER PRIMARY KEY AUTOINCREMENT,
  semester_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
  subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_name TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  semester_id INTEGER,
  FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS students (
  student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  course TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marks (
  mark_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  semester_id INTEGER NOT NULL,
  marks_obtained REAL NOT NULL,
  grade TEXT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
  FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE
);

