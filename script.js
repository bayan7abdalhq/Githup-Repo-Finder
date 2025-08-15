const languageSelect = document.getElementById("language-select");
const searchButton = document.getElementById("search-button");
const refreshButton = document.getElementById("refresh-button");
const retryButton = document.getElementById("retry-button");

const repoName = document.getElementById("repo-name");
const repoDescription = document.getElementById("repo-description");
const repoStars = document.getElementById("repo-stars");
const repoForks = document.getElementById("repo-forks");
const repoIssues = document.getElementById("repo-issues");
const repoLink = document.getElementById("repo-link");

const messages = {
  loading: document.getElementById("loading-message"),
  error: document.getElementById("error-message"),
  result: document.getElementById("repository-result")
};

const languagesURL = "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
let currentLanguage = "";

function showMessage(state) {
  Object.values(messages).forEach(el => el.style.display = "none");
  messages[state].style.display = "block";
}


async function loadLanguages() {
  try {
    const response = await fetch(languagesURL);
    const data = await response.json();
    data.forEach(lang => {
      const option = document.createElement("option");
      option.value = lang.value;
      option.textContent = lang.title;
      languageSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading languages:", error);
  }
}

// Fetch random repository
async function fetchRepository() {
  const selectedLanguage = languageSelect.value;
  if (!selectedLanguage) return alert("Please select a programming language.");
  currentLanguage = selectedLanguage;

  showMessage("loading");

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc&per_page=100`);
    if (!response.ok) throw new Error("`HTTP error! status: ${response.status}`");
    const data = await response.json();
    const repositories = data.items;

    
    const randomRepo = repositories[Math.floor(Math.random() * repositories.length)];

    repoName.textContent = randomRepo.name;
    repoDescription.textContent = randomRepo.description || "No description available.";
    repoStars.textContent = randomRepo.stargazers_count.toLocaleString();
    repoForks.textContent = randomRepo.forks_count.toLocaleString();
    repoIssues.textContent = randomRepo.open_issues_count.toLocaleString();
    repoLink.href = randomRepo.html_url;

    showMessage("result");
  } catch (error) {
    console.error("Error fetching repositories:", error);
    showMessage("error", error.message);
  }
}

function retrySearch() {
  languageSelect.value = currentLanguage;
  fetchRepository();
}

searchButton.addEventListener("click", fetchRepository);
refreshButton.addEventListener("click", retrySearch);
retryButton.addEventListener("click", retrySearch);
loadLanguages();