module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    extends: "eslint:recommended",
    plugins: ["html"],
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module"
    },
    rules: {
        // 允许对象的属性放在一行上
        allowAllPropertiesOnSameLine: true,
        // 大括号风格
        "brace-style": ["error", "1tbs", { allowSingleLine: true }],
        // 强制使用一致的缩进风格 4个空格缩进
        indent: "error",
        // 使用双引号 允许使用反勾号
        quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
        // 分号结束代码
        semi: ["error", "always"]
    }
};
