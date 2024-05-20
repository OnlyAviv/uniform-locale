const { RuleTester } = require('eslint');
const config = require('./plugin');
const utils = require('./src/utils'),

    ruleTester = new RuleTester();

function makeValidTests(words, locale) {
    return words.flatMap(word =>
        testCases.map(code => ({
            code: code.replace('%word%', word),
            options: [locale],
        }))
    );
}

const testCases = [
    // Comments
    `// Did you know that %word% is spelled differently in the US?`,
    `// Did you know that not_%word% is spelled differently in the US?`,
    `/* Did you know that %word% is spelled differently in the US? */`,
    `/* Did you know that not_%word% is spelled differently in the US? */`,

    // Strings
    `const test = '%word%';`,
    `const test = 'not_%word%';`,
    `const test = "%word%";`,
    `const test = "not_%word%";`,

    // Template literals
    `const test = \`%word%\`;`,
    `const test = \`not_%word%\`;`,

    // Variables
    `const %word% = 'test';`,
    `const not_%word% = 'test';`,

    // Function names
    `function %word%() {}`,
    `function not_%word%() {}`,

    // Function calls
    `test(%word%);`,
    `test(not_%word%);`,
    `%word%();`,
    `not_%word%();`,

    // Class names
    `class %word% {}`,
    `class not_%word% {}`,
    `new %word%();`,
    `new not_%word%();`,

    // Object keys
    `const obj = { %word%: 1 };`,
    `const obj = { not_%word%: 1 };`,
];

function makeInvalidTests(words, locale) {
    return words.flatMap(word =>
        testCases.map(code => {
            const replacement = utils.contextAwareReplacement(word, utils.getLocaleFunction(locale).get(word));
            return {
                options: [locale],
                code: code.replace('%word%', word),
                errors: [{
                    message: `Use ${utils.localeName(locale)} spelling "${replacement}" instead of ${utils.localeName(locale === 'US' ? 'GB' : 'US')} spelling "${word}"`,
                }],
                output: code.replace('%word%', replacement),
            };
        })
    );
}

ruleTester.run('consistent-spelling', config.rules['consistent-spelling'], {
    valid: makeValidTests([
        'color',
        'center',
        'favorite',
        'realize',
        'organize',
        'recognize',
        'apologize',
    ], 'US').concat(makeValidTests([
        'colour',
        'centre',
        'favourite',
        'realise',
        'organise',
        'recognise',
        'apologise',
    ], 'GB')),

    invalid: makeInvalidTests([
        'colour',
        'centre',
        'favourite',
        'realise',
        'organise',
        'recognise',
        'apologise',
    ], 'US').concat(makeInvalidTests([
        'color',
        'center',
        'favorite',
        'realize',
        'organize',
        'recognize',
        'apologize',
    ], 'GB')),
});
