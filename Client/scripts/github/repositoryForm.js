// Client-side enhancements for GitHub Repository form
// This will be loaded by the main form

(function () {
  "use strict";

  // Wait for Aras to be ready
  if (typeof aras === "undefined") {
    console.warn("Aras not loaded yet, waiting...");
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    console.log("GitHub Repository Form enhancement loaded");

    // Add custom CSS
    addCustomStyles();

    // Enhance the form if we're on a repository form
    if (document.itemType === "GIT_Repository") {
      enhanceRepositoryForm();
    }
  }

  function addCustomStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .github-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        margin-left: 8px;
      }
      .github-badge.public {
        background: #2ea44f;
        color: white;
      }
      .github-badge.private {
        background: #f6f8fa;
        color: #24292e;
        border: 1px solid #d1d5da;
      }
      .github-badge.archived {
        background: #f0f0f0;
        color: #666;
        border: 1px solid #ddd;
      }
    `;
    document.head.appendChild(style);
  }

  function enhanceRepositoryForm() {
    const item = document.thisItem;
    if (!item) return;

    // Add GitHub badges to header
    addRepositoryBadges(item);

    // Add sync button to toolbar if not already present
    addSyncButtonToToolbar();

    // Enhance form fields
    enhanceFormFields();
  }

  function addRepositoryBadges(item) {
    const header = document.querySelector(".form-header");
    if (!header) return;

    const badgeContainer = document.createElement("div");
    badgeContainer.style.marginTop = "5px";

    // Private badge
    if (item.getProperty("is_private") === "1") {
      const privateBadge = document.createElement("span");
      privateBadge.className = "github-badge private";
      privateBadge.textContent = "Private";
      badgeContainer.appendChild(privateBadge);
    } else {
      const publicBadge = document.createElement("span");
      publicBadge.className = "github-badge public";
      publicBadge.textContent = "Public";
      badgeContainer.appendChild(publicBadge);
    }

    // Archived badge
    if (item.getProperty("is_archived") === "1") {
      const archivedBadge = document.createElement("span");
      archivedBadge.className = "github-badge archived";
      archivedBadge.textContent = "Archived";
      badgeContainer.appendChild(archivedBadge);
    }

    header.appendChild(badgeContainer);
  }

  function addSyncButtonToToolbar() {
    const toolbar = document.querySelector(".toolbar-container");
    if (!toolbar) return;

    // Check if sync button already exists
    if (document.querySelector("#githubSyncBtn")) return;

    const syncBtn = document.createElement("button");
    syncBtn.id = "githubSyncBtn";
    syncBtn.className = "aras-button";
    syncBtn.innerHTML = "<span>🔄 Sync Repository</span>";
    syncBtn.title = "Sync this repository with GitHub";
    syncBtn.onclick = function () {
      aras.AlertWarning(
        "GitHub sync functionality will be implemented when API is connected",
      );
    };

    toolbar.appendChild(syncBtn);
  }

  function enhanceFormFields() {
    // Make description field show GitHub-flavored markdown preview
    const descField = getField("description");
    if (descField) {
      // Add a note about markdown
      const fieldContainer = descField.parentNode;
      if (fieldContainer) {
        const note = document.createElement("div");
        note.style.fontSize = "11px";
        note.style.color = "#586069";
        note.style.marginTop = "5px";
        note.textContent =
          "Note: Description supports GitHub Flavored Markdown";
        fieldContainer.appendChild(note);
      }
    }
  }

  // Helper to get field by name
  function getField(name) {
    return document.querySelector(`[name="${name}"]`);
  }

  // Export for Aras
  if (typeof window !== "undefined") {
    window.githubRepositoryForm = {
      init: init,
      enhanceRepositoryForm: enhanceRepositoryForm,
    };
  }
})();
