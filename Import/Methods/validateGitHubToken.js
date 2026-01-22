// validateGitHubToken.js - Inno/JavaScript version
var GitHubAPIClient = require("./../scripts/github/apiClient");
var inn = ArasInnovator;

try {
  // Get parameters
  var token = this.getProperty("token", "");
  var apiUrl = this.getProperty("api_url", "https://api.github.com");

  if (!token) {
    return inn.newError("Token is required");
  }

  // Validate token
  var client = new GitHubAPIClient(token, apiUrl);
  var validation = client.validateToken();

  if (validation.valid) {
    var message = "Token is valid for user: " + validation.username;
    if (validation.name) {
      message += " (" + validation.name + ")";
    }
    return inn.newResult(message);
  } else {
    return inn.newError("Token validation failed: " + validation.reason);
  }
} catch (ex) {
  return inn.newError("Token validation error: " + ex.message);
}
