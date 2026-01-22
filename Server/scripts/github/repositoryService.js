// Server/scripts/github/repositoryService.js
const GitHubAPIClient = require("./apiClient");
const GitHubUtils = require("./utils");

class RepositoryService {
  constructor(inn, config) {
    this.inn = inn;
    this.config = config;
    this.apiClient = new GitHubAPIClient(config.token, config.apiUrl);
  }

  async syncAllRepositories() {
    try {
      const repos = await this.apiClient.getRepositories(this.config.username);
      const results = {
        created: 0,
        updated: 0,
        errors: [],
        total: repos.length,
      };

      for (const repo of repos) {
        try {
          const result = await this.syncRepository(repo);
          if (result.created) results.created++;
          if (result.updated) results.updated++;
        } catch (error) {
          results.errors.push({
            repository: repo.name,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to sync repositories: ${error.message}`);
    }
  }

  async syncRepository(repoData) {
    try {
      // Generate sync hash to detect changes
      const syncHash = GitHubUtils.generateSyncHash(repoData);

      // Check if repository exists
      const existingRepo = await this.findRepositoryByGitHubId(
        repoData.id.toString(),
      );

      if (existingRepo) {
        // Check if update is needed
        const existingHash = existingRepo.getProperty("sync_hash", "");
        if (existingHash === syncHash) {
          return {
            updated: false,
            id: existingRepo.getID(),
            reason: "No changes detected",
          };
        }

        // Update existing repository
        const updatedRepo = await this.updateRepository(
          existingRepo.getID(),
          repoData,
          syncHash,
        );
        return { updated: true, id: updatedRepo.getID() };
      } else {
        // Create new repository
        const newRepo = await this.createRepository(repoData, syncHash);
        return { created: true, id: newRepo.getID() };
      }
    } catch (error) {
      throw new Error(
        `Failed to sync repository ${repoData.name}: ${error.message}`,
      );
    }
  }

  async findRepositoryByGitHubId(githubId) {
    const aml = `
            <Item type='GH_Repository' action='get'>
                <github_id>${githubId}</github_id>
            </Item>
        `;

    const result = await this.inn.applyAML(aml);

    if (result.isError() || result.getItemCount() === 0) {
      return null;
    }

    return result.getItemByIndex(0);
  }

  async createRepository(repoData, syncHash) {
    const aml = `
            <Item type='GH_Repository' action='add'>
                <github_id>${repoData.id}</github_id>
                <name>${this.escapeXML(repoData.name)}</name>
                <description>${this.escapeXML(repoData.description || "")}</description>
                <full_name>${this.escapeXML(repoData.full_name)}</full_name>
                <default_branch>${this.escapeXML(repoData.default_branch)}</default_branch>
                <clone_url>${this.escapeXML(repoData.clone_url)}</clone_url>
                <html_url>${this.escapeXML(repoData.html_url)}</html_url>
                <owner>${this.escapeXML(repoData.owner.login)}</owner>
                <is_private>${repoData.private ? "1" : "0"}</is_private>
                <stars>${repoData.stargazers_count || 0}</stars>
                <updated_at>${GitHubUtils.formatDate(repoData.updated_at)}</updated_at>
                <sync_status>synced</sync_status>
                <sync_hash>${syncHash}</sync_hash>
                <last_synced>${new Date().toISOString()}</last_synced>
            </Item>
        `;

    const result = await this.inn.applyAML(aml);

    if (result.isError()) {
      throw new Error(
        `Failed to create repository: ${result.getErrorString()}`,
      );
    }

    return result;
  }

  async updateRepository(repoId, repoData, syncHash) {
    const aml = `
            <Item type='GH_Repository' action='edit' id='${repoId}'>
                <name>${this.escapeXML(repoData.name)}</name>
                <description>${this.escapeXML(repoData.description || "")}</description>
                <full_name>${this.escapeXML(repoData.full_name)}</full_name>
                <default_branch>${this.escapeXML(repoData.default_branch)}</default_branch>
                <clone_url>${this.escapeXML(repoData.clone_url)}</clone_url>
                <html_url>${this.escapeXML(repoData.html_url)}</html_url>
                <owner>${this.escapeXML(repoData.owner.login)}</owner>
                <is_private>${repoData.private ? "1" : "0"}</is_private>
                <stars>${repoData.stargazers_count || 0}</stars>
                <updated_at>${GitHubUtils.formatDate(repoData.updated_at)}</updated_at>
                <sync_status>synced</sync_status>
                <sync_hash>${syncHash}</sync_hash>
                <last_synced>${new Date().toISOString()}</last_synced>
            </Item>
        `;

    const result = await this.inn.applyAML(aml);

    if (result.isError()) {
      throw new Error(
        `Failed to update repository: ${result.getErrorString()}`,
      );
    }

    return result;
  }

  escapeXML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

module.exports = RepositoryService;
