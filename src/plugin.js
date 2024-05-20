const utils = require('./utils'),

    plugin = {
        meta: {
            name: 'eslint-plugin-uniform-locale',
            version: '1.0.0',
        },
        configs: {},
        rules: {
            'consistent-spelling': utils.createLintRule(),
        },
        processors: {}
    };

module.exports = plugin;