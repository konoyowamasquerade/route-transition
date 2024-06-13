const path = require('path');

const PugPlugin = require('pug-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    entry: {
      index: './src/pages/home/home.pug',
      about: './src/pages/about/about.pug',
      feature: './src/pages/feature/feature.pug',
      'no-content': './src/pages/no-content/no-content.pug',
    },
    output: {
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        // '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new PugPlugin({
        js: {
          filename: isProduction
            ? 'js/[name].[contenthash].js'
            : 'js/[name].js',
        },
        css: {
          filename: isProduction
            ? 'css/[name].[contenthash].css'
            : 'css/[name].css',
        },
        // postprocess(contentcontent, info, compilation) {
        //   console.log(contentcontent, info, compilation);
        //   return null;
        // },
      }),

      // new ForkTsCheckerWebpackPlugin({
      //   issue: {
      //     include: [{ file: '**/src/**/*' }],
      //     exclude: [{ file: '**/*.spec.ts' }],
      //   },
      // }),
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader, // PugPlugin already contain the pug-loader
          options: {
            method: 'render', // fastest method to generate static HTML files
          },
        },
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                // projectReferences: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[contenthash][ext][query]',
          },
        },
        // {
        //   test: /\.svg$/i,
        //   type: 'asset/inline',
        // },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[contenthash][ext][query]',
          },
        },
        {
          test: /\.(scss|css)$/i,
          use: [
            {
              loader: 'css-loader',
              options: {
                import: false,
                // modules: false,
                // localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: { drop_console: true },
            output: { comments: false },
          },
        }),
        new CompressionPlugin(),
        // new ImageMinimizerPlugin({
        //   minimizer: {
        //     implementation: ImageMinimizerPlugin.imageminMinify,
        //     options: {
        //       plugins: [
        //         ['imagemin-mozjpeg', { progressive: true, quality: 80 }],
        //         ['imagemin-pngquant', { quality: [0.8, 0.8] }],
        //         ['imagemin-svgo'],
        //       ],
        //     },
        //   },
        // }),
      ],
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
      // chunkIds:
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    devtool: isProduction ? false : 'eval-source-map',
    devServer: {
      // contentBase: path.resolve(__dirname, 'src/assets'),
      port: 8085,
      hot: true,
      open: true,
    },
  };

  if (env.analyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};
