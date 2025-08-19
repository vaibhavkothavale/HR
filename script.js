// Default admin credentials
const creds = { username: "admin", password: "admin123" };

// Fetch jobs from localStorage
function getJobs() {
  return JSON.parse(localStorage.getItem("jobs")) || [];
}

// Save jobs
function saveJobs(jobs) {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

// Render jobs on user panel
function renderJobs() {
  const jobs = getJobs();
  const jobsList = document.getElementById("jobs");
  if (!jobsList) return;
  jobsList.innerHTML = jobs.length ? "" : "<p>No jobs available.</p>";

  jobs.forEach(job => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${job.title}</strong> - ${job.company}<br>${job.description}`;
    jobsList.appendChild(li);
  });
}

// Admin panel setup
function setupAdminPanel() {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const loginSection = document.getElementById("login-section");
  const adminSection = document.getElementById("admin-section");
  const logoutBtn = document.getElementById("logout-btn");
  const jobForm = document.getElementById("job-form");
  const adminJobs = document.getElementById("admin-jobs");

  if (!loginForm) return; // Only runs on admin.html

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === creds.username && password === creds.password) {
      loginSection.style.display = "none";
      adminSection.style.display = "block";
      renderAdminJobs();
    } else {
      loginError.textContent = "Invalid credentials!";
    }
  });

  logoutBtn.addEventListener("click", () => {
    adminSection.style.display = "none";
    loginSection.style.display = "block";
    loginForm.reset();
    loginError.textContent = "";
  });

  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("job-id").value;
    const title = document.getElementById("job-title").value;
    const company = document.getElementById("job-company").value;
    const description = document.getElementById("job-description").value;

    let jobs = getJobs();

    if (id) {
      // Edit existing job
      jobs = jobs.map(j => j.id == id ? { id, title, company, description } : j);
    } else {
      // Add new job
      const newJob = { id: Date.now(), title, company, description };
      jobs.push(newJob);
    }

    saveJobs(jobs);
    renderAdminJobs();
    jobForm.reset();
  });

  function renderAdminJobs() {
    const jobs = getJobs();
    adminJobs.innerHTML = "";
    jobs.forEach(job => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${job.title}</strong> - ${job.company}<br>${job.description}
        <button onclick="editJob(${job.id})">Edit</button>
        <button onclick="deleteJob(${job.id})">Delete</button>
      `;
      adminJobs.appendChild(li);
    });
  }

  window.editJob = function(id) {
    const jobs = getJobs();
    const job = jobs.find(j => j.id == id);
    if (!job) return;
    document.getElementById("job-id").value = job.id;
    document.getElementById("job-title").value = job.title;
    document.getElementById("job-company").value = job.company;
    document.getElementById("job-description").value = job.description;
  };

  window.deleteJob = function(id) {
    let jobs = getJobs();
    jobs = jobs.filter(j => j.id != id);
    saveJobs(jobs);
    renderAdminJobs();
  };
}
