/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { getTSConfigForContext } = require("./get-tsconfig")
const isTypescript = require("./is-typescript")

const DEFAULT_JS_VALUE = Object.freeze([
    ".js",
    ".json",
    ".node",
    ".mjs",
    ".cjs",
])
const DEFAULT_TS_VALUE = Object.freeze([
    ".js",
    ".ts",
    ".mjs",
    ".mts",
    ".cjs",
    ".cts",
    ".json",
    ".node",
])

/**
 * Gets `tryExtensions` property from a given option object.
 *
 * @param {object|undefined} option - An option object to get.
 * @returns {string[]|null} The `tryExtensions` value, or `null`.
 */
function get(option) {
    if (Array.isArray(option?.tryExtensions)) {
        return option.tryExtensions.map(String)
    }
    return null
}

/**
 * Gets "tryExtensions" setting.
 *
 * 1. This checks `options` property, then returns it if exists.
 * 2. This checks `settings.n` | `settings.node` property, then returns it if exists.
 * 3. This returns `[".js", ".json", ".node", ".mjs", ".cjs"]`.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {string[]} A list of extensions.
 */
module.exports = function getTryExtensions(context, optionIndex = 0) {
    const configured =
        get(context.options?.[optionIndex]) ??
        get(context.settings?.n) ??
        get(context.settings?.node)

    if (configured != null) {
        return configured
    }

    if (isTypescript(context)) {
        const tsconfig = getTSConfigForContext(context)
        if (tsconfig?.config?.compilerOptions?.allowImportingTsExtensions) {
            return DEFAULT_TS_VALUE
        }
    }

    return DEFAULT_JS_VALUE
}

module.exports.schema = {
    type: "array",
    items: {
        type: "string",
        pattern: "^\\.",
    },
    uniqueItems: true,
}
