@js.properties/parser
=====================

JavaScript .properties parser
-----------------------------

This is a parser written in JavaScript and [PEG.js](https://pegjs.org/) for Java .properties file format, following the syntax defined in [Java API Specification](https://docs.oracle.com/javase/9/docs/api/java/util/Properties.html#load-java.io.Reader-).

The parser returns raw parsing result as an array of tuple in the form `[key, element, original, location][]`.

* Each *logical line* of input .propertis file is parsed into a tuple, with the **original** logical line and/or line **location** info optionally kept;
* Properties with duplicate keys are kept in the raw output so that one can build high-level applications reporting them;
* Blank and comment lines can be kept as well so that there is no info loss of the original file after parsing. This could be useful for something like .properties IDE.


## Installation

```sh
npm install --save @js.properties/parser
# or
yarn add @js.properties/parser
```


## Quick Example

`example.properties`:

```ini
# Comment here
hello = world

foo : bar
```

`demo.js` (Node.js):

```js
const fs = require('fs');
const PropertiesParser = require('@js.properties/parser');

const input = fs.readFileSync('example.properties', 'utf8');
const options = {   // options is optional
  all: true,        // Include empty and blank lines
  original: true,   // Include original logical line in output
  location: true,   // Include location info in output
};
let output = PropertiesParser.parse(input, options);
```

`demo.html` (Browser):

```html
<!-- @js.properties/parser is available as an UMD module. -->
<script src="properties-parser.min.js"></script>
<script>
// Input can be entered manually or read via FileReader API
var output = PropertiesParser.parse('...');
</script>
```

Output with all options off:

```json
[
  { "key": "hello", "element": "world" },
  { "key": "foo", "element": "bar" }
]
```

Output with all options on:

```json
[
  {
    "key": null, "element": null, "original": "# Comment here",
    "location": {
      "start": { "offset":  0, "line": 1, "column":  1 },
      "end":   { "offset": 14, "line": 1, "column": 15 } }
  },
  {
    "key": "hello", "element": "world", "original": "hello = world",
    "location": {
      "start": { "offset": 15, "line": 2, "column":  1 },
      "end":   { "offset": 28, "line": 2, "column": 14 } }
  },
  {
    "key": null, "element": null, "original": "",
    "location": {
      "start": { "offset": 29, "line": 3, "column":  1 },
      "end":   { "offset": 29, "line": 3, "column":  1 } }
  },
  {
    "key": "foo", "element": "bar", "original": "foo : bar",
    "location": {
      "start": { "offset": 30, "line": 4, "column":  1 },
      "end":   { "offset": 39, "line": 4, "column": 10 } }
  }
]
```


## API

### Method: parse(string [, options ])

**Returns:** `Array<PropertyEntry>`

### Object: PropertyEntry

Property   | Type         | Description
---------- | ------------ | ----
`key`      | string\|null | Property Key
`element`  | string\|null | Property Element (value)
`original` | string       | (optional) The original *logical line* [\*] containing the property
`location` | Location     | (optional) The start and end position of the *logical line* [\*]

Note: `key` and `element` will be `null` for blank and comment lines.

Note: `original` is always a `string`, in the case of blank line, it's an empty string.

[\*] A *logical line* may spread across several *natural lines* if line continuation is involved.

### Object: options

Option     | Type    | Description
---------- | ------- | ----
`all`      | boolean | Include empty and blank lines
`original` | boolean | Include original logical line in output
`location` | boolean | Include location info in output

All options default to `false`.

### Object: Location

`{ start: Position, end: Position }`

### Object: Position

`{ offset: number, line: number, column: number }`

---

## Development

### Code Structure

```
@js.properties/parser
├── src            // Originally authored source code.
│   └── *.pegjs.js //   This one is an exception, generated by pegjs.
├── lib            // Generated by babel, spread in multiple files,
│                  //   in CommonJS format, for Node.js use.
├── dist           // Generated by webpack into a single file,
│                  //   in UMD format, for browser and Node.js.
└── test
    ├── data       // Test data, *.properties are authored
    │              //   and *.json are generated and compared
    ├── java       // Reference implementation in Java
    └── js         // Test code in JavaScript

```

### Build

```sh
yarn run prepare
# or
npm run prepare
```

### Test

```sh
yarn test
# or
npm test
```
