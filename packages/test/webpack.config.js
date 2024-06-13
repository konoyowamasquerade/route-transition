const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = () => {
  const config = {
    entry: {
      index: './src/pages/page-1.pug',
      'page-2': './src/pages/page-2.pug',
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new PugPlugin({
        js: { filename: 'js/[name].js' },
        css: { filename: 'css/[name].css' },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader,
          options: { method: 'render' },
        },
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: { transpileOnly: true },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/i,
          use: [
            {
              loader: 'css-loader',
              options: { import: false },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    devtool: 'eval-source-map',
    devServer: {
      port: 8086,
      hot: true,
      open: true,
    },
  };

  return config;
};
