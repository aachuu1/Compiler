const Spec = [
    // whitespace 
    [/^\s+/, null],
    
    // comments
    [/^\/\/[^\n]*/, 'comment'],
    [/^\/\*[\s\S]*?\*\//, 'comment'],
    
    // keywords 
    [/^\bif\b/, 'key_word'],
    [/^\belse\b/, 'key_word'],
    [/^\bwhile\b/, 'key_word'],
    [/^\bfor\b/, 'key_word'],
    [/^\bdo\b/, 'key_word'],
    [/^\bbreak\b/, 'key_word'],
    [/^\bcontinue\b/, 'key_word'],
    [/^\breturn\b/, 'key_word'],
    [/^\bfunction\b/, 'key_word'],
    [/^\bconst\b/, 'key_word'],
    [/^\blet\b/, 'key_word'],
    [/^\bvar\b/, 'key_word'],
    [/^\bvoid\b/, 'key_word'],
    [/^\bint\b/, 'key_word'],
    [/^\bfloat\b/, 'key_word'],
    [/^\bchar\b/, 'key_word'],
    [/^\bdouble\b/, 'key_word'],
    [/^\bmain\b/, 'key_word'],
    [/^\btrue\b/, 'key_word'],
    [/^\bfalse\b/, 'key_word'],
    [/^\bnull\b/, 'key_word'],
    
    // numbers 
    [/^\d+\.\d+/, 'float_constant'],
    [/^\.\d+/, 'float_constant'],
    [/^\d+/, 'int_constant'],
    
    // strings
    [/^"[^"]*"/, 'string_constant'],
    [/^'[^']*'/, 'string_constant'],
    
    // identifiers 
    [/^[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
    
    // operators 
    [/^==/, 'operator'],
    [/^!=/, 'operator'],
    [/^<=/, 'operator'],
    [/^>=/, 'operator'],
    [/^&&/, 'operator'],
    [/^\|\|/, 'operator'],
    [/^\+\+/, 'operator'],
    [/^--/, 'operator'],
    [/^\+=/, 'operator'],
    [/^-=/, 'operator'],
    [/^\*=/, 'operator'],
    [/^\/=/, 'operator'],
    [/^%=/, 'operator'],
    [/^=/, 'operator'],
    [/^\+/, 'operator'],
    [/^-/, 'operator'],
    [/^\*/, 'operator'],
    [/^\//, 'operator'],
    [/^%/, 'operator'],
    [/^</, 'operator'],
    [/^>/, 'operator'],
    [/^!/, 'operator'],
    [/^&/, 'operator'],
    [/^\|/, 'operator'],
    [/^\^/, 'operator'],
    [/^~/, 'operator'],
    
    // delimiters
    [/^\{/, 'delimitator'],
    [/^\}/, 'delimitator'],
    [/^\(/, 'delimitator'],
    [/^\)/, 'delimitator'],
    [/^\[/, 'delimitator'],
    [/^\]/, 'delimitator'],
    [/^;/, 'delimitator'],
    [/^,/, 'delimitator'],
    [/^\./, 'delimitator'],
    [/^:/, 'delimitator'],
];

class Tokenizer {
    // initialize tokenizer with input string
    init(string) {
        this._string = string;
        this._cursor = 0;
        this._line = 1;
        this._lineStart = 0;
    }

    // check if there are more tokens to process
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    // check if end of file is reached
    isEOF() {
        return this._cursor >= this._string.length;
    }

    // get next token from input
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);
        const startCursor = this._cursor;
        const startLine = this._line;

        // try to match each pattern in Spec
        for (const [regex, tokenType] of Spec) {
            const tokenValue = this._match(regex, string);
            
            if (tokenValue == null) {
                continue;
            }

            // count lines for multi-line tokens
            const endLine = this._line;
            const length = tokenValue.length;

            // skip whitespace
            if (tokenType == null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue,
                length: length,
                line: startLine === endLine ? `linia ${startLine}` : `liniile ${startLine}-${endLine}`,
                startLine: startLine,
                endLine: endLine,
                pointer: startCursor
            };
        }

        // lexical error - invalid character
        const invalidChar = string[0];
        this._cursor++; // advance to continue scanning
        
        // update line number if newline
        if (invalidChar === '\n') {
            this._line++;
            this._lineStart = this._cursor;
        }

        return {
            type: 'ERROR',
            value: invalidChar,
            length: 1,
            line: `linia ${this._line}`,
            startLine: this._line,
            endLine: this._line,
            pointer: startCursor,
            error: `Eroare lexicală: caracter ilegal '${invalidChar}'`
        };
    }

    // match regex pattern and advance cursor
    _match(regex, string) {
        const matched = regex.exec(string);
        if (matched === null) {
            return null;
        }

        const value = matched[0];
        
        // count newlines in matched token
        for (let i = 0; i < value.length; i++) {
            if (value[i] === '\n') {
                this._line++;
                this._lineStart = this._cursor + i + 1;
            }
        }

        this._cursor += value.length;
        return value;
    }
}

module.exports = {
    Tokenizer
};