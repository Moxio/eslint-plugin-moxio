/* global require */

"use strict";

const rule = require("../../../lib/rules/restrict-css-class-usage-to-files");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaVersion: 6,
            ecmaFeatures: {
                jsx: true,
            },
        },
	}
});

const default_options = [{
	"cssClasses": {
		"restricted-css-class": [
			"whitelisted_file\\.js$",
			"whitelisted_file\\.tsx$"
		]
	}
}];

const default_errors = [{ message: "The class restricted-css-class has been restricted to ['whitelisted_file\\.js$', 'whitelisted_file\\.tsx$']" }];

ruleTester.run("restrict-css-class-usage-to-files", rule, {
	valid: [
		{
			code: 'const properties = { "class": "restricted-css-class" }',
			filename: 'whitelisted_file.js',
			options: default_options

		},
		{
			code: 'const properties = { "class": "restricted-css-class" }',
			filename: 'whitelisted_file.tsx',
			options: default_options
		},
		{
			code: 'const properties = { "class": "restricted-css-class" }',
			filename: 'file.js',
			options: [{
				"cssClasses": {
					"restricted-css-class": [
						"(.*)\\.js$",
					]
				}
			}]
		},
        {
            code: 'const properties = { "restricted-css-class": <div /> }',
            filename: 'file.tsx',
            errors: default_errors,
            options: default_options
        },
		//Test to see if windows file paths are normalized
		{
			code: 'const properties = { "class": "restricted-css-class" }',
			filename: 'windows\\path\\to\\file.js',
			options: [{
				"cssClasses": {
					"restricted-css-class": [
						"windows/path/to/(.*)\\.js$",
					]
				}
			}]
		},
		{
			code: 'const properties = { "restricted-css-class": true }',
			filename: 'whitelisted_file.js',
			options: default_options

		},
		{
			code: 'const properties = { "restricted-css-class": true }',
			filename: 'whitelisted_file.tsx',
			options: default_options
		},
		{
			code: 'const properties = [ "restricted-css-class" ]',
			filename: 'whitelisted_file.js',
			options: default_options

		},
		{
			code: 'const properties = [ "restricted-css-class" ]',
			filename: 'whitelisted_file.tsx',
			options: default_options
		},
		{
			code: 'const properties = []; properties.push("restricted-css-class");',
			filename: 'whitelisted_file.js',
			options: default_options

		},
		{
			code: 'const properties = []; properties.push("restricted-css-class");',
			filename: 'whitelisted_file.tsx',
			options: default_options
		},
        {
            code: 'const properties = []; properties.push(`restricted-css-class`);',
            filename: 'whitelisted_file.tsx',
            options: default_options
        },
        {
            code: 'const properties = []; properties.push(`restricted-css-class`);',
            filename: 'whitelisted_file.js',
            options: default_options
        },
		{
			code: '<div className="restricted-css-class" />',
			filename: 'whitelisted_file.tsx',
			options: default_options
		},
        {
            code: '<div className={`restricted-css-class`} />',
            filename: 'whitelisted_file.tsx',
            options: default_options
        }
    ],
	invalid: [
		{
			code: 'const properties = { "class": "restricted-css-class" }',
			filename: 'file.js',
			errors: default_errors,
			options: default_options
		},
		{
			code: 'const properties = { "class": "restricted-css-class" }',
			filename: 'file.tsx',
			errors: default_errors,
			options: default_options
		},
		{
			code: 'const properties = { "restricted-css-class": true }',
			filename: 'file.js',
			errors: default_errors,
			options: default_options
		},
		{
			code: 'const properties = { "restricted-css-class": true }',
			filename: 'file.tsx',
			errors: default_errors,
			options: default_options
		},
		{
			code: 'const properties = [ "restricted-css-class" ]',
			filename: 'file.js',
			errors: default_errors,
			options: default_options
		},
        {
            code: 'const properties = [ `restricted-css-class` ]',
            filename: 'file.js',
            errors: default_errors,
            options: default_options
        },
        {
            code: 'const properties = [ `restricted-css-class` ]',
            filename: 'file.tsx',
            errors: default_errors,
            options: default_options
        },
        {
			code: 'const properties = [ "restricted-css-class" ]',
			filename: 'file.tsx',
			errors: default_errors,
			options: default_options
		},
		{
			code: 'const properties = []; properties.push("restricted-css-class");',
			filename: 'file.js',
			errors: default_errors,
			options: default_options
		},
		{
			code: 'const properties = []; properties.push("restricted-css-class");',
			filename: 'file.tsx',
			errors: default_errors,
			options: default_options
		},
        {
            code: 'const properties = []; properties.push(`restricted-css-class`);',
            filename: 'file.tsx',
            errors: default_errors,
            options: default_options
        },
        {
            code: 'const properties = []; properties.push(`restricted-css-class`);',
            filename: 'file.js',
            errors: default_errors,
            options: default_options
        },
        {
			code: '<div className="restricted-css-class" />',
			filename: 'file.tsx',
			errors: default_errors,
			options: default_options
		},
        {
            code: '<div className={`restricted-css-class`} />',
            filename: 'file.tsx',
            errors: default_errors,
            options: default_options
        },
        {
            code: '<div className={`restricted-css-class`} />',
            filename: 'file.js',
            errors: default_errors,
            options: default_options
        },
    ],
});
