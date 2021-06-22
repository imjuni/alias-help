# alias-help
alias-help help module resolution config convert from tsconfig.json to webpack.config.*.js. 

# Usage
```js
const aliasHelp = require('alias-help');

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: aliasHelp({ configFile: 'tsconfig.json' }),
    plugins: [
      new tsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.json',
      }),
    ],
    fallback: {
      __dirname: false,
      __filename: false,
      console: false,
      global: false,
      process: false,
    },
  },
}
```

# Caution
Little bit difference between webpack module resolution configuration and typescript module resolution configuration. typescript module resolution configuration can do group by several directory.

* typescript can do this but webpack don't. 
```json
{
  "compilerOptions": {
    "paths": {
      "@avengers/*": [
        "src/iconman/*",
        "src/hulk/*"
      ]
    }
  }
}
```

## Important
Follow [webpack official document](https://webpack.js.org/configuration/resolve/) that can pass string array but only works in webpack5.

So alias-help can do convertion for webpack5. See below.

### AS-IS tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@avengers/*": [
        "src/iconman/*",
        "src/hulk/*"
      ]
    }
  }
}
```

### TO-BE json object for webpack5
```
{
  '@avengers': [
    'src/iconman',
    'src/hulk'
  ]
}
```
# Convertion example
in tsconfig.json
```
{
  "@src/*": ["src/*"],
  "@samsubdir/*": ["src/sample-sub-dir/*"],
  "@samdir/*": ["../sample-dir/*"]
}
```

to webpack.config.*.js
```
{
  '@src': 'src',
  '@samsubdir': 'src/sample-sub-dir',
  '@samdir': '../sample-dir',
}
```

# Note
You can use extended tsconfig.json file. You have tsconfig.base.json and tsconfig.json file extend that whatever tsconfig extension not a problem. Because alias-help use typescript library for read tsconfig.json.
