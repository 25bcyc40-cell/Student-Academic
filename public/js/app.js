async function api(path, opts={}){
  const res = await fetch(path, opts);
  if (res.status===401){ location.href='/login.html'; throw new Error('unauthorized'); }
  return res.json();
}

document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{
  await fetch('/auth/logout',{method:'POST'});
  location.href = '/login.html';
});

async function loadDashboard(){
  const students = await api('/api/students');
  document.getElementById('totalStudents').textContent = students.length;

  // Fetch marks and compute GPA per semester
  const marks = await api('/api/marks');
  // Compute semester-wise GPA and subject-wise marks
  const semMap = {}; const subjMap = {};
  marks.forEach(m => {
    // subject map for bar
    subjMap[m.subject_name] = subjMap[m.subject_name] || 0;
    subjMap[m.subject_name] += Number(m.marks_obtained);
    // semester GPA calc: accumulate grade points * credits
    const gp = gradePoint(m.grade);
    semMap[m.semester_name] = semMap[m.semester_name] || {sum:0, credits:0};
    semMap[m.semester_name].sum += gp * Number(m.credits);
    semMap[m.semester_name].credits += Number(m.credits);
  });

  const semLabels = Object.keys(semMap);
  const semData = semLabels.map(s => +(semMap[s].sum / semMap[s].credits).toFixed(2));

  const ctx = document.getElementById('gpaLine').getContext('2d');
  new Chart(ctx, {type:'line', data:{labels:semLabels, datasets:[{label:'GPA',data:semData,backgroundColor:'rgba(108,99,255,0.12)',borderColor:'#6c63ff',tension:0.3}]}, options:{responsive:true}});

  const subjLabels = Object.keys(subjMap).slice(0,8);
  const subjData = subjLabels.map(k=> subjMap[k]);
  const ctx2 = document.getElementById('marksBar').getContext('2d');
  new Chart(ctx2, {type:'bar', data:{labels:subjLabels,datasets:[{label:'Total Marks',data:subjData,backgroundColor:'#8b82ff'}]}, options:{responsive:true}});

  renderStudentList(students);
}

function gradePoint(g){
  const map = { O:10, 'A+':9, A:8, 'B+':7, B:6 };
  return map[g]||0;
}

function renderStudentList(students){
  const el = document.getElementById('studentList');
  if (!students.length) { el.innerHTML = '<div class="loading">No students yet</div>'; return; }
  el.innerHTML = '';
  students.forEach(s=>{
    const row = document.createElement('div'); row.className='list-row';
    row.innerHTML = `<div><strong>${s.name}</strong><div style="font-size:12px;color:#666">${s.email||''} • ${s.course||''}</div></div>
    <div><button class="btn" onclick="viewStudent(${s.student_id})">View</button></div>`;
    el.appendChild(row);
  });
}

window.viewStudent = async function(id){
  const data = await api('/api/students/'+id);
  openModal(`<h3>${data.student.name}</h3><p>Course: ${data.student.course||'-'}</p><p>Email: ${data.student.email||'-'}</p><p><a href='/api/reports/student/${id}'>Download PDF Report</a></p><h4>Marks</h4>${data.marks.map(m=>`<div>${m.semester_name} - ${m.subject_name} : ${m.marks_obtained} (${m.grade})</div>`).join('')}`);
}

function openModal(html){
  const modal = document.getElementById('modal'); modal.setAttribute('aria-hidden','false'); document.getElementById('modalBody').innerHTML = html;
}
document.getElementById('closeModal')?.addEventListener('click', ()=>{document.getElementById('modal').setAttribute('aria-hidden','true')});

document.getElementById('addStudentBtn')?.addEventListener('click', ()=>{
  openModal(`<h3>Add Student</h3><form id='sform'><label>Name<input name='name' required></label><label>Email<input name='email' type='email'></label><label>Course<input name='course'></label><button class='btn' type='submit'>Save</button></form>`);
  document.getElementById('sform').addEventListener('submit', async e=>{
    e.preventDefault();
    const f = e.target;
    await fetch('/api/students',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:f.name.value,email:f.email.value,course:f.course.value})});
    document.getElementById('modal').setAttribute('aria-hidden','true');
    loadDashboard();
  });
});

// init
if (document.getElementById('gpaLine')) loadDashboard();
