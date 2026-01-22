const crypto = require("crypto");

class GitHubUtils {
  static validateGitHubResponse(response) {
    if (!response || typeof response !== "object") {
      throw new Error("Invalid GitHub API response");
    }

    // Check for GitHub API error messages
    if (
      response.message &&
      response.message.includes("API rate limit exceeded")
    ) {
      throw new Error("GitHub API rate limit exceeded");
    }

    if (response.message && response.documentation_url) {
      throw new Error(`GitHub API error: ${response.message}`);
    }

    return true;
  }

  static generateSyncHash(repositoryData) {
    // Create a hash to detect changes in repository data
    const dataString = JSON.stringify({
      name: repositoryData.name,
      description: repositoryData.description,
      default_branch: repositoryData.default_branch,
      updated_at: repositoryData.updated_at,
      stars: repositoryData.stargazers_count,
    });

    return crypto.createHash("md5").update(dataString).digest("hex");
  }

  static formatDate(githubDate) {
    if (!githubDate) return null;
    return new Date(githubDate).toISOString();
  }

  static extractOwnerFromFullName(fullName) {
    if (!fullName) return null;
    const parts = fullName.split("/");
    return parts.length > 0 ? parts[0] : null;
  }

  static sanitizeString(input) {
    if (!input) return "";
    return String(input).replace(/[<>]/g, "").substring(0, 4000);
  }
}

module.exports = GitHubUtils;
