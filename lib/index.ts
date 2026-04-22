import type { Plugin } from "@eslint/core";
import { noJsxWhitespace } from "./rules/noJsxWhitespace.js";
import { preferUseRefFunctionComponents } from "./rules/preferUseRefFunctionComponents.js";
import { restrictCssClassUsageToFiles } from "./rules/restrictCssClassUsageToFiles.js";
import { restrictDomNodeRetrieval } from "./rules/restrictDomNodeRetrieval.js";
import { restrictImportFromSource } from "./rules/restrictImportFromSource.js";


const plugin: Plugin = {
    meta: {
        name: "eslint-plugin-moxio",
        namespace: "moxio",
        version: "1.0",
    },
    rules: {
        "prefer-useref-function-components": preferUseRefFunctionComponents,
        "restrict-css-class-usage-to-files": restrictCssClassUsageToFiles,
        "restrict-dom-node-retrieval": restrictDomNodeRetrieval,
	    "restrict-import-from-source": restrictImportFromSource,
	    "no-jsx-whitespace": noJsxWhitespace,
    },
};

export default plugin;
