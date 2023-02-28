const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => ({
  mode: 'production',
  //Where files should be sent once they are bundled
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index.bundle.js',
  },
  plugins: [
    new Dotenv({ path: `./.env.${argv.mode}` }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new MiniCssExtractPlugin(),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js'],
      exclude: 'node_modules',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '...'],
  },
  //webpack 5 comes with devServer which loads in development mode
  devServer: {
    port: 3000,
    //watchContentBase: true
  },
  //Rules of how webpack will take our files, complie & bundle them for the browser
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /_notes/],
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css|scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
})
