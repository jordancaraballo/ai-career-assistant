const resumeText = document.querySelector("#resumeText");
const jobText = document.querySelector("#jobText");
const resumeFile = document.querySelector("#resumeFile");
const fileMessage = document.querySelector("#fileMessage");
const analyzeButton = document.querySelector("#analyzeButton");
const statusEl = document.querySelector("#analysisStatus");
const fitScoreEl = document.querySelector("#fitScore");
const skillsFoundEl = document.querySelector("#skillsFound");
const skillsToLearnEl = document.querySelector("#skillsToLearn");
const jobMatchesEl = document.querySelector("#jobMatches");
const canvas = document.querySelector("#skillCanvas");
const ctx = canvas.getContext("2d");

const skillTaxonomy = [
  {
    skill: "Python",
    category: "Programming",
    aliases: ["python", "pandas", "numpy", "scikit-learn", "sklearn", "fastapi", "flask"],
    learning: "Build three small Python projects that read data, transform it, and expose results in an API."
  },
  {
    skill: "JavaScript",
    category: "Programming",
    aliases: ["javascript", "typescript", "react", "node", "frontend", "web app", "dom"],
    learning: "Create interactive UI components and practice fetching data from a JSON API."
  },
  {
    skill: "SQL",
    category: "Data",
    aliases: ["sql", "postgres", "mysql", "sqlite", "database", "queries"],
    learning: "Practice joins, grouping, filtering, and window functions on a realistic dataset."
  },
  {
    skill: "Machine Learning",
    category: "AI",
    aliases: ["machine learning", "ml", "classification", "regression", "model training", "supervised"],
    learning: "Train and evaluate a small classification model, then explain precision, recall, and tradeoffs."
  },
  {
    skill: "NLP",
    category: "AI",
    aliases: ["nlp", "natural language", "text processing", "tokenization", "language model"],
    learning: "Build a text classifier or resume parser using tokenization and similarity scoring."
  },
  {
    skill: "Embeddings",
    category: "AI",
    aliases: ["embedding", "embeddings", "vector", "semantic search", "transformer", "sentence transformer"],
    learning: "Use sentence embeddings to compare resumes, job descriptions, and project summaries."
  },
  {
    skill: "Vector Search",
    category: "AI",
    aliases: ["vector search", "cosine similarity", "nearest neighbor", "faiss", "pinecone", "chroma"],
    learning: "Store text vectors and rank documents by cosine similarity."
  },
  {
    skill: "Data Visualization",
    category: "Data",
    aliases: ["dashboard", "visualization", "chart", "matplotlib", "plotly", "tableau"],
    learning: "Turn analysis output into clear charts with labels, tooltips, and readable color choices."
  },
  {
    skill: "APIs",
    category: "Software",
    aliases: ["api", "rest", "json", "http", "endpoint", "integration"],
    learning: "Design a simple REST API with clear request and response shapes."
  },
  {
    skill: "Cloud",
    category: "Software",
    aliases: ["cloud", "aws", "azure", "gcp", "docker", "deployment", "serverless"],
    learning: "Deploy a small app and document its environment variables, build command, and runtime."
  },
  {
    skill: "UX Design",
    category: "Product",
    aliases: ["ux", "user experience", "wireframe", "prototype", "accessibility", "usability"],
    learning: "Interview a user, sketch a flow, and improve the interface based on their feedback."
  },
  {
    skill: "Communication",
    category: "Professional",
    aliases: ["presentation", "communication", "stakeholder", "documentation", "collaboration"],
    learning: "Write a project README that explains the problem, decisions, results, and next steps."
  }
];

const mockJobs = [
  {
    title: "Junior Data Analyst",
    company: "Northstar Health",
    location: "Remote",
    salary: "$62k - $78k",
    description: "Analyze healthcare operations data with SQL, Python, dashboards, and stakeholder communication.",
    requiredSkills: ["SQL", "Python", "Data Visualization", "Communication"]
  },
  {
    title: "AI Product Intern",
    company: "BrightPath Labs",
    location: "New York, NY",
    salary: "$28/hr",
    description: "Prototype NLP workflows, evaluate embeddings, improve UX flows, and summarize model behavior.",
    requiredSkills: ["NLP", "Embeddings", "UX Design", "Communication"]
  },
  {
    title: "Software Engineer Intern",
    company: "CivicStack",
    location: "Hybrid",
    salary: "$32/hr",
    description: "Build JavaScript frontends, connect REST APIs, work with databases, and ship production features.",
    requiredSkills: ["JavaScript", "APIs", "SQL", "UX Design"]
  },
  {
    title: "Machine Learning Intern",
    company: "Atlas Retail AI",
    location: "Boston, MA",
    salary: "$35/hr",
    description: "Train ML models, process text datasets, compare embeddings, and deploy experiments with Python.",
    requiredSkills: ["Python", "Machine Learning", "NLP", "Embeddings", "Cloud"]
  },
  {
    title: "Search Relevance Intern",
    company: "Mercury Market",
    location: "Remote",
    salary: "$30/hr",
    description: "Improve semantic search using vector search, nearest neighbor ranking, APIs, and evaluation metrics.",
    requiredSkills: ["Vector Search", "Embeddings", "APIs", "Python"]
  }
];

const sampleResume = `Computer Science student with projects in Python, JavaScript, SQL, and data visualization.
Built a Flask dashboard using pandas and matplotlib to analyze customer trends.
Created a React portfolio with REST API integrations and documented the project for classmates.
Interested in machine learning, accessibility, and clear communication with users.`;

const sampleJob = `We are hiring an AI Product Intern to prototype resume and job matching tools.
The role uses NLP, transformer embeddings, vector search, Python, UX design, and clear communication.
Experience with APIs, dashboards, and machine learning experiments is a plus.`;

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ");
}

function tokenize(text) {
  return normalize(text)
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function includesAlias(text, alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\b)${escaped}(\\b|$)`, "i").test(text);
}

function extractSkills(text) {
  const normalized = normalize(text);
  return skillTaxonomy
    .filter((entry) => entry.aliases.some((alias) => includesAlias(normalized, alias)))
    .map((entry) => entry.skill);
}

function hashToken(token, dimensions) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % dimensions;
}

function embedText(text, dimensions = 96) {
  const vector = Array(dimensions).fill(0);
  const tokens = tokenize(text);
  const skills = extractSkills(text);

  tokens.forEach((token) => {
    const bucket = hashToken(token, dimensions);
    vector[bucket] += 1 / Math.sqrt(tokens.length || 1);
  });

  skills.forEach((skill) => {
    const bucket = hashToken(`skill:${skill}`, dimensions);
    vector[bucket] += 2.4;
  });

  return vector;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] ** 2;
    normB += b[index] ** 2;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function compareSkills(resumeSkills, targetSkills) {
  const resumeSet = new Set(resumeSkills);
  const matched = targetSkills.filter((skill) => resumeSet.has(skill));
  const missing = targetSkills.filter((skill) => !resumeSet.has(skill));
  return { matched, missing };
}

function rankJobs(resume, target) {
  const resumeVector = embedText(resume);
  const targetVector = embedText(target);
  const resumeSkills = extractSkills(resume);
  const targetSkills = extractSkills(target);

  return mockJobs
    .map((job) => {
      const jobTextForEmbedding = `${job.title} ${job.description} ${job.requiredSkills.join(" ")}`;
      const jobVector = embedText(jobTextForEmbedding);
      const resumeSimilarity = cosineSimilarity(resumeVector, jobVector);
      const targetSimilarity = cosineSimilarity(targetVector, jobVector);
      const requiredMatched = job.requiredSkills.filter((skill) => resumeSkills.includes(skill));
      const requiredFromTarget = job.requiredSkills.filter((skill) => targetSkills.includes(skill));
      const coverage = requiredMatched.length / job.requiredSkills.length;
      const score = resumeSimilarity * 0.5 + targetSimilarity * 0.25 + coverage * 0.25;

      return {
        ...job,
        score,
        requiredMatched,
        requiredFromTarget
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function renderTags(container, skills) {
  container.classList.remove("empty");
  container.innerHTML = "";

  if (!skills.length) {
    container.classList.add("empty");
    container.textContent = "No known skills detected yet.";
    return;
  }

  skills.forEach((skill) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = skill;
    container.append(tag);
  });
}

function renderRecommendations(missingSkills) {
  skillsToLearnEl.classList.remove("empty");
  skillsToLearnEl.innerHTML = "";

  if (!missingSkills.length) {
    skillsToLearnEl.classList.add("empty");
    skillsToLearnEl.textContent = "Strong match. Add proof projects for the skills already listed.";
    return;
  }

  missingSkills.forEach((skill) => {
    const entry = skillTaxonomy.find((item) => item.skill === skill);
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `<strong>${skill}</strong><span>${entry.learning}</span>`;
    skillsToLearnEl.append(card);
  });
}

function renderJobs(jobs) {
  jobMatchesEl.classList.remove("empty");
  jobMatchesEl.innerHTML = "";

  jobs.forEach((job) => {
    const percent = Math.round(job.score * 100);
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <strong>${job.title}</strong>
      <span>${job.company} · ${job.location} · ${job.salary}</span>
      <span>${job.description}</span>
      <span>Matched: ${job.requiredMatched.join(", ") || "Build more evidence"}</span>
      <div class="meter" aria-label="${percent}% match"><span style="width: ${percent}%"></span></div>
    `;
    jobMatchesEl.append(card);
  });
}

function drawChart(matchedCount, missingCount, extraCount) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bars = [
    { label: "Matched", value: matchedCount, color: "#0e8f78" },
    { label: "Missing", value: missingCount, color: "#cf5f45" },
    { label: "Extra", value: extraCount, color: "#477caa" }
  ];
  const maxValue = Math.max(1, ...bars.map((bar) => bar.value));

  ctx.fillStyle = "#fbfcfc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d8e0e3";
  ctx.beginPath();
  ctx.moveTo(42, 24);
  ctx.lineTo(42, 176);
  ctx.lineTo(390, 176);
  ctx.stroke();

  bars.forEach((bar, index) => {
    const width = 72;
    const x = 78 + index * 112;
    const height = (bar.value / maxValue) * 126;
    const y = 176 - height;

    ctx.fillStyle = bar.color;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#182026";
    ctx.font = "700 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(bar.value), x + width / 2, y - 8);
    ctx.fillStyle = "#5e6a73";
    ctx.font = "700 13px system-ui";
    ctx.fillText(bar.label, x + width / 2, 202);
  });
}

function analyze() {
  const resume = resumeText.value.trim();
  const target = jobText.value.trim();

  if (!resume || !target) {
    statusEl.textContent = "Need Text";
    return;
  }

  const resumeSkills = extractSkills(resume);
  const targetSkills = extractSkills(target);
  const { matched, missing } = compareSkills(resumeSkills, targetSkills);
  const resumeVector = embedText(resume);
  const targetVector = embedText(target);
  const semanticScore = cosineSimilarity(resumeVector, targetVector);
  const skillCoverage = targetSkills.length ? matched.length / targetSkills.length : 0;
  const fitScore = Math.round((semanticScore * 0.55 + skillCoverage * 0.45) * 100);
  const extraSkills = resumeSkills.filter((skill) => !targetSkills.includes(skill));

  fitScoreEl.textContent = `${Math.min(99, fitScore)}%`;
  statusEl.textContent = "Analyzed";
  renderTags(skillsFoundEl, resumeSkills);
  renderRecommendations(missing);
  renderJobs(rankJobs(resume, target));
  drawChart(matched.length, missing.length, extraSkills.length);
}

resumeFile.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    fileMessage.textContent = "PDF selected. Paste extracted text for best results.";
    return;
  }

  resumeText.value = await file.text();
  fileMessage.textContent = `${file.name} loaded`;
});

document.querySelector("#loadSampleResume").addEventListener("click", () => {
  resumeText.value = sampleResume;
  fileMessage.textContent = "Sample loaded";
});

document.querySelector("#loadSampleJob").addEventListener("click", () => {
  jobText.value = sampleJob;
});

analyzeButton.addEventListener("click", analyze);
drawChart(0, 0, 0);
