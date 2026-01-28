var inn = top.aras.getInnovator();

var aml = `<AML>
    <Item type="Method" action="add">
        <name>getGitHubRepositories</name>
        <method_type>JavaScript</method_type>
        <method_code><![CDATA[var inn = this.getInnovator();

// ERROR HANDLER
function handleError(context, error, options) {
  options = options || {};

  inn.newResult("ERROR [" + context + "]: " + error.message);
  if (error.stack) {
    var stack = error.stack;
    if (options.sanitizeToken) {
      stack = stack.replace(new RegExp(options.sanitizeToken, "gi"), "[TOKEN]");
    }
    inn.newResult("Stack trace: " + stack.substring(0, 300));
  }

  var message = error.message;
  if (options.sanitizeToken) {
    message = message.replace(
      new RegExp(options.sanitizeToken, "gi"),
      "[TOKEN]",
    );
  }

  return inn.newError(context + " failed: " + message);
}

// CONFIGURATION SERVICE
var ConfigService = {
  getGitHubConfig: function () {
    var aml =
      "<Item type='GH_Configuration' action='get' " +
      "select='github_token,api_url,github_user'>" +
      "<order_by>created_on</order_by></Item>";
    var result = inn.applyAML(aml);

    if (result.isError() || result.getItemCount() === 0) {
      return null;
    }

    var item = result.getItemByIndex(0);
    return {
      token: item.getProperty("github_token", ""),
      apiUrl: item.getProperty("api_url", "https://api.github.com"),
      username: item.getProperty("github_user", ""),
    };
  },
};

// HTTP CLIENT WITH OPTIONS OBJECT
var GitHubHttpClient = {
  call: function (options) {
    var config = options.config;
    var method = options.method || "GET";
    var path = options.path;
    var timeout = options.timeout || 30000;
    var body = options.body;

    if (!config || !path) {
      throw new Error("Missing required parameters: config and path");
    }

    var url = config.apiUrl + path;
    var http = inn.getHttpClient();

    var headers = {
      Authorization: "Bearer " + config.token,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Aras-GitHub-Integration",
      "Content-Type": "application/json",
    };

    http.setUrl(url);
    for (var header in headers) {
      if (headers.hasOwnProperty(header)) {
        http.setRequestHeader(header, headers[header]);
      }
    }
    http.setRequestMethod(method);

    if (body) {
      http.setRequestBody(JSON.stringify(body));
    }

    try {
      http.setTimeout(timeout);
      http.send();
    } catch (e) {
      throw new Error("Network error: " + e.message);
    }

    var status = http.getResponseStatusCode();

    // RESPONSE HANDLER PATTERN
    var responseHandlers = {
      200: function () {
        return JSON.parse(http.getResponseString());
      },
      401: function () {
        throw new Error("Unauthorized - Invalid GitHub token");
      },
      403: function () {
        throw new Error("Rate limit exceeded");
      },
      404: function () {
        throw new Error("Resource not found: " + path);
      },
      default: function () {
        throw new Error(
          "GitHub API error " + status + ": " + http.getResponseStatusText(),
        );
      },
    };

    var handler = responseHandlers[status] || responseHandlers.default;
    return handler();
  },
};

// VALIDATION HELPERS
var Validator = {
  required: function (value, fieldName) {
    if (!value || String(value).trim() === "") {
      throw new Error(fieldName + " is required");
    }
    return true;
  },

  isUrl: function (value, fieldName) {
    var pattern = /^https?:\/\/.+/;
    if (!pattern.test(value)) {
      throw new Error(fieldName + " must be a valid URL");
    }
    return true;
  },
};

// AML BUILDER PATTERN
var AMLBuilder = {
  create: function (itemType) {
    var parts = [];
    var attributes = {};

    return {
      action: function (action) {
        attributes.action = action;
        return this;
      },

      id: function (id) {
        if (id) attributes.id = id;
        return this;
      },

      property: function (name, value) {
        if (value !== undefined && value !== null) {
          parts.push(
            "<" + name + ">" + this.escapeXml(value) + "</" + name + ">",
          );
        }
        return this;
      },

      escapeXml: function (str) {
        if (!str && str !== 0) return "";
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      },

      build: function () {
        var aml = "<Item type='" + itemType + "'";

        for (var attr in attributes) {
          if (attributes.hasOwnProperty(attr) && attributes[attr]) {
            aml += " " + attr + "='" + attributes[attr] + "'";
          }
        }

        aml += ">";
        aml += parts.join("");
        aml += "</Item>";
        return aml;
      },
    };
  },
};

// SYNC STRATEGY PATTERN
var SyncStrategies = {
  createRepositorySync: function (repo) {
    // CACHING LAYER for hash calculation
    var Cache = {
      hashCache: {},
      getHash: function (key) {
        return this.hashCache[key];
      },
      setHash: function (key, value) {
        this.hashCache[key] = value;
      },
    };

    var syncHash = function () {
      var cacheKey = repo.id + "_hash";
      var cachedHash = Cache.getHash(cacheKey);
      if (cachedHash) return cachedHash;

      var data = {
        name: repo.name,
        description: repo.description || "",
        updated_at: repo.updated_at,
        stars: repo.stargazers_count || 0,
      };

      var str = JSON.stringify(data);
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash | 0;
      }

      var result = Math.abs(hash).toString();
      Cache.setHash(cacheKey, result);
      return result;
    };

    var formatDate = function (dateStr) {
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toISOString();
      } catch (e) {
        return "";
      }
    };

    return {
      execute: function () {
        var hash = syncHash();

        // Check if repository exists
        var checkAML = AMLBuilder.create("GH_Repository")
          .action("get")
          .property("github_id", repo.id)
          .build();

        var existing = inn.applyAML(checkAML);

        if (existing.isError()) {
          throw new Error(
            "Failed to check repository: " + existing.getErrorString(),
          );
        }

        var action = "add";
        var itemId = null;

        if (existing.getItemCount() > 0) {
          var existingRepo = existing.getItemByIndex(0);
          var currentHash = existingRepo.getProperty("sync_hash", "");

          if (currentHash === hash) {
            return {
              updated: false,
              reason: "No changes",
              id: existingRepo.getID(),
            };
          }

          action = "edit";
          itemId = existingRepo.getID();
        }

        var updateAML = AMLBuilder.create("GH_Repository")
          .action(action)
          .id(itemId)
          .property("github_id", repo.id)
          .property("name", repo.name)
          .property("description", repo.description || "")
          .property("full_name", repo.full_name)
          .property("default_branch", repo.default_branch)
          .property("clone_url", repo.clone_url)
          .property("html_url", repo.html_url)
          .property("owner", repo.owner.login)
          .property("is_private", repo.private ? "1" : "0")
          .property("stars", repo.stargazers_count || 0)
          .property("updated_at", formatDate(repo.updated_at))
          .property("sync_status", "synced")
          .property("sync_hash", hash)
          .property("last_synced", new Date().toISOString())
          .build();

        var result = inn.applyAML(updateAML);

        if (result.isError()) {
          throw new Error(
            (action === "add" ? "Create" : "Update") +
              " failed: " +
              result.getErrorString(),
          );
        }

        return {
          created: action === "add",
          updated: action === "edit",
          id: result.getID() || itemId,
        };
      },
    };
  },
};

// MAIN EXECUTION
try {
  Validator.required(this.getID(), "Item context");

  var config = ConfigService.getGitHubConfig();
  if (!config) {
    return handleError(
      "Configuration load",
      new Error(
        "GitHub configuration not found. Create a GH_Configuration item.",
      ),
    );
  }

  Validator.required(config.token, "GitHub Token");
  Validator.required(config.username, "GitHub Username");
  Validator.isUrl(config.apiUrl, "API URL");

  var repos = GitHubHttpClient.call({
    config: config,
    method: "GET",
    path:
      "/users/" +
      config.username +
      "/repos?type=owner&sort=updated&per_page=100",
    timeout: 45000,
  });

  if (!repos || !Array.isArray(repos)) {
    return handleError(
      "GitHub API",
      new Error("Invalid response from GitHub API"),
    );
  }

  var results = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    total: repos.length,
  };

  for (var i = 0; i < repos.length; i++) {
    try {
      var strategy = SyncStrategies.createRepositorySync(repos[i]);
      var result = strategy.execute();

      if (result.created) results.created++;
      if (result.updated) results.updated++;
      if (result.updated === false && result.reason === "No changes")
        results.skipped++;
    } catch (error) {
      results.errors.push({
        repository: repos[i].name || "Unknown",
        error: error.message,
      });
    }
  }

  var messageParts = [
    "Sync complete:",
    results.total + " total repositories",
    results.created + " created",
    results.updated + " updated",
    results.skipped + " unchanged",
  ];

  if (results.errors.length > 0) {
    messageParts.push(results.errors.length + " errors");

    for (var j = 0; j < Math.min(results.errors.length, 5); j++) {
      inn.newResult(
        "ERROR: " +
          results.errors[j].repository +
          ": " +
          results.errors[j].error,
      );
    }

    if (results.errors.length > 5) {
      inn.newResult("... and " + (results.errors.length - 5) + " more errors");
    }
  }

  return inn.newResult(messageParts.join(", "));
} catch (ex) {
  return handleError("GitHub Repository Sync", ex, {
    sanitizeToken: config ? config.token : "",
  });
}
]]></method_code>
    </Item>
</AML>`;

var result = inn.applyAML(aml);
result;
