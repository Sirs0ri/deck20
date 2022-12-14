module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    ecmaVersion: '2021', // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-recommended',

    'standard'
  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue',
    
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    'no-void': 'off',
    'prefer-promise-reject-errors': 'off',

    // Doubleqoutes erzwingen (" statt ')
    'quotes': ['warn', 'double'],
    // Kommas am Ende von Objekten hinzufügen, sobals das Objekt mehr als eine Zeile hat
    'comma-dangle': ['warn', 'always-multiline'],

    'import/order': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': [
      'warn', 'never',
      {
        'vue': 'always',
        'json': 'always',
      }
    ],

    // HTML Tags mit mehr als zwei Vue-Attributen in mehrere Zeilen aufteilen
    'vue/max-attributes-per-line': ['error', {
      singleline: 2,
      multiline: 1,
    }],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
