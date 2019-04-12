module.exports = {
    default: {
        // 测试环境发布
        test: {
            host: "119.18.237.73",
            port: "3122",
            user: "root",
            pass: "red1357@$^*",
            timeout: 100000,
            remotePath: "/opt/static/ht/app"
        },
        // 生产环境发布
        production: {
            host: "47.106.143.102",
            port: "22",
            user: "root",
            pass: "Ht@2013global",
            timeout: 100000,
            remotePath: "/opt/static/app"
        }
    }
};
