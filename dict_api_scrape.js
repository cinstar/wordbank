const axios = require('axios');

const API_KEY = "667c02e3-50bf-4233-a954-b33d1264799a";

function removePatterns(definition) {
    // taking out the {bc} {sx} formatting around the words
    // function supplied by chatgpt
    const patternsToRemove = [/\{bc\}/g, /\{sx\|.*?\|\|\}/g];

    for (const pattern of patternsToRemove) {
        definition = definition.replace(pattern, '');
    }

    return definition;
}

async function getDefinitions(userWord, verbose = 0) {
    try {
        // get word definition from dictionaryAPI
        const response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${userWord}?key=${API_KEY}`);
        const resJson = response.data;

        if (response.status !== 200) {
            return "DictionaryAPI ran into an error. Try again";
        }

        const wordDefs = [];

        if ("def" in resJson[0]) {
            for (const definition of resJson[0]["def"][0]["sseq"]) {
                if (verbose === 1) {
                    console.log(definition);
                }

                let foundNested = false;

                while (typeof definition[0][1] !== 'undefined' && typeof definition[0][1] !== 'string') {
                    const extraDefs = definition[0][1];
                    for (const nestedDef of extraDefs) {
                        if (verbose === 1) {
                            console.log(nestedDef[1]['dt'][0][1]);
                        }
                        const cleanedDef = removePatterns(nestedDef[1]['dt'][0][1]);
                        const trimmedDef = cleanedDef.trim(' ,');
                        if (trimmedDef !== '') {
                            wordDefs.push(trimmedDef);
                        }
                    }
                    foundNested = true;
                    break;
                }
                if (foundNested) {
                    continue;
                }

                if (typeof definition[0][1] !== 'undefined' && 'dt' in definition[0][1]) {
                    if (verbose === 1) {
                        console.log(definition[0][1]['dt'][0][1]);
                    }
                    const cleanedDef = removePatterns(definition[0][1]['dt'][0][1]);
                    const trimmedDef = cleanedDef.trim(' ,');
                    if (trimmedDef !== '') {
                        wordDefs.push(trimmedDef);
                    }
                }
            }
        } else {
            wordDefs.push(`No direct definition listed, word stems: ${resJson[0]['meta']['stems']}`);
        }

        return wordDefs;
    } catch (error) {
        console.error("Error:", error.message);
        return "Error occurred while fetching definitions.";
    }
}

// // Testing
// getDefinitions('run', 0).then(res => console.log(res));

// // Save file to JSON
// // Replace "run" with the word you're looking for

// const myWord = "walked";
// getDefinitions(myWord, 0).then(res => {
//     const fs = require('fs');
//     fs.writeFileSync(`${myWord}_definition.json`, JSON.stringify(res, null, 2));
// });