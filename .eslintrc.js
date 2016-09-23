module.exports = {
  "extends": "airbnb",
  "rules": {
    "no-console": "off",
    "no-bitwise": "off",
    "no-plusplus": "off",
    "no-mixed-operators": ["error", { "allowSamePrecedence": true }],
    "yoda": ["error", "never", { "exceptRange": true }],
    "strict": ["error", "function"],
    "no-param-reassign": ["error", { "props": false }],
  },
  env: {
    node: true,
    browser: false
  },
}
