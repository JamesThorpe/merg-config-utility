const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");


const outputPath = path.resolve(__dirname, "dist");

module.exports = {
    entry: "./src/client/index.ts",
    output: {
        filename: "main.js",
        path: outputPath,
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/client/index.html"
        }),
        new VueLoaderPlugin()
    ],
    devtool: "source-map",
    devServer: {
        static: {
            directory: outputPath,
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "vue": "vue/dist/vue.esm-bundler.js"
        }
    },
    module: {
        rules:[{
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: {
                appendTsSuffixTo: [/\.vue$/]
            }
        },{
            test: /\.vue$/,
            loader: "vue-loader"
        }, {
            test: /\.css$/,
            use: ["vue-style-loader", "css-loader"]
        }, {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"]
        }]
    }
};