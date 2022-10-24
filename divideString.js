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
    let item = '';
    let parsingItem = false;
    let quoted = false;
    let escaped = false;

    for (let index = 0;index < string.length;index++) {
        const char = string[index];

        if (!escaped && char === escapeChar) {
            escaped = true;
            continue;
        }

        if (parsingItem) {
            if (escaped) { 
                escaped = false;
                item += char;
                continue;
            }

            if (!quoted) {
                if (char === separator) {
                    parsingItem = false;
                    items.push(item);
                    item = '';
                } else if (char === quoteChar) {
                    throw new DivideStringError('Unescaped quote', index);
                } else {
                    item += char;
                }
            } else {
                if (char === quoteChar) {
                    if (string[index+1] && string[index+1] !== separator) {
                        throw new DivideStringError('Unescaped quote', index);
                    }
                    parsingItem = false;
                    items.push(item);
                    item = '';
                } else {
                    item += char;
                } 
            }
        } else {
            if (escaped) { 
                escaped = false;
                quoted = false;
                parsingItem = true;
                item += char;
                continue;
            }

            if (char === separator) {
                continue;
            } else if (char === quoteChar) {
                quoted = true;
                parsingItem = true;
                continue;
            } else {
                quoted = false;
                parsingItem = true;
                item += char;
                continue;
            }
        }
    }

    if (parsingItem) {
        if (!quoted) {
            items.push(item);
        } else {
            throw new DivideStringError('Unfinished quoted item', string.length);
        }
    }

    return items
}

class DivideStringError extends Error {
    constructor(message, index) {
        super(message + ` at index ${index}!`);
    }
}