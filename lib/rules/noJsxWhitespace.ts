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
 * @fileoverview Rule that disallows whitespace around certain components to ensure correct rendering
 *
 */

export const noJsxWhitespace: RuleDefinition = {
	meta: {
		type: "problem",
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					components: {
						description: "A list of components to check for",
						type: "array",
						items: {
							description: "The name of the component",
							type: "string",
						},
						uniqueItems: true
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
			components: string[];
		}[];
		Node: RuleDefinitionTypeOptions["Node"];
		MessageIds: RuleDefinitionTypeOptions["MessageIds"];
	}>) {

		const componentsNames = context.options[0]["components"];

		return {
			//react/tsx syntax
			JSXElement: function (node: TSESTree.JSXElement) {
				if (node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier) {
					const componentName = node.openingElement.name.name;
					if (componentsNames.includes(componentName)) {
						if (node.parent.type === AST_NODE_TYPES.JSXElement || node.parent.type === AST_NODE_TYPES.JSXFragment) {
							const index = node.parent.children.indexOf(node);
							const before = node.parent.children[index - 1];
							const after = node.parent.children[index + 1];
							if (before && before.type === AST_NODE_TYPES.JSXText) {
								const match = before.value.match(/[^\s]([ \t]+)$/);
								if (match) {
									const offset = match[1].length;
									context.report({
										node: before,
										loc: {
											start: { line: before.loc.end.line, column: before.loc.end.column - offset },
											end: before.loc.end,
										},
										message: `${componentName} can't have whitespace before it`,
									});
								}
							}
							if (after && after.type === AST_NODE_TYPES.JSXText && after.value) {
								const match = after.value.match(/^([ \t]+)[^\s]/);
								if (match) {
									const offset = match[1].length;
									context.report({
										node: before,
										loc: {
											start: after.loc.start,
											end: { line: after.loc.start.line, column: after.loc.start.column + offset },
										},
										message: `${componentName} can't have whitespace after it`,
									});
								}
							}
						}
					}
				}
			},
		};
	},
};
