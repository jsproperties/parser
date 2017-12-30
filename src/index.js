// Import PEG.js generated parser through pegjs-loader
import * as PropertiesParser from './properties.pegjs';

// Reexport everything PEG.js generated parser exports
export * from './properties.pegjs';


const parseToArrayOptions = [
  'all',        // Include empty and blank lines
  'original',   // Include original logical line in output
  'eol',        // Include eol (end of line) in output
  'location',   // Include location info in output
];

const parseToPropertiesOptions = [
  'namespace',  // Parse dot separated keys as namespaced
];


/**
 * Parse .properties file content to an array of object containing key, element,
 * and optionally original line and location.
 */
export function parseToArray(input, options) {
  options = parseOptions(options, parseToArrayOptions);
  return PropertiesParser.parse(input, options);
}
PropertiesParser.parseToArray = parseToArray;

/**
 * Parse .properties file content to a properties object, with property key as
 * the key and property element as the value.
 */
export function parseToProperties(input, options) {
  let parsedArray = parseToArray(input);
  return arrayToProperties(parsedArray, options);
}
PropertiesParser.parseToProperties = parseToProperties;

export function arrayToProperties(array, options) {
  options = parseOptions(options, parseToPropertiesOptions);
  let properties = {};

  for (let entry of array) {
    // Only key and element are relevant
    let { key, element } = entry;

    // Blank and comment lines are ignored
    if (key === null) continue;

    // Parsed array adheres to what user authored,
    // while in properties, we need to unescape backslashes.
    key = unescapeBackslashes(key);
    element = unescapeBackslashes(element);

    // Assign to properties by key, later entries overwrite previous ones
    if (options.namespace) {
      let namespacedKey = parseNamespace(key);
      let property = properties;
      namespacedKey.forEach((name, i) => {
        // This is the last component of the key
        if (i === namespacedKey.length - 1) {
          property[name] = element;
          return;
        }

        // This is part of the namespace
        if (name in property) {
          // Namespace itself and keys under it may all have values
          // e.g. "foo = bar" "foo.qux = quux"
          if (typeof property[name] === 'string') {
            // Make value of namespace a value of an empty key under the
            // namespace
            property[name] = { '': property[name] };
          }
        } else {
          property[name] = {};
        }
        property = property[name];
      });
    } else {
      properties[key] = element;
    }
  }

  return properties;
}
PropertiesParser.arrayToProperties = arrayToProperties;


function parseOptions(options, availableOptionNames) {
  // Fix `null`, `false` as the options
  options = options || {};

  // `true` is a shortcut to turn all options on
  if (options === true) {
    options = {};
    for (let option of availableOptionNames) {
      options[option] = true;
    }
    return options;
  }

  // { '': true } is also a shorcut to turn all options on, while allow
  // individual options to be turned off by setting them explicitly.
  if (typeof options[''] === 'boolean') {
    for (let option of availableOptionNames) {
      if (!(option in options)) {
        options[option] = options[''];
      }
    }
  }

  return options;
}

function unescapeBackslashes(input) {
  return input.replace(/\\\\/g, '\\');
}

function parseNamespace(key) {
  return key.split('.');
}


// Export everything this module exports as a default export
export default PropertiesParser;
