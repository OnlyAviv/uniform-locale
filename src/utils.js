const words = require('./words.json');

function getBritish(american) {
    // Truthy + Value = American was converted to British
    // Falsy = American was not converted to British (Maybe it was already British)
    return words[american]?.[0] || false;
}

const wordKeys = Object.keys(words);
function getAmerican(british) {
    // Truthy + Value = British was converted to American
    // Falsy = British was not converted to American (Maybe it was already American)
    return wordKeys.find(key => words[key][0] === british) || false;
}

function isAmerican(word) {
    return !getAmerican(word);
}

function isBritish(word) {
    return !getBritish(word);
}

function localeName(locale) {
    return locale === 'US' ? 'American' : 'British';
}

function contextAwareReplacement(orginal, replacement) {
    if (orginal === orginal.toLowerCase()) {return replacement.toLowerCase();}
    if (orginal === orginal.toUpperCase()) {return replacement.toUpperCase();}
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
}

function extractWords(text, offset) {
    const result = [],
        regex = /[A-Z]?[a-z]+/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        const word = match[0],
            startIndex = match.index + offset,
            endIndex = startIndex + word.length;
        result.push([word, startIndex, endIndex]);
    }
    
    return result;
}

function getLocaleFunction(locale) {
    return {
        get: locale === 'US' ? getAmerican : getBritish,
        is: locale === 'US' ? isAmerican : isBritish,
    };
}

function createLintRule() {
    function checkWord(node, [word, start, end], context, LocaleFunctions = getLocaleFunction(context.options[0])) {
        const locale = context.options[0] || 'US';
        if (LocaleFunctions.is(word)) {return;}
        const replacement = contextAwareReplacement(word, LocaleFunctions.get(word));
        context.report({
            node,
            message: `Use ${localeName(locale)} spelling "${replacement}" instead of ${localeName(locale === 'US' ? 'GB' : 'US')} spelling "${word}"`,
            fix(fixer) {
                return fixer.replaceTextRange([start, end], replacement);
            },
        });
    }

    return {
        meta: {
            type: 'suggestion',
            docs: {
                description: 'Enforce consistent spelling based on locale',
                category: 'Stylistic Issues',
                recommended: true,
            },
            fixable: 'code',
            hasSuggestions: true,
            schema: [
                { enum: ['US', 'GB'] }
            ]
        },
        
        create(context) {
            const LocaleFunctions = getLocaleFunction(context.options[0] || 'US');
            return {
                Program: (node) => {
                    const text = context.getSourceCode().getText(),
                        words = extractWords(text, 0);
                    words.forEach(word => checkWord(node, word, context, LocaleFunctions));
                }
            };
        },
    };
};

module.exports = { getAmerican, getBritish, isAmerican, isBritish, localeName, contextAwareReplacement, getLocaleFunction, createLintRule };