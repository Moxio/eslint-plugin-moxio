/*global module*/
/**
 * @fileoverview Rule that reports errors for files that use configured css classes and are not whitelisted.
 *
 * Current detection will search for:
 * - Usage of css class in className prop in React Component: <div className={"$"} />
 * - Declaration of css class in array: const x = [ $ ];
 * - Pushing of css class to array: css_classes.push($);
 * - Usage of css class as key in an object: const obj = {$: true};
 * - Usage of css class in an object property: const obj = { "class": $ };
 */

module.exports = {
	"meta": {
		"type": "problem",
		"fixable": "code",
		"schema": [
			{
				"type": "object",
				"properties": {
					"cssClasses": {
						"description": "A list of css classes to check for",
						"type": "object",
						"properties": {},
						"additionalProperties": {
							"type": "array",
							"items": {
								"description": "A string that can be used to create a new Regexp() that validates which files the css class is allowed to occur in",
								"type": "string",
							},
							"minItems": 1,
							"uniqueItems": true
						}
					},
				},
				"additionalProperties": false,
			},
		],
	},
	"create": function (context) {
		"use strict";

		const css_classes = context.options[0]["cssClasses"];

		function checkCssClassAttribute(class_attribute_value, node) {
			let classes = class_attribute_value.toString().split(/\s+/);
			Object.getOwnPropertyNames(css_classes).forEach(function (className) {
				if (classes.includes(className.toString())) {
					let found = false;
					let filename = context.getFilename();
					filename = filename.replace(/\\/g, "/"); //Normalize windows file paths
					css_classes[className].map(function (path_regex) {
						if (filename.match(new RegExp(path_regex))) {
							found = true;
						}
					});

					if (found === false) {
						context.report({
							"node": node,
							"message": "The class {{ className }} has been restricted to ['" + css_classes[className].join("', '") + "']",
							"data": {
								"className": className,
							},
						});
					}
				}
			});
		}

		return {
			//if class is declared in array ex: const css_classes = [ $ ];
			"VariableDeclaration": function (node) {
				if (node.declarations) {
					node.declarations.map(function (declaration) {
						if (declaration.init && declaration.init.type === "ArrayExpression") {
							declaration.init.elements.map(function (element) {
                                if(element.type === 'TemplateLiteral') {
                                    const value = element.quasis[0].value.raw;
                                    if (value) {
                                        checkCssClassAttribute(value, node);
                                    }
                                } else {
                                    if (element.value) {
                                        checkCssClassAttribute(element.value, node);
                                    }
                                }
                            });
						}
					});
				}
			},
			//if class is added in css_classes.push($); type call
			"ExpressionStatement": function (node) {
				if (node.expression.arguments) {
					node.expression.arguments.map(function (argument) {
                        if(argument.type === 'TemplateLiteral') {
                            const value = argument.quasis[0].value.raw;
                            if (value) {
                                checkCssClassAttribute(value, node);
                            }
                        } else {
                            if (argument.value) {
                                checkCssClassAttribute(argument.value, node);
                            }
                        }
                    });
				}
			},
			//react/tsx syntax
			"JSXAttribute": function (node) {
				if (node.name.name === "className") {
                    // check if node is template string
                    if(node.value.type === 'JSXExpressionContainer') {
                        const quasis = node.value.expression.quasis;
                        if(quasis) {
                            const value = quasis[0].value.raw;
                            if(value) {
                                checkCssClassAttribute(value, node);
                            }
                        }
                    } else {
                        if (node.value.value) {
                            checkCssClassAttribute(node.value.value, node);
                        }
                    }
                }
			},
			"ObjectExpression": function (node) {
				node.properties.map(function (property) {
					//CSS class definition inside an object as key ex: {$: true};
					if (property.key && property.key.value) {
						checkCssClassAttribute(property.key.value, property);
					}

					//CSS class used inside the value of an object key ex: {"key": $};
					if (property.value && property.value.value) {
						checkCssClassAttribute(property.value.value, property.value);
					}
				});
			},
		};
	},
};
