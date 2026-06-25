const API_URL = "http://localhost:5000/api/posts/top?limit=10";

function setStateMessage(text, isError = false) {
  const el = document.getElementById("state-message");
  if (!el) return;
  if (!text) {
    el.textContent = "";
    el.hidden = true;
    return;
  }
  el.textContent = text;
  el.hidden = false;
  el.className = isError ? "state-message state-message--error" : "state-message";
}

function formatDate(unixSeconds) {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildPostHTML(post, rank) {
  const date = formatDate(post.created_utc);
  return `
    <li class="post-item">
      <div class="post-rank">${rank}</div>
      <div class="post-body">
        <a class="post-title" href="${post.url}" target="_blank" rel="noopener noreferrer">
          ${post.title}
        </a>
        <div class="post-meta">
          <span>${post.score} points</span>
          <span>by ${post.author}</span>
          <span>${date}</span>
          <a href="${post.permalink}" target="_blank" rel="noopener noreferrer">
            ${post.num_comments} comments
          </a>
        </div>
      </div>
    </li>
  `;
}

function renderPosts(posts) {
  const list = document.getElementById("post-list");
  if (!list) return;
  const html = posts.map((post, index) => buildPostHTML(post, index + 1)).join("");
  list.innerHTML = html;
}

async function fetchTopPosts() {
  setStateMessage("Loading posts...");
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error || "API error");
    setStateMessage("");
    renderPosts(result.data);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    setStateMessage("Could not load posts. Make sure the backend server is running on port 5000.", true);
  }
}

fetchTopPosts();
