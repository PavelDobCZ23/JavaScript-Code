/**
 * Function that divides string in an advanced way including quoting and escaping.
 * @param {string} string String to divide.
 * @param {object} options Options that define characters involved in the dividing.
 * @param {string} options.quoteChar Character used for enclosing items.
 * @param {string} options.escapeChar Character used for literally escaping the following character.
 * @param {string} options.separator Character used for separating the items.
 * @returns {string[]} Items divided from the string.
 */
function divideString(string, options = {quoteChar:'\"',escapeChar:'\\',separator:' '}) {
    const {quoteChar,escapeChar,separator} = options;
    const items = [];
    let itemIndex = -1;
    let parsingItem, escaped, quoted;

    for (let charIndex = -1;charIndex < string.length;charIndex++) {
        const char = string[charIndex];
        const nextChar = string[charIndex+1];

        if (!escaped && char === escapeChar) {
            escaped = true;
            continue;
        }
        if (parsingItem) {
            if (quoted) {
                if (!escaped && char === quoteChar) {
                    if (nextChar === separator || nextChar == null) {
                        parsingItem = false;
                        quoted = false;
                    } else {
                        throw new DivideStringError('Unescaped quote', charIndex);
                    }
                } else {
                    if (nextChar == null) {
                        throw new DivideStringError('Unfinished quote', charIndex+1);
                    }
                    items[itemIndex] += char;
                }
            } else {
                items[itemIndex] += char;
                if (!escaped) {
                    if (char === quoteChar) {
                        throw new DivideStringError('Unescaped quoted item', charIndex)
                    }
                }
                if (nextChar === separator) {
                    parsingItem = false;
                }
            }
        } else {
            if (nextChar !== separator && nextChar != null){
                parsingItem = true;
                items.push('');
                itemIndex++;
            }
            if (nextChar === quoteChar) {
                quoted = true;
                charIndex++;
            }
        }
        if (escaped) {
            escaped = false;
        }
    }

    return items
}

class DivideStringError extends Error {
    constructor(message, index) {
        super(message + ` at index ${index}!`);
    }
}