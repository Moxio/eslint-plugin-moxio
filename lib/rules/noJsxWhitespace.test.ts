import { RuleTester } from "eslint";
import { noJsxWhitespace } from "./noJsxWhitespace";


const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaVersion: 6,
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

const ERROR_MSG = "Prefer useRef hook in Function components.";

ruleTester.run("no-jsx-whitespace", noJsxWhitespace, {
	valid: [
		{
			code: `<>
				<Subtext>text</Subtext>
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				<Subtext />
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				Some<Subtext>text</Subtext>and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				Some
				<Subtext>text</Subtext>and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				Some<Subtext>text</Subtext>
				and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<Subtext>text</Subtext>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `const jsx = <Subtext>text</Subtext>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				Some
				<Subtext>text</Subtext>
				and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				Some{' '}<Subtext>text</Subtext>
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
		{
			code: `<>
				Some <Highlight>text</Highlight> and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
		},
	],
	invalid: [
		{
			code: `<>
				Some <Subtext>text</Subtext> and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace before it",
				},
				{
					message: "Subtext can't have whitespace after it",
				},
			],
		},
		{
			code: `<>
				Some <Subtext>text</Subtext>and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace before it",
				},
			],
		},
		{
			code: `<>
				Some\t<Subtext>text</Subtext>and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace before it",
				},
			],
		},
		{
			code: `<>
				Some<Subtext>text</Subtext> and whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace after it",
				},
			],
		},
		{
			code: `<>
				Some<Subtext>text</Subtext>\tand whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace after it",
				},
			],
		},
		{
			code: `<>
				A lot of whitespace   <Subtext>text</Subtext>
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace before it",
					line: 2,
					column: 24,
					endLine: 2,
					endColumn: 27,
				},
			],
		},
		{
			code: `<>
				<div />A lot of whitespace   <Subtext>text</Subtext>
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace before it",
					line: 2,
					column: 31,
					endLine: 2,
					endColumn: 34,
				},
			],
		},
		{
			code: `<>
				Text split
				multiple lines
				followed by whitespace   <Subtext>text</Subtext>
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace before it",
					line: 4,
					column: 27,
					endLine: 4,
					endColumn: 30,
				},
			],
		},
		{
			code: `<>
				<Subtext>text</Subtext>   followed by
				a lot of whitespace
			</>`,
			options: [ { components: [ "Subtext" ] } ],
			errors: [
				{
					message: "Subtext can't have whitespace after it",
					line: 2,
					column: 28,
					endLine: 2,
					endColumn: 31,
				},
			],
		},
	],
});
