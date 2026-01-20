// Server-side GitHub API client (placeholder)
// Will be called by server methods

module.exports = {
  /**
   * Test GitHub API connection
   * @param {string} token - GitHub Personal Access Token
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection(token) {
    console.log("GitHub API: Testing connection (placeholder)");

    // Placeholder response
    return {
      success: true,
      message: "GitHub API connection test - placeholder mode",
      rateLimit: {
        limit: 5000,
        remaining: 5000,
        reset: new Date(Date.now() + 3600000).toISOString(),
      },
      user: "github-user-placeholder",
    };
  },

  /**
   * Get repositories for authenticated user
   * @param {string} token - GitHub token
   * @returns {Promise<Array>} List of repositories
   */
  async getRepositories(token) {
    console.log("GitHub API: Getting repositories (placeholder)");

    // Placeholder data
    return [
      {
        id: 123456789,
        name: "example-repo",
        full_name: "octocat/example-repo",
        description: "Example repository for GitHub integration",
        private: false,
        html_url: "https://github.com/octocat/example-repo",
        clone_url: "https://github.com/octocat/example-repo.git",
        ssh_url: "git@github.com:octocat/example-repo.git",
        default_branch: "main",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  /**
   * Get issues for a repository
   * @param {string} token - GitHub token
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} List of issues
   */
  async getIssues(token, owner, repo) {
    console.log(
      `GitHub API: Getting issues for ${owner}/${repo} (placeholder)`,
    );

    // Placeholder data
    return [
      {
        number: 1,
        title: "Example Issue",
        body: "This is an example issue for testing",
        state: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        html_url: `https://github.com/${owner}/${repo}/issues/1`,
      },
    ];
  },

  /**
   * Create a new issue
   * @param {string} token - GitHub token
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {Object} issue - Issue data
   * @returns {Promise<Object>} Created issue
   */
  async createIssue(token, owner, repo, issue) {
    console.log(`GitHub API: Creating issue in ${owner}/${repo} (placeholder)`);

    // Placeholder response
    return {
      ...issue,
      number: 999,
      state: "open",
      created_at: new Date().toISOString(),
      html_url: `https://github.com/${owner}/${repo}/issues/999`,
    };
  },
};
