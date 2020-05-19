const args = process.argv;
const userArgs = args.slice(2);
const userArgslength = userArgs.length;
var allFunctions = require("./wordApi.js");
var game = require("./wordGame.js");
var startDictionary = () => {
    if (userArgslength == 0) {
        allFunctions.wordOftheDay().then((data) => {
			data=JSON.parse(data);
			console.log('\x1b[93m Word of the Day - Dictionary: \x1b[0m');
            allFunctions.dictionary(data.word);
        })
    } else if (userArgslength == 1) {
        var word = userArgs[0];
        switch (word) {
            case 'play':
                game.playgame();
                break;
            case 'help':
                allFunctions.printHelp();
                break;
            default:
                console.log('\x1b[93m The dictionary for the word "' + word + '": \x1b[0m');
                allFunctions.dictionary(word);
        }
    } else if (userArgslength == 2) {
        var word = userArgs[1];
        var url = '';
        switch (userArgs[0]) {
            case 'def':
                allFunctions.printDefinitions(word);
                break;
            case 'syn':
                allFunctions.printSynonyms(word);
                break;
            case 'ant':
                allFunctions.printAntonyms(word);
                break;
            case 'ex':
                allFunctions.examples(word);
                break;
            case 'dict':
                console.log('\x1b[93m The dictionary for the word "' + word + '": \x1b[0m');
                allFunctions.dictionary(word);
                break;
            default:
                printHelp();
        }
    } else {
        printHelp();
    }
};
startDictionary();
