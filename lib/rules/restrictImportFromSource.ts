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
 * @fileoverview Rule that warns about restricted imports from sources based on supplied configuration
 *
 * Current detection will search for:
 * - Usage of `import { x } from "y"`
 */

export const restrictImportFromSource: RuleDefinition = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    sources: {
                        description: "A list of sources (the module or file we're importing from)",
                        type: "object",
                        additionalProperties: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    description: "message to be shown, use {{ identifier }} and {{ source }} as variables. Default message is '{{ identifier }} on {{ source }} has been restricted'"
                                },
                                identifiers: {
                                    type: "array",
                                    items: {
                                        description: "Identifier (the name of the thing we're importing)",
                                        type: "string",
                                    },
                                    minItems: 1,
                                    uniqueItems: true
                                }
                            },
                            additionalProperties: false,
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
		    sources: Record<string, {
				message: string;
				identifiers: string[];
		    }>;
	    }[];
	    Node: RuleDefinitionTypeOptions["Node"];
	    MessageIds: RuleDefinitionTypeOptions["MessageIds"];
    }>) {
        "use strict";

        const sources = context.options[0]["sources"];

        return {
            ImportDeclaration: function (node: TSESTree.ImportDeclaration) {
                if (node.specifiers && node.source) {
                    if (node.source.value) {
                        const source = node.source.value;

                        node.specifiers.map(function (specifier) {
							if (specifier.type === AST_NODE_TYPES.ImportSpecifier && specifier.imported.type === AST_NODE_TYPES.Identifier) {
                                const imported = specifier.imported.name;

                                if (sources[source] && sources[source].identifiers.includes(imported)) {
                                    context.report({
                                        node: node,
                                        message: sources[source].message || "{{ identifier }} on {{ source }} has been restricted",
                                        data: {
                                            identifier: imported,
                                            source: source
                                        },
                                    });
                                }
                            }
                        })
                    }
                }
            },
        };
    },
};
