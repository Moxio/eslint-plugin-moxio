/* global module, require, __dirname*/
/**
 * @fileoverview Custom rules
 * @author moxio
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");
