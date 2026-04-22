import type { Plugin } from "@eslint/core";
import { preferUseRefFunctionComponents } from "./rules/preferUseRefFunctionComponents";
import { restrictCssClassUsageToFiles } from "./rules/restrictCssClassUsageToFiles";
import { restrictDomNodeRetrieval } from "./rules/restrictDomNodeRetrieval";
import { restrictImportFromSource } from "./rules/restrictImportFromSource";


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
    },
};

export default plugin;
