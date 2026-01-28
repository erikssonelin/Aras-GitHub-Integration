var inn = top.aras.getInnovator();

var aml = `<AML>
  <Item type="Form" action="add">
    <name>GH_Configuration_Form</name>
    <label xml:lang="en">GitHub Configuration</label>
    <description xml:lang="en">Configure GitHub integration settings</description>
    <core>0</core>
    <body>
   <![CDATA[<form>
    <head>
      <title>GitHub Configuration</title>
      <style>
        .github-config {
          padding: 20px;
          max-width: 600px;
        }
        .config-section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #0079d3;
        }
        .config-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
          font-size: 18px;
        }
        .config-field {
          margin-bottom: 20px;
        }
        .field-label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #495057;
        }
        .field-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .field-input:focus {
          outline: none;
          border-color: #0079d3;
          box-shadow: 0 0 0 3px rgba(0, 121, 211, 0.1);
        }
        .field-input.error {
          border-color: #dc3545;
        }
        .help-text {
          color: #6c757d;
          font-size: 13px;
          margin-top: 5px;
          line-height: 1.4;
        }
        .validation-error {
          color: #dc3545;
          font-size: 13px;
          margin-top: 5px;
          display: none;
        }
        .actions {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .action-button {
          padding: 10px 20px;
          background: #0079d3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.15s;
        }
        .action-button:hover {
          background: #005fa3;
        }
        .action-button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        .action-button.secondary {
          background: #6c757d;
        }
        .action-button.secondary:hover {
          background: #545b62;
        }
        .action-button.success {
          background: #28a745;
        }
        .action-button.success:hover {
          background: #1e7e34;
        }
        .loading-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0079d3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .message {
          padding: 12px 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          display: none;
          font-size: 14px;
        }
        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        .token-visibility {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }
        .token-visibility input {
          margin-right: 8px;
        }
        .token-visibility label {
          font-size: 13px;
          color: #6c757d;
          cursor: pointer;
        }
        .status-indicator {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .status-valid {
          background: #28a745;
        }
        .status-invalid {
          background: #dc3545;
        }
        .status-unknown {
          background: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner"></div>
      </div>

      <div class="github-config">
        <div class="message" id="message"></div>

        <div class="config-section">
          <h3>GitHub Authentication</h3>

          <div class="config-field">
            <label class="field-label" for="github_token">
              GitHub Token
              <span id="tokenStatus" style="display: none;">
                <span class="status-indicator status-unknown"></span>
                <span id="tokenStatusText">Not validated</span>
              </span>
            </label>
            <input type="password"
                   id="github_token"
                   class="field-input"
                   aras_name="github_token"
                   placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
            <div class="validation-error" id="tokenError"></div>
            <div class="help-text">
              Generate a personal access token at:
              <a href="https://github.com/settings/tokens" target="_blank">
                https://github.com/settings/tokens
              </a>
            </div>
            <div class="token-visibility">
              <input type="checkbox" id="showToken">
              <label for="showToken">Show token</label>
            </div>
          </div>

          <div class="config-field">
            <label class="field-label" for="github_user">
              GitHub Username or Organization
            </label>
            <input type="text"
                   id="github_user"
                   class="field-input"
                   aras_name="github_user"
                   placeholder="your-username or organization-name" />
            <div class="validation-error" id="userError"></div>
            <div class="help-text">
              Your personal GitHub username or organization name
            </div>
          </div>

          <div class="config-field">
            <label class="field-label" for="api_url">
              GitHub API URL
            </label>
            <input type="text"
                   id="api_url"
                   class="field-input"
                   aras_name="api_url"
                   placeholder="https://api.github.com" />
            <div class="validation-error" id="urlError"></div>
            <div class="help-text">
              Default: https://api.github.com (use https://api.github.com for GitHub Enterprise)
            </div>
          </div>
        </div>

        <div class="config-section">
          <h3>Connection Test</h3>
          <div class="help-text">
            Test your configuration before saving
          </div>
        </div>

        <div class="actions">
          <button class="action-button secondary" id="testButton">
            Test Connection
          </button>
          <button class="action-button success" id="saveButton">
            Save Configuration
          </button>
          <button class="action-button" id="loadReposButton">
            Load Repositories
          </button>
        </div>
      </div>

      <script>
        // FORM STATE MANAGER
        var FormState = {
          isLoading: false,
          tokenValidated: false,

          setLoading: function(loading) {
            this.isLoading = loading;
            var overlay = document.getElementById('loadingOverlay');
            var buttons = document.querySelectorAll('.action-button');

            overlay.style.display = loading ? 'flex' : 'none';
            buttons.forEach(function(btn) {
              if (btn.id !== 'saveButton') {
                btn.disabled = loading;
              }
            });
          },

          showMessage: function(type, text, persistent) {
            var messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.className = 'message ' + type;
            messageEl.style.display = 'block';

            if (!persistent) {
              setTimeout(function() {
                messageEl.style.display = 'none';
              }, 5000);
            }
          },

          updateTokenStatus: function(isValid, message) {
            var statusEl = document.getElementById('tokenStatus');
            var statusIndicator = statusEl.querySelector('.status-indicator');
            var statusText = document.getElementById('tokenStatusText');

            this.tokenValidated = isValid;

            statusEl.style.display = 'inline';
            statusIndicator.className = 'status-indicator ' +
              (isValid ? 'status-valid' : 'status-invalid');
            statusText.textContent = message || (isValid ? 'Valid' : 'Invalid');

            // Update save button state
            document.getElementById('saveButton').disabled = !isValid;
          },

          clearTokenStatus: function() {
            var statusEl = document.getElementById('tokenStatus');
            var statusIndicator = statusEl.querySelector('.status-indicator');
            var statusText = document.getElementById('tokenStatusText');

            this.tokenValidated = false;
            statusIndicator.className = 'status-indicator status-unknown';
            statusText.textContent = 'Not validated';
            document.getElementById('saveButton').disabled = false;
          }
        };

        // VALIDATION SERVICE
        var ValidationService = {
          errors: {},

          validateField: function(fieldId, value) {
            var errorEl = document.getElementById(fieldId + 'Error');
            var inputEl = document.getElementById(fieldId);

            // Clear previous error
            errorEl.style.display = 'none';
            inputEl.classList.remove('error');
            delete this.errors[fieldId];

            // Required validation
            if (!value || value.trim() === '') {
              this.setError(fieldId, 'This field is required');
              return false;
            }

            // Field-specific validation
            switch(fieldId) {
              case 'github_token':
                if (!this.isValidTokenFormat(value)) {
                  this.setError(fieldId, 'Token should start with ghp_, gho_, ghu_, or ghs_');
                  return false;
                }
                if (value.length < 20) {
                  this.setError(fieldId, 'Token appears too short');
                  return false;
                }
                break;

              case 'api_url':
                if (!this.isValidUrl(value)) {
                  this.setError(fieldId, 'Please enter a valid URL starting with http:// or https://');
                  return false;
                }
                break;

              case 'github_user':
                if (!this.isValidUsername(value)) {
                  this.setError(fieldId, 'Username can only contain letters, numbers, and hyphens');
                  return false;
                }
                break;
            }

            return true;
          },

          isValidTokenFormat: function(token) {
            // GitHub tokens typically start with specific prefixes
            var prefixes = ['ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_'];
            return prefixes.some(function(prefix) {
              return token.indexOf(prefix) === 0;
            });
          },

          isValidUrl: function(url) {
            try {
              new URL(url);
              return url.startsWith('http://') || url.startsWith('https://');
            } catch (e) {
              return false;
            }
          },

          isValidUsername: function(username) {
            // GitHub usernames are alphanumeric with hyphens
            return /^[a-zA-Z0-9\-]+$/.test(username);
          },

          setError: function(fieldId, message) {
            var errorEl = document.getElementById(fieldId + 'Error');
            var inputEl = document.getElementById(fieldId);

            errorEl.textContent = message;
            errorEl.style.display = 'block';
            inputEl.classList.add('error');
            this.errors[fieldId] = message;
          },

          validateAll: function() {
            var fields = ['github_token', 'github_user', 'api_url'];
            var isValid = true;

            fields.forEach(function(fieldId) {
              var value = document.getElementById(fieldId).value;
              if (!ValidationService.validateField(fieldId, value)) {
                isValid = false;
              }
            });

            return isValid;
          },

          getErrors: function() {
            return this.errors;
          }
        };

        // ASYNC METHOD WRAPPER
        var AsyncMethod = {
          call: function(methodName, params) {
            return {
              then: function(successCallback, errorCallback) {
                var inn = top.aras.getInnovator();

                inn.applyMethod(methodName, params, function(result) {
                  if (result.isError()) {
                    if (errorCallback) {
                      errorCallback(result.getErrorString());
                    } else {
                      FormState.showMessage('error', 'Error: ' + result.getErrorString());
                    }
                  } else {
                    if (successCallback) {
                      successCallback(result.getResult());
                    }
                  }
                });
              }
            };
          }
        };

        // EVENT HANDLERS
        var EventHandlers = {
          onTestConnection: function() {
            if (!ValidationService.validateAll()) {
              FormState.showMessage('error', 'Please fix validation errors before testing');
              return;
            }

            var token = document.getElementById('github_token').value;
            var apiUrl = document.getElementById('api_url').value || 'https://api.github.com';

            FormState.setLoading(true);

            AsyncMethod.call('validateGitHubToken',
              '<token>' + token + '</token><api_url>' + apiUrl + '</api_url>'
            ).then(
              function(result) {
                FormState.setLoading(false);
                FormState.updateTokenStatus(true, 'Valid: ' + result);
                FormState.showMessage('success', 'Connection test successful! ' + result);
              },
              function(error) {
                FormState.setLoading(false);
                FormState.updateTokenStatus(false, 'Invalid token');
                FormState.showMessage('error', 'Connection test failed: ' + error);
              }
            );
          },

          onSaveConfiguration: function() {
            if (!ValidationService.validateAll()) {
              FormState.showMessage('error', 'Please fix validation errors before saving');
              return;
            }

            // In ARAS forms, saving is handled automatically by the form
            // This button triggers the default save behavior
            top.aras.uiSaveItem(document.thisItem);

            FormState.showMessage('success', 'Configuration saved successfully', true);
          },

          onLoadRepositories: function() {
            if (!FormState.tokenValidated) {
              FormState.showMessage('error', 'Please test and validate your token first');
              return;
            }

            FormState.setLoading(true);

            AsyncMethod.call('getGitHubRepositories', '').then(
              function(result) {
                FormState.setLoading(false);
                FormState.showMessage('success', 'Repository sync initiated: ' + result);

                // Optionally navigate to repositories list
                setTimeout(function() {
                  top.aras.uiShowItemType('GH_Repository');
                }, 2000);
              },
              function(error) {
                FormState.setLoading(false);
                FormState.showMessage('error', 'Failed to load repositories: ' + error);
              }
            );
          },

          onTokenVisibilityToggle: function() {
            var tokenInput = document.getElementById('github_token');
            var showCheckbox = document.getElementById('showToken');

            tokenInput.type = showCheckbox.checked ? 'text' : 'password';

            // Clear validation status when token is shown/hidden
            FormState.clearTokenStatus();
          },

          onFieldChange: function(fieldId) {
            var value = document.getElementById(fieldId).value;
            ValidationService.validateField(fieldId, value);

            // Clear token status when token field changes
            if (fieldId === 'github_token') {
              FormState.clearTokenStatus();
            }
          }
        };

        // INITIALIZATION
        function initForm() {
          // Setup token visibility toggle
          document.getElementById('showToken').addEventListener('change',
            EventHandlers.onTokenVisibilityToggle);

          // Setup field validation on change
          var fields = ['github_token', 'github_user', 'api_url'];
          fields.forEach(function(fieldId) {
            var field = document.getElementById(fieldId);
            field.addEventListener('input', function() {
              EventHandlers.onFieldChange(fieldId);
            });
            field.addEventListener('blur', function() {
              EventHandlers.onFieldChange(fieldId);
            });
          });

          // Setup button event listeners
          document.getElementById('testButton').addEventListener('click',
            EventHandlers.onTestConnection);

          document.getElementById('saveButton').addEventListener('click',
            EventHandlers.onSaveConfiguration);

          document.getElementById('loadReposButton').addEventListener('click',
            EventHandlers.onLoadRepositories);

          // Initialize field values from ARAS
          setTimeout(function() {
            // Trigger validation on existing values
            fields.forEach(function(fieldId) {
              var value = document.getElementById(fieldId).value;
              if (value) {
                ValidationService.validateField(fieldId, value);
              }
            });
          }, 100);

          // Setup form submit handling
          var form = document.querySelector('form');
          if (form) {
            form.addEventListener('submit', function(e) {
              if (!ValidationService.validateAll()) {
                e.preventDefault();
                FormState.showMessage('error', 'Please fix validation errors before saving');
              }
            });
          }
        }

        // Start initialization
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initForm);
        } else {
          initForm();
        }
      </script>
    </body>
   </form>]]>
    </body>
  </Item>
</AML>`;

var result = inn.applyAML(aml);
result;
