// Sample listings are kept in one data set so all filters use consistent fields.
const jobs = [
  {
    id: "product-designer", company: "Northstar", initials: "N", category: "Product & Design", title: "Senior Product Designer",
    location: "New York, NY", mode: "Hybrid", type: "Full-time", experience: "Senior", salary: 145000, salaryLabel: "$130,000 – $160,000",
    description: "Shape intuitive product experiences from first sketch to final pixel. Partner with research and engineering to make complex workflows feel effortless.",
    colors: ["#e8efff", "#315fca"], posted: 1
  },
  {
    id: "frontend-engineer", company: "Lumen", initials: "L", category: "Engineering", title: "Frontend Engineer",
    location: "Remote, US", mode: "Remote", type: "Full-time", experience: "Mid-Level", salary: 150000, salaryLabel: "$125,000 – $175,000",
    description: "Build fast, accessible interfaces used by thousands of small businesses. Bring strong React fundamentals and a thoughtful eye for detail.",
    colors: ["#fff0dd", "#d27a25"], posted: 2
  },
  {
    id: "marketing-lead", company: "Arcwell", initials: "A", category: "Marketing", title: "Growth Marketing Lead",
    location: "Austin, TX", mode: "Hybrid", type: "Full-time", experience: "Senior", salary: 125000, salaryLabel: "$110,000 – $140,000",
    description: "Own the experiments and campaigns that bring more people to better work. Blend sharp storytelling with data-led channel strategy.",
    colors: ["#e5f7ef", "#278260"], posted: 3
  },
  {
    id: "operations-coordinator", company: "Fieldnote", initials: "F", category: "Operations", title: "Operations Coordinator",
    location: "Chicago, IL", mode: "Hybrid", type: "Full-time", experience: "Entry", salary: 68000, salaryLabel: "$58,000 – $78,000",
    description: "Keep a kind, fast-moving team running smoothly. You'll improve everyday processes, coordinate projects, and make the little things work.",
    colors: ["#f3eaff", "#8554b2"], posted: 4
  },
  {
    id: "content-strategist", company: "Orbit", initials: "O", category: "Marketing", title: "Content Strategist",
    location: "Remote, US", mode: "Remote", type: "Contract", experience: "Mid-Level", salary: 95000, salaryLabel: "$80,000 – $110,000",
    description: "Turn customer stories into useful, human content across web and email. Bring a clear writing voice and a knack for finding the story.",
    colors: ["#e5f5fb", "#287a9c"], posted: 5
  },
  {
    id: "people-partner", company: "Kindred Health", initials: "K", category: "People & Culture", title: "People Operations Partner",
    location: "Denver, CO", mode: "Hybrid", type: "Full-time", experience: "Mid-Level", salary: 105000, salaryLabel: "$92,000 – $118,000",
    description: "Create a genuinely great employee experience, from thoughtful onboarding to manager support, at a mission-driven healthcare company.",
    colors: ["#ffe9ed", "#c8516b"], posted: 6
  },
  {
    id: "data-analyst", company: "Brightside", initials: "B", category: "Data & Analytics", title: "Data Analyst",
    location: "Remote, US", mode: "Remote", type: "Full-time", experience: "Entry", salary: 92000, salaryLabel: "$78,000 – $105,000",
    description: "Make the numbers make sense. Partner with product teams to turn clean SQL analysis and clear dashboards into better decisions.",
    colors: ["#fff4d9", "#a57b13"], posted: 7
  },
  {
    id: "ux-researcher", company: "Morrow", initials: "M", category: "Product & Design", title: "UX Researcher",
    location: "Boston, MA", mode: "Hybrid", type: "Part-time", experience: "Senior", salary: 118000, salaryLabel: "$100,000 – $135,000",
    description: "Bring customer voices into every product decision. Plan and lead qualitative research, then share insights teams can put to work.",
    colors: ["#e8eaff", "#5d60b9"], posted: 8
  }
];

const list = document.querySelector("#job-list");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const keywordInput = document.querySelector("#keyword");
const locationInput = document.querySelector("#location");
const experienceFilter = document.querySelector("#experience-filter");
const sortSelect = document.querySelector("#sort-select");
const modal = document.querySelector("#application-modal");
const appliedJobs = new Set();
let activeType = "All";

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

// Apply text, location, type, and experience filters before sorting.
function getVisibleJobs() {
  const keyword = keywordInput.value.trim().toLowerCase();
  const location = locationInput.value.trim().toLowerCase();
  const experience = experienceFilter.value;

  return jobs.filter((job) => {
    const searchable = `${job.title} ${job.company} ${job.category} ${job.description} ${job.location} ${job.mode} ${job.type} ${job.experience}`.toLowerCase();
    const matchesKeyword = !keyword || searchable.includes(keyword);
    const matchesLocation = !location || `${job.location} ${job.mode}`.toLowerCase().includes(location);
    const matchesType = activeType === "All" || (activeType === "Remote" ? job.mode === "Remote" : job.type === activeType);
    const matchesExperience = experience === "All" || job.experience === experience;
    return matchesKeyword && matchesLocation && matchesType && matchesExperience;
  }).sort((a, b) => sortSelect.value === "salary" ? b.salary - a.salary : a.posted - b.posted);
}

function renderJobs() {
  const visibleJobs = getVisibleJobs();
  const count = visibleJobs.length;
  resultsCount.innerHTML = count === 1
    ? 'Showing <strong>1</strong> open position'
    : `Showing <strong>${count}</strong> open positions`;
  emptyState.hidden = count !== 0;
  list.hidden = count === 0;

  list.innerHTML = visibleJobs.map((job) => {
    const isApplied = appliedJobs.has(job.id);
    return `
      <article class="job-card" data-job-id="${escapeHTML(job.id)}">
        <div class="card-top">
          <div class="company-info">
            <div class="company-badge" style="color:${job.colors[1]};background:${job.colors[0]}" aria-hidden="true">${escapeHTML(job.initials)}</div>
            <div><div class="company-name">${escapeHTML(job.company)}</div><div class="job-category">${escapeHTML(job.category)}</div></div>
          </div>
          <button class="save-button" type="button" aria-label="Save ${escapeHTML(job.title)} at ${escapeHTML(job.company)}" aria-pressed="false" title="Save job">♡</button>
        </div>
        <h3 class="job-title"><a href="#application-modal" class="job-detail-link" data-job-id="${escapeHTML(job.id)}">${escapeHTML(job.title)}</a></h3>
        <div class="job-meta">
          <span class="meta-location"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>${escapeHTML(job.location)}</span>
          <span class="meta-separator" aria-hidden="true">·</span>
          <span class="work-mode ${job.mode.toLowerCase()}">${escapeHTML(job.mode)}</span>
          <span class="meta-separator" aria-hidden="true">·</span><span>${escapeHTML(job.type)}</span>
        </div>
        <p class="job-description">${escapeHTML(job.description)}</p>
        <div class="card-bottom">
          <div class="salary">${escapeHTML(job.salaryLabel)} <span class="salary-period">/ yr</span></div>
          <div class="card-actions">
            <button class="button ${isApplied ? "applied-button" : "button-primary"} apply-button" type="button" data-job-id="${escapeHTML(job.id)}" ${isApplied ? "disabled" : ""}>${isApplied ? "Applied ✓" : "Apply now"}</button>
            <button class="button button-light details-button" type="button" data-job-id="${escapeHTML(job.id)}">View details</button>
          </div>
        </div>
      </article>`;
  }).join("");
}

// The same dialog switches between role details and the application flow.
function openApplication(jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return;
  document.querySelector("#modal-heading").textContent = "Apply for this role";
  document.querySelector("#role-details").hidden = true;
  document.querySelector("#application-job-id").value = job.id;
  document.querySelector("#modal-job-title").textContent = job.title;
  document.querySelector("#modal-company").textContent = job.company;
  document.querySelector("#application-form").reset();
  document.querySelector("#application-content").hidden = false;
  document.querySelector("#application-success").hidden = true;
  modal.showModal();
}

function openRoleDetails(jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return;
  document.querySelector("#modal-heading").textContent = "Role details";
  document.querySelector("#application-content").hidden = true;
  document.querySelector("#application-success").hidden = true;
  const details = document.querySelector("#role-details");
  details.innerHTML = `
    <h3>${escapeHTML(job.title)}</h3>
    <p class="details-company">${escapeHTML(job.company)} · ${escapeHTML(job.category)}</p>
    <div class="details-meta"><span>${escapeHTML(job.location)}</span><span>${escapeHTML(job.mode)}</span><span>${escapeHTML(job.type)}</span><span>${escapeHTML(job.experience)}</span></div>
    <p class="details-salary">${escapeHTML(job.salaryLabel)} / yr</p>
    <p class="details-description">${escapeHTML(job.description)}</p>
    <button class="button button-primary details-apply" type="button" data-job-id="${escapeHTML(job.id)}">Apply for this role <span aria-hidden="true">→</span></button>`;
  details.hidden = false;
  modal.showModal();
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderJobs();
  document.querySelector("#jobs").scrollIntoView({ behavior: "smooth", block: "start" });
});

keywordInput.addEventListener("input", renderJobs);
locationInput.addEventListener("input", renderJobs);
experienceFilter.addEventListener("change", renderJobs);
sortSelect.addEventListener("change", renderJobs);

document.querySelector("#type-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-type]");
  if (!button) return;
  activeType = button.dataset.type;
  document.querySelectorAll("#type-filters [data-type]").forEach((chip) => {
    const isSelected = chip === button;
    chip.classList.toggle("selected", isSelected);
    chip.setAttribute("aria-pressed", String(isSelected));
  });
  renderJobs();
});

document.querySelector(".popular-searches").addEventListener("click", (event) => {
  const button = event.target.closest("[data-search]");
  if (!button) return;
  keywordInput.value = button.dataset.search;
  renderJobs();
  document.querySelector("#jobs").scrollIntoView({ behavior: "smooth", block: "start" });
});

list.addEventListener("click", (event) => {
  const saveButton = event.target.closest(".save-button");
  if (saveButton) {
    const isSaved = saveButton.getAttribute("aria-pressed") === "true";
    saveButton.setAttribute("aria-pressed", String(!isSaved));
    saveButton.classList.toggle("saved", !isSaved);
    saveButton.textContent = isSaved ? "♡" : "♥";
    saveButton.title = isSaved ? "Save job" : "Remove saved job";
    saveButton.setAttribute("aria-label", isSaved
      ? saveButton.getAttribute("aria-label").replace("Unsave", "Save")
      : saveButton.getAttribute("aria-label").replace("Save", "Unsave"));
    return;
  }

  const applyButton = event.target.closest(".apply-button");
  if (applyButton && !applyButton.disabled) {
    openApplication(applyButton.dataset.jobId);
    return;
  }

  const detailButton = event.target.closest(".details-button, .job-detail-link");
  if (detailButton) {
    event.preventDefault();
    openRoleDetails(detailButton.dataset.jobId);
  }
});

document.querySelector("#role-details").addEventListener("click", (event) => {
  const applyButton = event.target.closest(".details-apply");
  if (applyButton) openApplication(applyButton.dataset.jobId);
});

document.querySelector("#application-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  appliedJobs.add(document.querySelector("#application-job-id").value);
  renderJobs();
  document.querySelector("#application-content").hidden = true;
  document.querySelector("#application-success").hidden = false;
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => modal.close());
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

document.querySelector("#reset-filters").addEventListener("click", () => {
  keywordInput.value = "";
  locationInput.value = "";
  experienceFilter.value = "All";
  sortSelect.value = "newest";
  activeType = "All";
  document.querySelectorAll("#type-filters [data-type]").forEach((chip) => {
    const isSelected = chip.dataset.type === "All";
    chip.classList.toggle("selected", isSelected);
    chip.setAttribute("aria-pressed", String(isSelected));
  });
  renderJobs();
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  document.querySelector("#newsletter-message").textContent = "You’re on the list. Watch your inbox!";
  event.currentTarget.reset();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open", !expanded);
});
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  }
});

renderJobs();
