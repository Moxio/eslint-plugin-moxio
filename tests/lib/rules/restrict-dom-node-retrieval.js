/* global require */

"use strict";

const rule = require("../../../lib/rules/restrict-dom-node-retrieval");
const RuleTester = require("eslint").RuleTester;

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

const ERROR_MSG = "Don't retrieve dom nodes directly, use react-refs to read/manipulate the dom";

ruleTester.run("restrict-dom-node-retrieval", rule, {
    valid: [
        {
            code: `const MyComponent = () => {
                return <div>valid</div>
            }`,
        },
        {
            code: `function MyComponent() {
                return <div>valid</div>
            }`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = document.querySelector(".class");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = window.document.querySelector(".class");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = document.querySelectorAll(".class");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = window.document.querySelectorAll(".class");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = document.getElementsByTagName("div");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = window.document.getElementsByTagName("div");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "div");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = window.document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "div");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = document.getElementsByClassName("class");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = window.document.getElementsByClassName("class");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = document.getElementById("id");
             });`,
        },
        {
            code: `it("should be allowed in a test", () => {
              const element = window.document.getElementById("id");
             });`,
        },
    ],
    invalid: [
        {
            code: `element = document.querySelector(".class")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = window.document.querySelector(".class")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = document.querySelectorAll(".class")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = window.document.querySelectorAll(".class")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = document.getElementsByTagName("div")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = window.document.getElementsByTagName("div")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "div")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = window.document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "div")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = document.getElementsByClassName("class")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = window.document.getElementsByClassName("class")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = document.getElementById("id")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
        {
            code: `element = window.document.getElementById("id")`,
            errors: [ { message: ERROR_MSG, type: "Identifier" } ],
        },
    ],
});
