import { getLocalStorage } from "../utils/storage.js";

const totalApplications = document.getElementById("totalApplications");
const avgATS = document.getElementById("avgATS");
const interviewCount = document.getElementById("interviewCount");
const offerCount = document.getElementById("offerCount");
const pipelineContainer = document.getElementById("pipelineContainer");
const refreshBtn = document.getElementById("refreshBtn");

function createPipelineCard(application) {
  const card = document.createElement("article");
  card.className = "pipeline-card";
  card.innerHTML = `
    <h3>${application.role || "Unknown role"}</h3>
    <strong>${application.company || "Unknown company"}</strong>
    <span>Status: ${application.status || "Applied"}</span>
    <span>ATS: ${application.atsScore || 0}%</span>
    <span>Date: ${new Date(application.dateApplied || application.createdAt || Date.now()).toLocaleDateString()}</span>
  `;
  return card;
}

async function renderDashboard() {
  const applications = (await getLocalStorage("applypilot_applications")) || [];
  totalApplications.textContent = `${applications.length}`;
  const interview = applications.filter((item) => item.status === "Interview").length;
  const offers = applications.filter((item) => item.status === "Offer").length;
  interviewCount.textContent = `${interview}`;
  offerCount.textContent = `${offers}`;
  const average = applications.length ? Math.round(applications.reduce((sum, item) => sum + (item.atsScore || 0), 0) / applications.length) : 0;
  avgATS.textContent = `${average}%`;
  pipelineContainer.innerHTML = "";
  if (applications.length === 0) {
    pipelineContainer.innerHTML = "<p>No applications tracked yet. Use the extension popup to add a job application.</p>";
    return;
  }
  applications.forEach((application) => pipelineContainer.appendChild(createPipelineCard(application)));
}

refreshBtn.addEventListener("click", renderDashboard);

window.addEventListener("DOMContentLoaded", renderDashboard);
