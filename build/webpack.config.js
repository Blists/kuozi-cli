const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 预加载
const PreloadWebpackPlugin = require("preload-webpack-plugin");
// css分离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// js压缩
const TerserJSPlugin = require("terser-webpack-plugin");
// css压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// vue-loader15插件
const VueLoaderPlugin = require("vue-loader/lib/plugin");
// webpack clean插件
const CleanWebpackPlugin = require("clean-webpack-plugin");
// 静态复制
const CopyPlugin = require("copy-webpack-plugin");
// 打包分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const contenthash = () => {
    return global.HASH ? ".[contenthash]" : "";
};

var webpackConfig = {
    // webpack基础配置
    basicConfig: {
        entry: { app: "./../src/index.js" },
        output: { path: path.resolve(__dirname, "../dist") },
        resolve: {
            extensions: [".js", ".vue"],
            alias: {
                // vue: "vue/dist/vue.esm.js",
                "@src": path.resolve(__dirname, "./../src")
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: { configFile: "./.babelrc" }
                    }
                },
                {
                    test: /tabs\.js$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: { configFile: "./.babelrc" }
                        },
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "process.env.TABS",
                                replace: global.TABS,
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: "./img/[name]" + contenthash() + ".[ext]"
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: "file-loader",
                    options: {
                        limit: 10000,
                        name: "./fonts/[name]" + contenthash() + ".[ext]"
                    }
                }
            ]
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "async",
                cacheGroups: {
                    vendor: {
                        name: "vendors",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/]/,
                    },
                    config: {
                        name: "config",
                        test: /config\/project/,
                        chunks: "all",
                        enforce: true
                    },
                    styles: {
                        name: "styles",
                        test: /\.css$/,
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    PROJECT: JSON.stringify(global.PROJECT),
                    ENVJS: JSON.stringify(global.ENVJS)
                }
            })
        ]
    },

    // webpack开发配置
    devConfig: {
        mode: "development",
        output: {
            filename: "./[name]" + contenthash() + ".js",
            chunkFilename: "./[name]" + contenthash() + ".js"
        },
        devtool: "#source-map",
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: { cssSourceMap: true }
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "vue-style-loader",
                            options: { sourceMap: true }
                        },
                        {
                            loader: "css-loader",
                            options: { sourceMap: true, importLoaders: 1 }
                        },
                        { loader: "postcss-loader", options: { sourceMap: true, config: { path: "." } } }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: "vue-style-loader",
                            options: { sourceMap: true }
                        },
                        { loader: "css-loader", options: { sourceMap: true } },
                        { loader: "postcss-loader", options: { sourceMap: true, config: { path: "." } } },
                        {
                            loader: "less-loader",
                            options: {
                                sourceMap: true,
                                plugins: [{
                                    install: (lessObj, pluginManager) => {
                                        pluginManager.addPreProcessor({
                                            process: function (lessCode) {
                                                return lessCode.replace("process.env.PROJECT", global.PROJECT);
                                            }
                                        }, 2000);
                                    }
                                }]
                            }
                        }
                    ]
                },
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({ template: "./../index.html", hash: true }),
            new CopyPlugin([{ from: path.resolve(__dirname, "./../static/**"), to: "./static" }])
        ]
    },
    // webpack打包配置
    buildConfig: {
        mode: "production",
        output: {
            filename: "./[name]" + contenthash() + ".js",
            chunkFilename: "./chunks/[name]" + contenthash() + ".js"
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { publicPath: "../" }
                        },
                        "css-loader",
                        { loader: "postcss-loader", options: { config: { path: "." } } }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { publicPath: "../" }
                        },
                        "css-loader",
                        { loader: "postcss-loader", options: { config: { path: "." } } },
                        {
                            loader: "less-loader",
                            options: {
                                plugins: [{
                                    install: (lessObj, pluginManager) => {
                                        pluginManager.addPreProcessor({
                                            process: function (lessCode) {
                                                return lessCode.replace("process.env.PROJECT", global.PROJECT);
                                            }
                                        }, 2000);
                                    }
                                }]
                            }
                        }
                    ]
                }
            ]
        },
        optimization: { minimizer: [] },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin([{ from: path.resolve(__dirname, "./../static/**"), to: "./static" }]),
            new HtmlWebpackPlugin({
                template: "./../index.html",
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                // chunksSortMode: "dependency"
            }),
            new PreloadWebpackPlugin({
                rel: "preload",
                include: "allChunks" // or 'initial'
            }),
            new webpack.HashedModuleIdsPlugin(),
            // css单独出个文件
            new MiniCssExtractPlugin({
                filename: "./style" + contenthash() + ".css",
                chunkFilename: "./chunks/[name]" + contenthash() + ".css"
            }),
        ]
    }
};

if (global.ZIP) {
    // 压缩代码
    webpackConfig.buildConfig.optimization.minimizer.push(...[new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]);
}
if (global.ANALYZER) {
    // 模块分析
    webpackConfig.buildConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(webpackConfig.basicConfig, webpackConfig[global.WEBPACKCONFIG]);
