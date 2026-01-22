// syncGitHubRepository.js - Inno/JavaScript version
var GitHubAPIClient = require("./../scripts/github/apiClient");
var GitHubUtils = require("./../scripts/github/utils");
var inn = ArasInnovator;

try {
  var repositoryId = this.getProperty("repository_id", "");

  if (!repositoryId) {
    return inn.newError("Repository ID is required");
  }

  // Get the repository item
  var repository = inn.getItemById("GH_Repository", repositoryId);
  if (repository.isError()) {
    return repository;
  }

  var githubId = repository.getProperty("github_id", "");
  var owner = repository.getProperty("owner", "");
  var repoName = repository.getProperty("name", "");

  if (!githubId || !owner || !repoName) {
    return inn.newError("Repository data is incomplete");
  }

  // Get GitHub configuration (simplified - assumes first config)
  var config = inn.getItemByKeyedName("GH_Configuration", "Default");
  if (config.isError()) {
    return inn.newError("GitHub configuration not found");
  }

  var token = config.getProperty("github_token", "");
  var apiUrl = config.getProperty("api_url", "https://api.github.com");

  if (!token) {
    return inn.newError("GitHub token is not configured");
  }

  // Fetch latest repository data
  var client = new GitHubAPIClient(token, apiUrl);
  var repoData = client.getRepository(owner, repoName);

  // Validate response
  GitHubUtils.validateGitHubResponse(repoData);

  // Generate sync hash
  var syncHash = GitHubUtils.generateSyncHash(repoData);

  // Check if update is needed
  var currentHash = repository.getProperty("sync_hash", "");
  if (currentHash === syncHash) {
    return inn.newResult("Repository is already up to date");
  }

  // Update repository
  var updateRepo = inn.newItem("GH_Repository", "edit");
  updateRepo.setID(repositoryId);
  updateRepo.setProperty("name", repoData.name);
  updateRepo.setProperty("description", repoData.description || "");
  updateRepo.setProperty("full_name", repoData.full_name);
  updateRepo.setProperty("default_branch", repoData.default_branch);
  updateRepo.setProperty("clone_url", repoData.clone_url);
  updateRepo.setProperty("html_url", repoData.html_url);
  updateRepo.setProperty("owner", repoData.owner.login);
  updateRepo.setProperty("is_private", repoData.private ? "1" : "0");
  updateRepo.setProperty("stars", repoData.stargazers_count.toString());
  updateRepo.setProperty(
    "updated_at",
    GitHubUtils.formatDate(repoData.updated_at),
  );
  updateRepo.setProperty("sync_status", "synced");
  updateRepo.setProperty("sync_hash", syncHash);
  updateRepo.setProperty("last_synced", new Date().toISOString());

  updateRepo = updateRepo.apply();

  if (updateRepo.isError()) {
    return inn.newError(
      "Failed to update repository: " + updateRepo.getErrorString(),
    );
  }

  return inn.newResult(
    "Repository '" + repoData.name + "' updated successfully",
  );
} catch (ex) {
  // Update repository with error status
  try {
    var errorRepo = inn.newItem("GH_Repository", "edit");
    errorRepo.setID(repositoryId);
    errorRepo.setProperty("sync_status", "error");
    errorRepo.setProperty("last_synced", new Date().toISOString());
    errorRepo.apply();
  } catch (e) {
    // Ignore update errors
  }

  if (ex.message.includes("rate limit")) {
    return inn.newError(
      "GitHub API rate limit exceeded. Please try again later.",
    );
  } else if (ex.message.includes("Not Found")) {
    return inn.newError(
      "Repository not found on GitHub. It may have been deleted or renamed.",
    );
  } else {
    return inn.newError("Failed to sync repository: " + ex.message);
  }
}
