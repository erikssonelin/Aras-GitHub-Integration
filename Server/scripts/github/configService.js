// Server/scripts/github/configService.js
class ConfigService {
  constructor(inn) {
    this.inn = inn;
    this.cache = {};
    this.cacheTime = 5 * 60 * 1000; // 5 minutes cache
  }

  async getConfig(configId = null) {
    const cacheKey = configId || "default";

    // Check cache
    if (
      this.cache[cacheKey] &&
      Date.now() - this.cache[cacheKey].timestamp < this.cacheTime
    ) {
      return this.cache[cacheKey].config;
    }

    try {
      let aml;
      if (configId) {
        aml = `<Item type='GH_Configuration' action='get' id='${configId}'>
                          <github_token></github_token>
                          <api_url></api_url>
                          <github_user></github_user>
                       </Item>`;
      } else {
        // Get first available config
        aml = `<Item type='GH_Configuration' action='get' select='id,github_token,api_url,github_user'>
                         <order_by>created_on</order_by>
                       </Item>`;
      }

      const result = await this.inn.applyAML(aml);

      if (result.isError() || result.getItemCount() === 0) {
        throw new Error("GitHub configuration not found");
      }

      const config = {
        token: result.getItemByIndex(0).getProperty("github_token", ""),
        apiUrl: result
          .getItemByIndex(0)
          .getProperty("api_url", "https://api.github.com"),
        username: result.getItemByIndex(0).getProperty("github_user", ""),
        configId: result.getItemByIndex(0).getID(),
      };

      // Validate required fields
      if (!config.token || !config.username) {
        throw new Error("GitHub configuration is incomplete");
      }

      // Cache the config
      this.cache[cacheKey] = {
        config: config,
        timestamp: Date.now(),
      };

      return config;
    } catch (error) {
      console.error("Error loading GitHub config:", error);
      throw error;
    }
  }

  clearCache() {
    this.cache = {};
  }
}

module.exports = ConfigService;
