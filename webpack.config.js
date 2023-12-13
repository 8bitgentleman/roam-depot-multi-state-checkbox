module.exports = {
    externals: {
        react: "React",
        "chrono-node": "ChronoNode"
    },
    externalsType: "window",
    entry: './src/index.js',
    output: {
        filename: 'extension.js',
        path: __dirname,
        library: {
            type: "module",
        }
    },
    experiments: {
        outputModule: true,
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // This will apply the loader to both .js and .jsx files
                exclude: /node_modules/, // This will exclude files in the node_modules directory
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Use the presets for both modern JavaScript and React JSX
                    },
                },
            },
            // ... (other rules)
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'], // This will allow you to import .jsx files without needing to add the extension
    },
};
