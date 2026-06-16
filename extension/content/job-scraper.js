const PLATFORM_SELECTORS = {
  linkedin: {
    company: "[data-test-job-company-name], .topcard__org-name-link",
    title: "h1[class*=topcard__title], .jobs-unified-top-card__job-title",
    location: ".topcard__flavor--bullet, .jobs-unified-top-card__subtitle-primary-grouping",
    description: ".description__text, .jobs-box__html-content",
    salary: ".salary, .salary-snippet"
  },
  indeed: {
    company: ".jobsearch-CompanyInfoWithoutHeaderImage div:nth-child(1), .icl-u-lg-mr--sm",
    title: "h1.jobsearch-JobInfoHeader-title, .jobsearch-JobInfoHeader-title",
    location: ".jobsearch-JobInfoHeader-subtitle div:last-child",
    description: "#jobDescriptionText, .jobsearch-jobDescriptionText",
    salary: ".jobsearch-JobMetadataHeader-item"
  }
};

function getText(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : "";
}

function collectListText(selector) {
  return Array.from(document.querySelectorAll(selector)).map((node) => node.textContent.trim()).filter(Boolean);
}

function normalizeJob(job) {
  return {
    id: window.location.href,
    source: window.location.hostname,
    company: job.company,
    role: job.title,
    location: job.location,
    salaryRange: job.salary,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    skills: job.skills,
    experienceLevel: job.experienceLevel,
    jobType: job.jobType,
    jobUrl: window.location.href,
    postedAt: new Date().toISOString()
  };
}

function getLinkedInJobData() {
  const requirements = collectListText(".description__text ul li, .jobs-description-content__text ul li");
  const skills = collectListText(".description__text li, .jobs-description-content__text li");
  return normalizeJob({
    company: getText(PLATFORM_SELECTORS.linkedin.company),
    title: getText(PLATFORM_SELECTORS.linkedin.title),
    location: getText(PLATFORM_SELECTORS.linkedin.location),
    salary: getText(PLATFORM_SELECTORS.linkedin.salary),
    requirements,
    responsibilities: requirements,
    skills,
    experienceLevel: "",
    jobType: ""
  });
}

function getIndeedJobData() {
  const requirements = collectListText("#jobDescriptionText ul li, #jobDescriptionText p");
  const skills = requirements;
  return normalizeJob({
    company: getText(PLATFORM_SELECTORS.indeed.company),
    title: getText(PLATFORM_SELECTORS.indeed.title),
    location: getText(PLATFORM_SELECTORS.indeed.location),
    salary: getText(PLATFORM_SELECTORS.indeed.salary),
    requirements,
    responsibilities: requirements,
    skills,
    experienceLevel: "",
    jobType: ""
  });
}

function getJobData() {
  const host = window.location.hostname;
  if (host.includes("linkedin.com")) {
    return getLinkedInJobData();
  }
  if (host.includes("indeed.com")) {
    return getIndeedJobData();
  }
  const description = collectListText("p, li");
  return normalizeJob({
    company: getText("[data-company], .company-name"),
    title: getText("h1, .job-title"),
    location: getText(".job-location"),
    salary: getText(".salary, .job-salary"),
    requirements: description,
    responsibilities: description,
    skills: description,
    experienceLevel: "",
    jobType: ""
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_JOB_DATA") {
    sendResponse({ success: true, data: getJobData() });
  }
});
