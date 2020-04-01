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
