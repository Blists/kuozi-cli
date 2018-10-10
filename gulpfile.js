var gulp = require("gulp");

var express = require("express");
var proxyMiddleware = require("http-proxy-middleware");

var clean = require("gulp-clean");
var webpack = require("webpack");

var sftp = require("gulp-sftp");

var path = require("path");
var fs = require("fs");
var replace = require("gulp-replace");
var rename = require("gulp-rename");
var colors = require("colors");

var readline = require("readline");
var argvs = JSON.parse(process.env.npm_config_argv || "{}").original || [];
process.env.PROJECT = argvs[2] == undefined ? "default" : argvs[2].replace("--", '');

gulp.task("replace-variables", function () {
    return gulp.src("./src/style/variables.src.less")
        .pipe(replace("$PROJECT", process.env.PROJECT))
        .pipe(rename("variables.less"))
        .pipe(gulp.dest('./src/style/'));
})

gulp.task("choose-env", ['replace-variables'], function() {
    if (argvs[1] != "dev") {
        return new Promise(resolve => {
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(`\n**********NODE_ENV(test):**********\n1.test\n2.production\n`.yellow, function(answer) {
                switch (answer) {
                    case "1":
                        process.env.NODE_ENV = "test";
                        break;
                    case "2":
                        process.env.NODE_ENV = "production";
                        break;
                    default:
                        process.env.NODE_ENV = "test";
                        break;
                }
                rl.close();
                resolve();
            });
        });
    } else {
        process.env.NODE_ENV = "dev";
    }
});

gulp.task("choose-hash", ["choose-env"], function() {
    if (argvs[1] == "dev") {
        process.env.HASH = true;
    } else {
        return new Promise(resolve => {
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(`\n**********HASH(y/n):**********\n`.yellow, function(answer) {
                switch (answer) {
                    case "y":
                        process.env.HASH = true;
                        break;
                    case "n":
                        process.env.HASH = false;
                        break;
                    default:
                        process.env.HASH = true;
                        break;
                }
                rl.close();
                resolve();
            });
        });
    }
});

gulp.task("choose-ugfjs", ["choose-hash"], function() {
    if (argvs[1] == "dev") {
        process.env.UGFJS = false;
    } else {
        return new Promise(resolve => {
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(`\n**********UGFJS(y/n):**********\n`.yellow, function(answer) {
                switch (answer) {
                    case "y":
                        process.env.UGFJS = true;
                        break;
                    case "n":
                        process.env.UGFJS = false;
                        break;
                    default:
                        process.env.UGFJS = false;
                        break;
                }
                rl.close();
                resolve();
            });
        });
    }
});

/**
 * dev-server
 */
gulp.task("dev", ["choose-ugfjs"], function() {
    var app = express();
    let c = require("./webpack.config");
    var compiler = webpack(require("./webpack.config"));
    //使用webpack-dev-middleware
    var devMiddleware = require("webpack-dev-middleware")(compiler, {
        publicPath: "/",
        stats: {
            colors: true,
            chunks: false
        }
    });
    app.use(devMiddleware);

    // 开发环境配置代理
    var proxyTable = {};
    var project = require("./config/project/project.env");
    for (var k of Object.keys(project.projectConfig)) {
        var p = project.projectConfig[k];
        proxyTable["/" + p.baseURL] = {
            target: p.proxyServer,
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                ["/" + p.baseURL]: ""
            }
        };
    }
    Object.keys(proxyTable).forEach(function(context) {
        var options = proxyTable[context];
        if (typeof options === "string") {
            options = {
                target: options
            };
        }
        app.use(proxyMiddleware(context, options));
    });

    //使用webpack-hot-middleware热加载
    var hotMiddleware = require("webpack-hot-middleware")(compiler);
    app.use(hotMiddleware);

    // //创建虚拟目录static放static目录下的静态资源
    app.use("/static", express.static("./static"));

    // 启动expres服务
    app.listen(project.devPort, function(error) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Listening at http://localhost:" + project.devPort + "\n");
    });
});

/**
 * gulp+webpack Build
 */
//删除dist
gulp.task("clean", ["split"], function() {
    return gulp
        .src("./dist", {
            read: false
        })
        .pipe(clean());
});

//复制static目录
gulp.task("cp", ["clean"], function() {
    gulp.src("./static/**").pipe(gulp.dest("./dist/static"));
});

//webpack打包
gulp.task("build", ["cp"], function(cb) {
    webpack(require("./webpack.config"), function(err, stats) {
        if (err) throw err;
        process.stdout.write(
            stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + "\n"
        );
        cb(err);
    });
});

/**
 * Build+部署
 */
// sftp上传开发环境
gulp.task("sftp", ["choose-env"], function() {
    var ssh = require("./config/ssh");
    return gulp.src("./dist/**").pipe(sftp(ssh[process.env.PROJECT][process.env.NODE_ENV]));
});

//发布
gulp.task("publish", ["build"], function() {
    var ssh = require("./config/ssh");
    return gulp.src("./dist/**").pipe(sftp(ssh[process.env.PROJECT][process.env.NODE_ENV]));
});
