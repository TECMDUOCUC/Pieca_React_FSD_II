const path = require('path');
const { esbuildPluginIstanbul } = require('esbuild-plugin-istanbul');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/**/*.spec.js', watched: false }
    ],

    plugins: [
      'karma-jasmine',
      '@chiragrupani/karma-chromium-edge-launcher',
      'karma-esbuild',
      'karma-coverage'
    ],

    preprocessors: {
      'src/**/*.spec.js': ['esbuild']
    },

    esbuild: {
      absWorkingDir: __dirname,
      target: 'es2022',
      format: 'iife',
      bundle: true,
      jsx: 'automatic',
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      resolveExtensions: ['.jsx', '.js', '.json'],
      define: {
        'process.env.NODE_ENV': '"test"',
        'import.meta.env.BASE_URL': JSON.stringify('/')
      },
      plugins: [
        esbuildPluginIstanbul({
          filter: /\.[cm]?js$/,
          loader: 'jsx',
          name: 'istanbul-loader-js'
        }),
        esbuildPluginIstanbul({
          filter: /\.jsx$/,
          loader: 'jsx',
          name: 'istanbul-loader-jsx'
        })
      ]
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['EdgeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};

