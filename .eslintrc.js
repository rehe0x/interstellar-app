module.exports = {
  env: {
    node: true,
    // browser: true,
    // commonjs: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    // 'vue'
  ],
  rules: {
    'no-tabs': 'off'
  }
}
