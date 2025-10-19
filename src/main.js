const fs = require('fs');
const path = require('path');
const { Tokenizer } = require('./tokenizer');

function main() {
    // read input file from teste folder
    const inputFileName = process.argv[2] || 'input.txt';
    
    // build correct path starting from src folder
    const projectRoot = path.resolve(__dirname, '..');
    const inputFile = path.join(projectRoot, 'teste', inputFileName);
    
    // check if file exists
    if (!fs.existsSync(inputFile)) {
        console.error(`fisierul ${inputFile} nu exista`);
        console.log(`cautare in: ${path.join(projectRoot, 'teste')}`);
        return;
    }

    // read file content
    const input = fs.readFileSync(inputFile, 'utf-8');

    console.log(`fisier: ${inputFile}\n`);
    console.log('tokeni gasiti:\n');

    // initialize tokenizer
    const tokenizer = new Tokenizer();
    tokenizer.init(input);

    // scan all tokens
    let token;
    while ((token = tokenizer.getNextToken()) !== null) {
        if (token.type === 'ERROR') {
            // display lexical error
            console.log(`eroare: ${token.error} pe ${token.line}`);
        } else {
            // display token in required format
            console.log(`'${token.value}', ${token.type}; ${token.length}; ${token.line}`);
        }
    }
    
}

// run the program
main();