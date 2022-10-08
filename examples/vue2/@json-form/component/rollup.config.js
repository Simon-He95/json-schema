// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
// import json from 'rollup-plugin-json'
import VuePlugin from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
// import uglify from 'rollup-plugin-uglify'
// import { minify } from 'uglify-js'
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';
// import alias from 'rollup-plugin-alias'
import css from 'rollup-plugin-css-only';
import CleanCSS from 'clean-css';
import { writeFileSync } from 'fs';
import scss from 'rollup-plugin-scss'

const { version } = require('./package');
const flow = require('rollup-plugin-flow-no-whitespace');
const UnoCSS = require('@unocss/webpack').default;
const { presetAttributify, presetUno } = require('unocss');

const banner =
  '/*!\n' +
  ` * Silent Component.js v${version}\n` +
  ` * (c) 2018-${new Date()}\n` +
  ' * xd.\n' +
  ' */';

export default {
  input: './index.js',
  output: {
    file: '../../output/silent-manage-component-' + version + '.js',
    name: 'SilentComponent',
    moduleName: 'SilentComponent',
    format: 'umd',
    banner: banner,
    sourcemap: false,
    plugins: [terser({ compress: { drop_console: true } })],
  },
  // { 'vue-awesome-swiper': 'VueAwesomeSwiper' }, 'md5', '@silent-manage/util'
  // 'md5',
  external: ['vue', 'lodash', 'vuedraggable', 'xlsx'],
  plugins: [
    scss(),
    UnoCSS({
      presets: [presetAttributify({}), presetUno()],
    }),
    css({
      output(style) {
        // 压缩 css 写入 dist/vue-rollup-component-template.css
        writeFileSync(
          '../../output/silent-manage-component-' + version + '.css',
          new CleanCSS().minify(style).styles
        );
      },
    }),
    flow(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {
        'node_modules/lodash/index.js': ['debounce'],
      },
    }),
    builtins(),
    babel(),
    json(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    // alias({
    //   resolve: ['.vue'], //optional, by default this will just look for .js files or folders
    //   entries:[
    //     {find:'@', replacement: './'},
    //   ],
    // }),
    VuePlugin({
      css: false,
    }),
    // uglify(),
    // terser(),
    // uglify({}, minify),
  ],
  // plugins: [resolve(), commonjs({
  //   'namedExports': {
  //     './lib/main.js': ['__moduleExports']
  //   }
  // }), json()]
};
