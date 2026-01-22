// getGitHubRepositories.js - Inno/JavaScript version
var ConfigService = require("./../scripts/github/configService");
var RepositoryService = require("./../scripts/github/repositoryService");
var inn = ArasInnovator;

try {
  // Get parameters
  var configId = this.getProperty("config_id", "");
  var forceRefresh = this.getProperty("force_refresh", "0") === "1";

  // Get configuration
  var configService = new ConfigService(inn);
  var config = configService.getConfig(configId || null);

  // Initialize repository service
  var repoService = new RepositoryService(inn, config);

  // Sync repositories
  var result = repoService.syncAllRepositories();

  // Clear cache if force refresh
  if (forceRefresh) {
    configService.clearCache();
  }

  // Format result message
  var message = "Synced " + result.total + " repositories: ";
  message += result.created + " created, " + result.updated + " updated";

  if (result.errors && result.errors.length > 0) {
    message += ", " + result.errors.length + " errors";
    for (var i = 0; i < result.errors.length; i++) {
      inn.newResult(
        "Error with " +
          result.errors[i].repository +
          ": " +
          result.errors[i].error,
      );
    }
  }

  return inn.newResult(message);
} catch (ex) {
  // Log error
  inn.newError("GitHub sync failed: " + ex.message);

  // User-friendly error messages
  if (ex.message.includes("rate limit")) {
    return inn.newError(
      "GitHub API rate limit exceeded. Please try again later.",
    );
  } else if (ex.message.includes("authentication")) {
    return inn.newError(
      "GitHub authentication failed. Please check your token.",
    );
  } else if (ex.message.includes("configuration")) {
    return inn.newError("GitHub configuration not found or incomplete.");
  } else {
    return inn.newError("Failed to sync repositories: " + ex.message);
  }
}
