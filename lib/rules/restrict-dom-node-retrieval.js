/*global module*/
/**
 * @fileoverview Rule that reports errors if dom-node retrieval methods ("querySelector", "querySelectorAll", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById") are called on document
 *
 */

"use strict";

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Don't retrieve dom nodes directly, use react-refs to read/manipulate the dom",
            category: "Possible Errors",
            recommended: true,
        },
        schema: [],
    },
    create: function (context) {
        const restricted = [ "querySelector", "querySelectorAll", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById" ];

        return {
            MemberExpression: function (node) {
                const isRestrictedDocumentMethodCall = node.object &&
                    node.object.name === "document" &&
                    node.property &&
                    restricted.includes(node.property.name);

                const isRestrictedWindowMethodCall = node.object &&
                    node.object.name === "window" &&
                    node.property &&
                    node.property.name === "document" &&
                    node.parent &&
                    node.parent.property &&
                    restricted.includes(node.parent.property.name);

                if (isRestrictedDocumentMethodCall === false && isRestrictedWindowMethodCall === false) {
                    return;
                }

                const isTestCase = findParent(node, (parent) => {
                    return (
                        parent.type === "CallExpression" && (parent.callee.name === "it" || parent.callee.name === "describe")
                    );
                });

                if (isTestCase) {
                    return;
                }

                context.report({
                    node: isRestrictedDocumentMethodCall ? node.property : node.parent.property,
                    message: "Don't retrieve dom nodes directly, use react-refs to read/manipulate the dom",
                });
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
