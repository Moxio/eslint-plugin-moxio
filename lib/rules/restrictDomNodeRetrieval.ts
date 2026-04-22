import { RuleDefinition } from "@eslint/core";
import {
	AST_NODE_TYPES,
	TSESTree,
} from "@typescript-eslint/types";


/**
 * @fileoverview Rule that reports errors if dom-node retrieval methods ("querySelector", "querySelectorAll", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById") are called on document
 *
 */

const message = "Don't retrieve dom nodes directly, use react-refs to read/manipulate the dom"

export const restrictDomNodeRetrieval: RuleDefinition = {
    meta: {
        type: "problem",
        docs: {
            description: "Don't retrieve dom nodes directly, use react-refs to read/manipulate the dom",
            recommended: true,
        },
        schema: [],
    },
    create: function (context) {
        const restricted = [ "querySelector", "querySelectorAll", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById" ];

        return {
            MemberExpression: function (node: TSESTree.MemberExpression) {

	            const isTestCase = findParent(node, (parent) => {
		            return (
			            parent.type === "CallExpression" && (parent.callee.name === "it" || parent.callee.name === "describe")
		            );
	            });

	            if (!isTestCase) {
		            if(
						node.object &&
						node.object.type === AST_NODE_TYPES.Identifier &&
	                    node.object.name === "document" &&
	                    node.property.type === AST_NODE_TYPES.Identifier &&
	                    restricted.includes(node.property.name)
					) {
						context.report({ node: node.property, message });
					} else if (
						node.object &&
						node.object.type === AST_NODE_TYPES.Identifier &&
						node.object.name === "window" &&
						node.property.type === AST_NODE_TYPES.Identifier &&
						node.property.name === "document" &&
						node.parent.type === AST_NODE_TYPES.MemberExpression &&
						node.parent.property.type === AST_NODE_TYPES.Identifier &&
						restricted.includes(node.parent.property.name)
					) {
						context.report({ node: node.parent.property, message });
					}
	            }
            },
        };
    },
};

function findParent(node, testFn) {
    if (testFn(node)) {
        return node;
    } else if (node.parent) {
        return findParent(node.parent, testFn);
    }
    return null;
}
