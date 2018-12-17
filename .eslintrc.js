module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: "eslint:recommended",
    globals: {
        "pbE": false,
        "wx": false,
        "WeixinJSBridge": false
    },
    plugins: ["html"],
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module"
    },
    rules: {
        // 空格相关
        "array-bracket-spacing": ["error", "never"],
        "block-spacing": ["error", "never"],
        "comma-spacing": ["error", { before: false, after: true }],
        "computed-property-spacing": ["error", "never"],
        "keyword-spacing": ["error", { before: true }],
        "object-curly-spacing": ["error", "always"],
        "key-spacing": ["error", { beforeColon: false, afterColon: true }],
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-infix-ops": "error",
        "spaced-comment": ["error", "always"],
        "no-trailing-spaces": ["error", { skipBlankLines: false, ignoreComments: false }],
        // 允许对象的属性放在一行上
        allowAllPropertiesOnSameLine: true,
        // 大括号风格
        "brace-style": ["error", "1tbs", { allowSingleLine: true }],
        camelcase: 1,
        // 强制使用一致的缩进风格 4个空格缩进
        indent: "error",
        // 强制在花括号内使用一致的换行符
        "object-curly-newline": ["error", { multiline: true }],
        // 对象的属性换行配置
        "object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
        // 使用双引号 允许使用反勾号
        quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
        // 分号结束代码
        semi: ["error", "always"],
        // 当没有严格要求时，禁止对象字面量属性名称使用引号
        "quote-props": ["error", "as-needed", { keywords: false, unnecessary: true, numbers: false }],
        // 允许case中词法声明
        "no-case-declarations": 0,
        // console警告
        "no-console": [1 , { allow: ["warn", "error"] }]
    }
};