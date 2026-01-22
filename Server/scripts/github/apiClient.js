// Server/scripts/github/apiClient.js
const fetch = require("node-fetch");

class GitHubAPIClient {
  constructor(token, baseUrl = "https://api.github.com") {
    this.token = token;
    this.baseUrl = baseUrl;
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Aras-GitHub-Integration",
    };
  }

  async getRepositories(username, options = {}) {
    const { type = "owner", sort = "updated", direction = "desc" } = options;
    const url = `${this.baseUrl}/users/${username}/repos?type=${type}&sort=${sort}&direction=${direction}`;

    try {
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching repositories:", error);
      throw error;
    }
  }

  async getRepository(owner, repo) {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;

    try {
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching repository ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async validateToken() {
    const url = `${this.baseUrl}/user`;

    try {
      const response = await fetch(url, { headers: this.headers });

      if (response.status === 200) {
        const userData = await response.json();
        return {
          valid: true,
          username: userData.login,
          name: userData.name,
        };
      } else if (response.status === 401) {
        return { valid: false, reason: "Invalid token" };
      } else {
        return { valid: false, reason: `API error: ${response.status}` };
      }
    } catch (error) {
      console.error("Error validating token:", error);
      return { valid: false, reason: error.message };
    }
  }
}

module.exports = GitHubAPIClient;
