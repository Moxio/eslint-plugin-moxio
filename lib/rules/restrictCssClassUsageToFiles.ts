import {
	RuleContext,
	RuleDefinition,
	RuleDefinitionTypeOptions,
} from "@eslint/core";
import {
	AST_NODE_TYPES,
	TSESTree,
} from "@typescript-eslint/types";


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

export const restrictCssClassUsageToFiles: RuleDefinition = {
	meta: {
		type: "problem",
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					cssClasses: {
						description: "A list of css classes to check for",
						type: "object",
						properties: {},
						additionalProperties: {
							type: "array",
							items: {
								description: "A string that can be used to create a new Regexp() that validates which files the css class is allowed to occur in",
								type: "string",
							},
							minItems: 1,
							uniqueItems: true
						}
					},
				},
				additionalProperties: false,
			},
		],
	},
	create: function (context: RuleContext<{
		LangOptions: RuleDefinitionTypeOptions["LangOptions"];
		Code: RuleDefinitionTypeOptions["Code"];
		RuleOptions: {
			cssClasses: Record<string, string[]>;
		}[];
		Node: RuleDefinitionTypeOptions["Node"];
		MessageIds: RuleDefinitionTypeOptions["MessageIds"];
	}>) {

		const css_classes = context.options[0]["cssClasses"];

		function checkCssClassAttribute(class_attribute_value: string, node: TSESTree.Node) {
			let classes = class_attribute_value.toString().split(/\s+/);
			Object.getOwnPropertyNames(css_classes).forEach(function (className) {
				if (classes.includes(className.toString())) {
					let found = false;
					let filename = context.filename;
					filename = filename.replace(/\\/g, "/"); //Normalize Windows file paths
					css_classes[className].map(function (path_regex) {
						if (filename.match(new RegExp(path_regex))) {
							found = true;
						}
					});

					if (found === false) {
						context.report({
							node: node,
							message: "The class {{ className }} has been restricted to ['" + css_classes[className].join("', '") + "']",
							data: {
								className: className,
							},
						});
					}
				}
			});
		}

		const handleElement = (node: TSESTree.Node) => {
			if (node.type === AST_NODE_TYPES.JSXExpressionContainer) {
				handleElement(node.expression);
			} else if (node.type === AST_NODE_TYPES.CallExpression) {
				node.arguments.map(handleElement);
			} else if (node.type === AST_NODE_TYPES.TemplateLiteral) {
				const value = node.quasis[0].value.raw;
				if (value) {
					checkCssClassAttribute(value, node);
				}
			} else if (node.type === AST_NODE_TYPES.Literal) {
				if (typeof node.value === "string") {
					checkCssClassAttribute(node.value, node);
				}
			}
		}

		return {
			//if class is declared in array ex: const css_classes = [ $ ];
			ArrayExpression: (node: TSESTree.ArrayExpression) => {
				node.elements.map((element) => {
					if (element) {
						handleElement(element);
					}
				});
			},
			//if class is added in css_classes.push($); type call
			ExpressionStatement: function (node: TSESTree.ExpressionStatement) {
				handleElement(node.expression);
			},
			//react/tsx syntax
			JSXAttribute: function (node: TSESTree.JSXAttribute) {
				if (node.name.name === "className" && node.value) {
					handleElement(node.value);
				}
			},
			ObjectExpression: function (node: TSESTree.ObjectExpression) {
				node.properties.map(function (property) {
					//CSS class definition inside an object as key ex: {$: true};
					if (property.type === AST_NODE_TYPES.Property) {
						if (property.key.type === AST_NODE_TYPES.Literal) {
							if (property.value.type === AST_NODE_TYPES.JSXElement) {
								//Skip assignment {$: JSXElement}, not triggering a css class.
							} else if (typeof property.key.value === "string") {
								checkCssClassAttribute(property.key.value, property);
							}
						}

						//CSS class used inside the value of an object key ex: {"key": $};
						if (property.value.type === AST_NODE_TYPES.Literal && typeof property.value.value === "string") {
							checkCssClassAttribute(property.value.value, property.value);
						}
					}
				});
			},
		};
	},
};
