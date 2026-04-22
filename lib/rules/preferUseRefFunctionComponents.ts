import { RuleDefinition } from "@eslint/core";
import { TSESTree } from "@typescript-eslint/types";

/**
 * @fileoverview Rule that reports errors if React.createRef is used inside function components
 *
 */

export const preferUseRefFunctionComponents: RuleDefinition = {
	meta: {
		type: "problem",
		docs: {
			description: "In function components, the useRef hook should be used instead of createRef",
			recommended: true,
		},
		schema: [],
	},
	create: function (context) {
		return {
			Identifier: function (node: TSESTree.Identifier) {
				const nodeType = node.name;
				if (nodeType !== "createRef") {
					return;
				}
				const isTestCase = findParent(node, (parent) => {
					return (
						parent.type === "CallExpression" && parent.callee.type === "Identifier" && parent.callee.name === "it"
					);
				});

				if (isTestCase) {
					return;
				}

				const isFunction = findParent(
					node,
					(parent) =>
						parent.type === "ArrowFunctionExpression" ||
						parent.type === "FunctionDeclaration",
				);
				if (isFunction) {
					context.report({
						node: node,
						message: "Prefer useRef hook in Function components.",
					});
				}
			},
		};
	},
}

function findParent(node: TSESTree.Node, testFn: (node: TSESTree.Node) => boolean) {
	if (testFn(node)) {
		return node;
	} else if (node.parent) {
		return findParent(node.parent, testFn);
	}
	return null;
}
