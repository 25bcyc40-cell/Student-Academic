const PDFDocument = require('pdfkit');
const studentModel = require('../models/studentModel');
const markModel = require('../models/markModel');

function gradePoint(grade) {
  const map = { O:10, 'A+':9, A:8, 'B+':7, B:6 };
  return map[grade] || 0;
}

function calculateGPA(marks) {
  let sum = 0; let credits = 0;
  for (const m of marks) {
    const gp = gradePoint(m.grade);
    const cr = Number(m.credits) || 3;
    sum += gp * cr;
    credits += cr;
  }
  if (credits === 0) return 0;
  return +(sum / credits).toFixed(2);
}

function studentReport(req, res) {
  try {
    const studentId = req.params.id;
    const student = studentModel.getStudentById(studentId);
    if (!student) return res.status(404).send('Student not found');
    const marks = markModel.getMarksByStudent(studentId);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-disposition', `attachment; filename=report_${studentId}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Academic Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${student.name}`);
    doc.text(`Email: ${student.email || '-'}`);
    doc.text(`Course: ${student.course || '-'}`);
    doc.moveDown();

    // table header
    doc.fontSize(12).text('Semester / Subject / Credits / Marks / Grade', { underline: true });
    doc.moveDown(0.5);
    marks.forEach(m => {
      doc.text(`${m.semester_name} - ${m.subject_name} - ${m.credits} - ${m.marks_obtained} - ${m.grade}`);
    });

    doc.moveDown();
    const gpa = calculateGPA(marks);
    doc.fontSize(14).text(`GPA: ${gpa}`);

    doc.end();
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).send('Server error');
  }
}

module.exports = { studentReport };
