var gulp = require("gulp");

var path = require("path");
var fs = require("fs");
var inquirer = require("inquirer");

var gulpSftp = require("gulp-sftp");

var project = {
    devPort: 8081,
    host: "localhost"
};
var ssh = require("./config/ssh");

const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

/**
 * dev-server
 */
const devTack = () => {
    global.WEBPACKCONFIG = "devConfig";
    const config = require("./webpack.config.js");
    const projectConfig = require("./config/project/" + global.PROJECT + "/env/" + global.ENVJS).projectConfig;
    const options = {
        contentBase: "./dist",
        hot: true,
        host: project.host,
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        },
        proxy: (() => {
            var proxyTable = {};
            for (var k of Object.keys(projectConfig)) {
                var p = projectConfig[k];
                proxyTable["/" + p.baseURL] = {
                    target: p.proxyServer,
                    pathRewrite: { ["/" + p.baseURL]: "" },
                    changeOrigin: true
                    // secure: false
                };
            }
            return proxyTable;
        })()
    };
    webpackDevServer.addDevServerEntrypoints(config, options);
    const compiler = webpack(config);
    const server = new webpackDevServer(compiler, options);

    server.listen(project.devPort, options.host, () => {
        console.warn(
            "dev server listening at http://" +
            options.host +
            ":" +
            project.devPort
        );
    });
};

/**
 * gulp+webpack Build
 */

// webpack打包
const buildTask = (cb) => {
    global.WEBPACKCONFIG = "buildConfig";
    webpack(require("./webpack.config"), function (err, stats) {
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
};

const readdir = (dirPath, method) => {
    return new Promise((reslove) => {
        let res = [];
        var files = fs.readdirSync(dirPath);
        for (let filename of files) {
            var fullname = path.join(dirPath, filename);
            var stats = fs.statSync(fullname);
            if (stats[method]()) {
                res.push({ name: filename, value: filename, fullname: fullname });
            }
            reslove(res);
        }
    });
};

// 目录选择
const dirChoose = (dirPath, method, message) => {
    return new Promise((reslove) => {
        readdir(dirPath, method).then(res => {
            if (res.length > 0) {
                if (res.length > 1) {
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: message,
                                name: "value",
                                choices: res
                            }
                        ])
                        .then(answer => {
                            reslove(answer.value);
                        });
                } else {
                    reslove(res[0].value);
                }
            } else {
                throw new Error("配置为空");
            }
        });
    });
};

// 列表选择
const choose = (message, choices) => {
    choices = choices || [{ name: "是", value: true }, { name: "否", value: false }];
    return new Promise((reslove) => {
        inquirer
            .prompt([
                {
                    type: "list",
                    message: message,
                    name: "value",
                    choices: choices
                }
            ])
            .then(answer => {
                reslove(answer.value);
            });
    });
};

// 选择项目
const chooseProject = (cb) => {
    dirChoose("./config/project", "isDirectory", "*****请选择项目：").then(res => {
        global.PROJECT = res;
        cb();
    });
};

// 选择环境
const chooseEnv = (cb) => {
    let dirPath = path.join("./config/project", global.PROJECT, "env");
    dirChoose(dirPath, "isFile", "*****请选择配置文件：").then(res => {
        global.ENVJS = res;
        cb();
    });
};

// 是否带hash后缀
const chooseHash = (cb) => {
    choose("*****是否带hash后缀？").then(res => {
        global.HASH = res;
        cb();
    });
};

// 是否分割
const chooseSplit = (cb) => {
    choose("*****是否动态加载路由？").then(res => {
        global.ASYNCROUTE = res;
        global.ROUTECONFIG = {};
        if (res) {
            let routes = [];
            let all = [];
            var dir = "./src/view";
            var readdir = function(d) {
                var files = fs.readdirSync(d);
                for (let filename of files) {
                    var fullname = path.join(d, filename);
                    var stats = fs.statSync(fullname);
                    if (stats.isDirectory()) {
                        readdir(fullname);
                    } else {
                        if (/.vue$/.test(filename)) {
                            all.push({
                                file: filename,
                                path: fullname
                                    .replace("src/view", "")
                                    .replace("src\\view", "")
                                    .replace(".vue", "")
                                    .toString()
                            });
                            routes.push({
                                name: filename.replace(".vue", "").toString(),
                                path: fullname
                                    .replace("src/view", "")
                                    .replace("src\\view", "")
                                    .replace(".vue", "")
                                    .toString(),
                                meta: "{ login: true }",
                                component: `() => import ("${fullname.replace("src", "./..")}")`
                            });
                        }
                    }
                }
            };
            readdir(dir);
            var pathProcess = function(p) {
                let path = "";
                let paths = p.split("/");
                let name = paths.pop();
                path = paths.join("/");
                return {
                    name: name,
                    path: path
                };
            };
            var isChild = function(routes, parent, name, route, flag) {
                let f;
                for (let n in routes) {
                    if (n == parent) {
                        flag = true;
                        if (routes[parent].children) {
                            routes[parent].children[name] = route;
                        } else {
                            routes[parent].children = { [name]: route };
                        }
                    } else if (routes[n].children) {
                        f = isChild(routes[n].children, parent, name, route, flag);
                    }
                }
                return flag || f;
            };

            var orderArray = require("lodash").orderBy(all, ["path"], ["asc"]);
            let routesObj = {};
            for (let arr of orderArray) {
                let path = arr.path;
                let curr = pathProcess(path);
                let parent = pathProcess(curr.path).name;
                let route = {
                    name: curr.name,
                    path: path,
                    meta: { login: false },
                    component: `$() => import ('./../view${path}.vue')$`
                };
                let flag = isChild(routesObj, parent, curr.name, route, false);
                if (!flag) {
                    routesObj[curr.name] = route;
                }
            }
            global.ROUTECONFIG = routesObj;
            // global.ASYNCROUTE = JSON.stringify(routesObj)
            //     .replace(/"\$/g, "")
            //     .replace(/\$"/g, "");
        }
        cb();
    });
};
// 是否压缩
const chooseZip = (cb) => {
    choose("*****是否压缩？").then(res => {
        global.ZIP = res;
        cb();
    });
};

// 代码上传
const sftp = () => {
    return gulp.src("./dist/**").pipe(gulpSftp(ssh[global.PROJECT][global.ENVJS]));
};

// 模块分析
const analyze = (cb) => {
    global.ZIP = true;
    global.ANALYZER = true;
    cb();
};
// 基础选择
const chooseBase = gulp.series(chooseProject, chooseEnv, chooseSplit);

gulp.task("dev", gulp.series(chooseBase, devTack));
gulp.task("build", gulp.series(chooseBase, chooseHash, chooseZip, buildTask));
gulp.task("publish", gulp.series("build", sftp));
gulp.task("sftp", gulp.series(chooseBase, sftp));
gulp.task("analyze", gulp.series(chooseBase, analyze, buildTask));
