/**
 * Stringify properties object or entries to .properties file content.
 * @param {Array | Object} input Properties object or entries.
 * @param {Object} [options] Stringify options.
 * @returns {string} .properties file content.
 */
export function stringify(input, options) {
  if (input instanceof Array) {
    return stringifyFromEntries(input, options);
  }

  return stringifyFromProperties(input, options);
}

/**
 * Stringify entries to .properties file content.
 * @param {Array} entries Property entries.
 * @param {Object} [options] Stringify options, used when specified fields are
 *     not available in each entry.
 * @returns {string} .properties file content.
 */
export function stringifyFromEntries(entries, options) {
  options = parseOptions(options);

  let output = '';
  for (let entry of entries) {
    let sep = entry.sep || options.sep;
    let eol = 'eol' in entry
      ? entry.eol || ''   // Use empty string in case eol is null.
      : options.eol;

    // Prefer original if available
    if (entry.original != null) {
      output += entry.original;
    } else {
      // Output a blank line for blank and comment entry
      output += entry.key == null || entry.element == null
        ? '' : entry.key + sep + entry.element;
    }

    output += eol;
  }

  return output;
}

/**
 * Stringify properties object to .properties file content.
 * @param {Object} properties Properties object.
 * @param {Object} [options] Stringify options.
 * @returns {string} .properties file content.
 */
export function stringifyFromProperties(properties, options) {
  options = parseOptions(options);

  let output = '';
  for (let key in properties) {
    output += escapeKey(key) +
        options.sep +
        escapeElement(properties[key]) +
        options.eol;
  }

  return output;
}

/**
 * Normalize user provided options.
 * @param {*} options Original options.
 * @returns {Object} Normalized options.
 */
function parseOptions(options) {
  options = options || {};
  options.sep = options.sep || ' = ';
  options.eol = options.eol || '\r\n';
  return options;
}

/**
 * Escape special characters in property key.
 * @param {string} key Key to be mutated.
 * @returns {string} Escaped key.
 */
function escapeKey(key) {
  return key.replace(/[\s\S]/g, (match) => {
    switch (match) {
      case '=': return '\\=';
      case ':': return '\\:';
      case ' ': return '\\ ';
      default: return escapeElement(match);
    }
  });
}

/**
 * Escape special characters in property element.
 * @param {string} element Element to be mutated.
 * @returns {string} Escaped element.
 */
function escapeElement(element) {
  return element.replace(/[\s\S]/g, (match) => {
    switch (match) {
      case '\\': return '\\\\';
      case '\f': return '\\f';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\t': return '\\t';
      default: return match;
    }
  });
}
