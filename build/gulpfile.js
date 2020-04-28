var gulp = require("gulp");

var path = require("path");
var fs = require("fs");
var os = require("os");

var inquirer = require("inquirer");

var gulpSftp = require("gulp-sftp-up4");

const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

const ssh = require("./../config/ssh");


/**
 * dev-server
 */
const devTack = () => {
    global.WEBPACKCONFIG = "devConfig";
    const config = require("./webpack.config.js");
    const projectEnvConfig = require("./../config/project/" + global.PROJECT + "/env/" + global.ENVJS);
    const projectConfig = projectEnvConfig.projectConfig;
    const options = {
        contentBase: "./dist",
        hot: true,
        host: "0.0.0.0",
        allowedHosts: [os.hostname()],
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
    server.listen(projectEnvConfig.devPort, options.host, () => {
        console.error(
            "Listening at http://localhost:" +
            projectEnvConfig.devPort
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
        }
        reslove(res);
    });
};

// 目录选择
const dirChoose = (dirPath, method, message, isEnv) => {
    return new Promise((reslove) => {
        readdir(dirPath, method).then(res => {
            if (res.length > 0) {
                if (isEnv) {
                    let index = res.findIndex(v => /dev/.test(v.value));
                    if (isDev) {
                        if (index >= 0) {
                            res = [res[index]];
                        } else {
                            throw new Error("无开发配置文件！");
                        }
                    } else {
                        if (index >= 0) {
                            res.splice(index, 1);
                        }
                    }
                }
                if (res.length > 1) {
                    let defaultIndex = res.findIndex(v => /(default|test)/.test(v.value));
                    if (defaultIndex > 0) {
                        let def = res[defaultIndex];
                        res.splice(defaultIndex, 1);
                        res.unshift(def);
                    }
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
                } else if (res.length == 1) {
                    reslove(res[0].value);
                } else {
                    throw new Error("无打包配置文件！");
                }
            } else {
                throw new Error("配置为空！");
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

let isDev = false;
const setDev = (cb) => {
    isDev = true;
    cb();
};

// 选择项目
const chooseProject = (cb) => {
    dirChoose("./../config/project", "isDirectory", "*****请选择项目：").then(res => {
        global.PROJECT = res;
        cb();
    });
};

// 选择环境
const chooseEnv = (cb) => {
    let dirPath = path.join("./../config/project", global.PROJECT, "env");
    dirChoose(dirPath, "isFile", "*****请选择配置文件：", true).then(res => {
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
        if (res) {
            let allRoutes = [];
            var dir = "./../src/view";
            var readdir = function (d) {
                var files = fs.readdirSync(d);
                for (let filename of files) {
                    var fullname = path.join(d, filename);
                    var stats = fs.statSync(fullname);
                    if (stats.isDirectory()) {
                        readdir(fullname);
                    } else {
                        if (/.vue$/.test(filename)) {
                            allRoutes.push({
                                file: filename,
                                path: fullname
                                    .replace("../src/view", "")
                                    .replace("..\\src\\view", "")
                                    .replace(".vue", "")
                                    .toString()
                            });
                        }
                    }
                }
            };
            readdir(dir);
            var pathProcess = function (p) {
                return {
                    name: p.split(/\//.test(p) ? "/" : "\\").pop(),
                    path: p
                };
            };
            var pushRoute = function (routesObj, path, fullPath) {
                let routes = Object.values(routesObj);
                let splitChart = /\//.test(path) ? "/" : "\\";
                let route = routes.find(r => path.startsWith(r.path + splitChart));
                let name = pathProcess(path).name;
                let r = {
                    name,
                    path,
                    meta: { login: false },
                    component: `$() => import ('./../view${fullPath}.vue')$`
                };
                if (route) {
                    let relaPath = path.replace(route.path + splitChart, "");
                    if (route.children) {
                        pushRoute(route.children, relaPath, fullPath);
                    } else {
                        route.children = { [name]: Object.assign(r, { path: relaPath.replace(splitChart, "") }) };
                    }
                } else {
                    routesObj[name] = r;
                }
            };
            var orderRoutes = require("lodash").orderBy(allRoutes, ["path"], ["asc"]);
            let routesObj = {};
            for (let arr of orderRoutes) {
                pushRoute(routesObj, arr.path, arr.path);
            }
            global.ROUTES = JSON.stringify(routesObj).replace(/"\$/g, "").replace(/\$"/g, "");
        } else {
            // eslint-disable-next-line no-useless-escape
            let codeRoutes = `{}; const components = require.context("./../view/", true, /\.vue$/);
            var pathProcess = function (p) {
                return {
                    name: p.split("/").pop(),
                    path: p
                };
            };
            var pushRoute = function (routesObj, path, component) {
                let routes = Object.values(routesObj);
                let route = routes.find(r => path.startsWith(r.path + "/"));
                let name = pathProcess(path).name;
                let r = {
                    name,
                    path,
                    meta: { login: false },
                    component
                };
                if (route) {
                    r.path = path.replace(route.path + "/", "");
                    if (route.children) {
                        pushRoute(route.children, r.path, component);
                    } else {
                        route.children = { [name]: r };
                    }
                } else {
                    routesObj[name] = r;
                }
            };
            components.keys().forEach(key => {
                let path = key.replace(".", "").replace(".vue", "");
                pushRoute(routes,path,components(key).default);
            });`;
            global.ROUTES = codeRoutes;
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
    return gulp.src("./../dist/**").pipe(gulpSftp(ssh[global.PROJECT][global.ENVJS.replace(".js", "")]));
};

// 模块分析
const analyze = (cb) => {
    global.ZIP = true;
    global.ANALYZER = true;
    cb();
};
// 基础选择
const chooseBase = gulp.series(chooseProject, chooseEnv, chooseSplit);

gulp.task("dev", gulp.series(setDev, chooseBase, devTack));
gulp.task("build", gulp.series(chooseBase, chooseHash, chooseZip, buildTask));
gulp.task("publish", gulp.series("build", sftp));
gulp.task("sftp", gulp.series(chooseProject, chooseEnv, sftp));
gulp.task("analyze", gulp.series(chooseBase, analyze, buildTask));