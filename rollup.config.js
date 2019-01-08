let pkg = require('./package.json');

module.exports = {
    input: 'src/main.js',
    output: [
        { file: pkg.module, format: 'es' },
        { file: pkg.main, format: 'umd', name: 'FocusLocker'},
    ]
}