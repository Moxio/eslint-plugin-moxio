# eslint-plugin-moxio

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-moxio`:

```
$ npm install eslint-plugin-moxio --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-moxio` globally.

## Usage

Add `moxio` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "moxio"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "moxio/rule-name": "error"
    }
}
```

## Supported Rules

### restrict-css-class-usage-to-files
Rule that reports errors for files that use configured css classes and are not whitelisted.
* Usage of css class in className prop in React Component: <div className={"$"} />
* Declaration of css class in array: const x = [ $ ];
* Pushing of css class to array: css_classes.push($);
* Usage of css class as key in an object: const obj = {$: true};
* Usage of css class in an object property: const obj = { "class": $ };

Example rule configuration, css foo can be used in any javascript file, but only in the foo tsx file.
```json
{
    "rules": {
        "moxio/restrict-css-class-usage-to-files": [
            "error",
            {
                "cssClasses": {
                    "foo": [
                        "/(.*)\\.js$",
                        "/Foo\\.tsx$"
                    ]
                }
            }
        ]
    }
}
```
Note: Will also normalize windows filepaths to forward slash



