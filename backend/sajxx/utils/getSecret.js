const fs = require('fs');

/**
 * Helper to get a secret from a file (Docker Secret) or environment variable.
 * Docker secrets are typically mounted in /run/secrets/<secret_name>.
 *
 * @param {string} key - The name of the secret/environment variable.
 * @param {any} defaultValue - The default value if not found.
 * @returns {string} - The secret value.
 */
const getSecret = (key, defaultValue = undefined) => {
  // Check for Docker Secret
  const secretPath = `/run/secrets/${key}`;
  if (fs.existsSync(secretPath)) {
    try {
      // Trim to remove newlines that might be added by file editors
      return fs.readFileSync(secretPath, 'utf8').trim();
    } catch (err) {
      console.warn(`Could not read secret file for ${key}:`, err.message);
    }
  }

  // Fallback to environment variable
  return process.env[key] !== undefined ? process.env[key] : defaultValue;
};

module.exports = getSecret;
