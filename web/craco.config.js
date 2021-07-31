module.exports = {
    webpack: {
        devtool: "none",
        configure:{
            // See https://github.com/webpack/webpack/issues/6725
            module:{
                rules: [{
                    test: /\.wasm$/,
                    type: 'javascript/auto',
                }]
            }
        }
    }
};
