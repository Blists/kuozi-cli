module.exports = {
    default: {
        // 测试环境发布
        "env.dev.js": {
            host: "",
            port: "",
            user: "",
            pass: "",
            timeout: 100000,
            remotePath: ""
        },
        // 生产环境发布
        "env.production.js": {
            host: "",
            port: "",
            user: "",
            pass: "",
            timeout: 100000,
            remotePath: ""
        }
    },
};