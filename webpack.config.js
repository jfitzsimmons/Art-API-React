const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => ({
  mode: 'production',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index.bundle.js',
  },
  plugins: [
    new Dotenv({ path: `./.env.${argv.mode}` }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '...'],
  },
  devServer: {
    port: 3000,
  },
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
        test: /\.(css|sass|scss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
})
