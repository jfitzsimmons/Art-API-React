const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => ({
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new Dotenv({ path: `./.env.${argv.mode}` }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './public/index.html',
      favicon: './public/assets/favicon.ico',
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '...'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxEntrypointSize: 912000,
    maxAssetSize: 912000,
  },
  devtool: 'source-map',
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
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
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
