const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
        entry: { app: "./src/index.js" },
        output: { path: path.resolve(__dirname, "dist") },
        resolve: {
            extensions: [".js", ".vue"],
            alias: {
                vue: "vue/dist/vue.esm.js",
                "@src": path.resolve(__dirname, "./src")
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    // loader: "babel-loader"
                    use: [
                        "babel-loader",
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "ROUTECONFIG",
                                replace: JSON.stringify(global.ROUTECONFIG).replace(/"\$/g, "").replace(/\$"/g, ""),
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
                    styles: {
                        name: "styles",
                        test: /\.css$/,
                        enforce: true
                    },
                    commons: {
                        name: "commons",
                        chunks: "async",
                        minChunks: 2
                    }
                }
            }
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    PROJECT: JSON.stringify(global.PROJECT),
                    ENVJS: JSON.stringify(global.ENVJS),
                    ASYNCROUTE: JSON.stringify(global.ASYNCROUTE),
                    // ROUTECONFIG: JSON.stringify(global.ROUTECONFIG).replace(/"\$/g, "").replace(/\$"/g, ""),
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
                        { loader: "postcss-loader", options: { sourceMap: true } }
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
                        { loader: "postcss-loader", options: { sourceMap: true } },
                        { loader: "less-loader", options: { sourceMap: true } }
                    ]
                }
            ]
        },

        plugins: [new HtmlWebpackPlugin({ template: "./index.html", hash: true })]
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
                        "postcss-loader"
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
                        "postcss-loader",
                        "less-loader"
                    ]
                }
            ]
        },
        optimization: { minimizer: [] },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin([{ from: path.resolve(__dirname, "./static/**") }]),
            new HtmlWebpackPlugin({
                template: "./index.html",
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: "dependency"
            }),
            new webpack.HashedModuleIdsPlugin(),
            // css单独出个文件
            new MiniCssExtractPlugin({
                filename: "./style" + contenthash() + ".css",
                chunkFilename: "./chunks/[name]" + contenthash() + ".css"
            })
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
