/*global module*/
/**
 * @fileoverview Rule that reports errors if React.createRef is used inside function components
 *
 */

"use strict";

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "In function components, the useRef hook should be used instead of createRef",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    return {
      Identifier: function (node) {
        const nodeType = node.name;
        if (nodeType !== "createRef") {
          return;
        }
        const isTestCase = findParent(node, (parent) => {
          return (
            parent.type === "CallExpression" && parent.callee.name === "it"
          );
        });

        if (isTestCase) {
          return;
        }

        const isFunction = findParent(
          node,
          (parent) =>
            parent.type === "ArrowFunctionExpression" ||
            parent.type === "FunctionDeclaration"
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
};

function findParent(node, testFn) {
  if (testFn(node)) {
    return node;
  } else if (node.parent) {
    return findParent(node.parent, testFn);
  }
  return null;
}
