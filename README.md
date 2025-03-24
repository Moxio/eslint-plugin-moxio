![CI](https://github.com/Moxio/eslint-plugin-moxio/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-moxio.svg)](https://www.npmjs.com/package/eslint-plugin-moxio)

eslint-plugin-moxio
===================
Custom rules for ESLint, as used at Moxio.

Installation
------------
This library can be installed from the NPM package registry. You'll first need to install
[ESLint](http://eslint.org):
```sh
npm install --save-dev eslint
```
Next, install `eslint-plugin-moxio`:
```
npm install --save-dev eslint-plugin-moxio
```
You can also use Yarn; replace `npm install --save-dev` by `yarn add --dev` in that case.

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install
`eslint-plugin-moxio` globally.

Usage
-----
This plugin is meant to be used with [ESLint](http://eslint.org). Add `moxio` to the plugins
section of your `.eslintrc` [configuration file](https://eslint.org/docs/user-guide/configuring).
You can omit the `eslint-plugin-` prefix:
```json
{
    "plugins": [
        "moxio"
    ]
}
```

Then configure the rules you want to use under the `rules`-key. See the next section for available
rules and their options.
```json
{
    "rules": {
        "moxio/rule1": "error",
        "moxio/rule2": [ "warning", {
            "configProp": "value"
        } ]
    }
}
```

Provided rules
--------------

### restrict-css-class-usage-to-files
Rule that restricts certain CSS classes so that they may only be referenced from a given set
of allowed files. This includes:

* Usage of CSS class in className prop in React Component: `<div className={"$"} />`
* Declaration of CSS class in array: `const x = [ $ ];`
* Pushing of CSS class to array: `css_classes.push($);`
* Usage of CSS class as key in an object: `const obj = {$: true};`
* Usage of CSS class in an object property: `const obj = { "class": $ };`

These rules are also applied to template strings.

#### Configuration
The `cssClasses` configuration property is an object with the restricted CSS classes as keys, and
an array of file path patterns (regular expressions) in which that CSS class may be used as the
values. Windows file paths will automatically be normalized to use `/` directory separators before
matching them against the patterns, so those can be configured using only `/` as a directory separator.

As an example, the following rule enforces that the `foo` CSS class may only be used in any javascript
file, or in the `dir/Foo.tsx` file.
```json
{
    "rules": {
        "moxio/restrict-css-class-usage-to-files": [
            "error",
            {
                "cssClasses": {
                    "foo": [
                        "/(.*)\\.js$",
                        "/dir/Foo\\.tsx$"
                    ]
                }
            }
        ]
    }
}
```

#### Motivation
This plugin is mainly useful to enforce the use of standardized components in a [design system](https://en.wikipedia.org/wiki/Design_system).
For example, if you have a button in your design system with CSS class `acme-button` and a standardized
implementation of that button as a React or Vue component, you probably don't want people to make their
own custom implementations of `acme-button`. For such cases you could limit usage of the `acme-button`
CSS class to only e.g. `/components/Button.tsx` or `/components/Button.vue`. Of course, this only
works if your CSS classes are specific enough.


### prefer-useref-function-components
Rule that warns if React.createRef() is used in a function component, instead of the preferred useRef hook.


#### Configuration

```json
{
    "rules": {
        "moxio/prefer-useref-function-components": "warn",
    }
}
```

#### Motivation
This plugin is mainly useful when switching from class components to function components.

### restrict-import-from-source
Rule that can restrict importing certain identifiers from a source.
For example, you could warn if somebody tries to import `Difference` from the `js-struct-compare` package.

#### Configuration
```json
{
	"rules": {
		"moxio/restrict-import-from-source": [
			"warn",
			{
				"sources": {
					"js-struct-compare": {
						"identifiers": [
                            "Difference"
					    ],
                        "message": "{{ identifier }} on {{ source }} has been restricted"
                    }
				}
			}
		]
	}
}
```

#### Motivation
We use this plugin ourselves when we use a library but want to prevent certain imports from it that have unexpected side effects.

### restrict-dome-node-retrieval
Rule that restricts using dom-retrieval methods ("querySelector", "querySelectorAll", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById") from document.

#### Configuration
```json
{
	"rules": {
		"moxio/restrict-dome-node-retrieval": "warn"
	}
}
```

#### Motivation
We use this rule ourselves to prevent direct dom manipulation in our React projects: https://react.dev/learn/manipulating-the-dom-with-refs

Versioning
----------
This project adheres to [Semantic Versioning](http://semver.org/).

Contributing
------------
Contributions to this project are more than welcome.

License
-------
This project is released under the MIT license.

---
Made with love, coffee and fun by the [Moxio](https://www.moxio.com) team from
Delft, The Netherlands. Interested in joining our awesome team? Check out our
[vacancies](https://werkenbij.moxio.com/) (in Dutch).
