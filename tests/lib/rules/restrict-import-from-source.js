/* global require */

"use strict";

const rule = require("../../../lib/rules/restrict-import-from-source");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaVersion: 6,
            ecmaFeatures: {
                jsx: true,
            },
            sourceType: "module",
        },
    }
});

const default_options = [{
    "sources": {
        "restrictedSource": {
            "identifiers": [
                "restrictedIdentifier"
            ]
        }
    }
}];

const default_errors = [{ message: "restrictedIdentifier on restrictedSource has been restricted" }];

ruleTester.run("restrict-import-from-source", rule, {
    valid: [
        {
            code: 'import { unrestrictedIdentifier } from "restrictedSource";',
            options: default_options
        },
        {
            code: 'import { restrictedIdentifier } from "unrestrictedSource";',
            options: default_options
        },
    ],
    invalid: [
        {
            code: 'import { restrictedIdentifier } from "restrictedSource";',
            errors: default_errors,
            options: default_options
        },
        {
            code: 'import { restrictedIdentifier as something } from "restrictedSource";',
            errors: default_errors,
            options: default_options
        },
        {
            code: 'import { restrictedIdentifier, unrestrictedIdentifier } from "restrictedSource";',
            errors: default_errors,
            options: default_options
        },
        {
            code: 'import { restrictedIdentifier, unrestrictedIdentifier } from "restrictedSource";',
            errors: [{ message: "test restrictedIdentifier test restrictedSource..." }],
            options: [{
                "sources": {
                    "restrictedSource": {
                        "identifiers": [
                            "restrictedIdentifier"
                        ],
                        "message": "test {{ identifier }} test {{ source }}..."
                    }
                }
            }]
        },
    ],
});
