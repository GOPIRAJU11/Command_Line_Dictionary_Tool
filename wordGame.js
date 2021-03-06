var ApiFunctions = require("./wordApi.js");
var score = 0;
const readline = require('readline');

async function playgame() {
    var game_word;
    var game_word_synonyms;
    var gameWordValues = [];
    var hasSynonyms = false;

    var data = await ApiFunctions.randomWord();
    data = JSON.parse(data);
    game_word = data.id;

    Promise.all([ApiFunctions.synonyms(game_word), ApiFunctions.definitions(game_word)]).then(results => {
            synonymData = results[0];
            definitionData = results[1];
            synonymData = JSON.parse(synonymData);
            if (synonymData.length >= 1) {
                hasSynonyms = true;
                game_word_synonyms = synonymData[0].words;
                for (var index in synonymData[0].words) {
                    var temp = synonymData[0].relationshipType;
                    gameWordValues.push({
                        type: [temp],
                        value: synonymData[0].words[index]
                    });
                }
                if (synonymData.length == 2) {
                    for (var index in synonymData[1].words) {
                        var temp = synonymData[1].relationshipType;
                        gameWordValues.push({
                            type: [temp],
                            value: synonymData[1].words[index]
                        });
                    }

                }

            }
            definitionData = JSON.parse(definitionData);
            if (definitionData.length >= 1) {
                for (var index in definitionData) {
                    gameWordValues.push({
                        type: 'definition',
                        value: definitionData[index].text
                    })
                }
            } else {
                console.log('\x1b[31m Error occured in the process.\nProcess will exit now. \x1b[0m');
                process.exit();
            }


            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            console.log('Press "Ctrl + C" to exit the program.');
            var randomNumber = Math.floor((Math.random() * gameWordValues.length));
            console.log('Find the word with the following ' + gameWordValues[randomNumber].type);
            console.log(gameWordValues[randomNumber].type + "   :  " + gameWordValues[randomNumber].value);
            if (gameWordValues[randomNumber].type == 'synonym') {
                for (var index in game_word_synonyms) {
                    if (gameWordValues[randomNumber].value == game_word_synonyms[index]) {
                        game_word_synonyms.splice(index, 1);
                    }
                }
            }
            gameWordValues.splice(randomNumber, 1);
            console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
            console.log('Type the word and press the ENTER key.');
            rl.on('line', (input) => {
                var correctAnswer = false;
                if (`${input}` === game_word) {
                    console.log('Congratulations! You have entered correct word.');
                    correctAnswer = true;
                    score = score + 10;
                    console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
                    rl.close();
                    playgame();
                } else {

                    if (hasSynonyms) {
                        for (var index in game_word_synonyms) {
                            if (`${input}` === game_word_synonyms[index]) {
                                console.log('Congratulations! You have entered correct synonym for the word "' + game_word + '"');
                                rl.close();
                                correctAnswer = true;
                                score = score + 10;
                                console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
                                playgame();
                            }
                        }
                    }
                    if (`${input}` == '3') {
                        rl.close();
                    }
                    if (!(`${input}` == '1' || `${input}` == '2' || `${input}` == '3') && !correctAnswer) {
                        printGameRetryText();
                    }
                    switch (parseInt(`${input}`)) {
                        case 1:
                            console.log('Please try to guess the word again:');
                            if (score - 2 >= 0) {
                                score = score - 2;
                            } else {
                                score = 0;
                            }
                            console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
                            break;
                        case 2:
                            if (score - 3 >= 0) {
                                score = score - 3;
                            } else {
                                score = 0;
                            }
                            console.log('Hint:');
                            var randomNumber = Math.floor((Math.random() * gameWordValues.length));
                            console.log(gameWordValues[randomNumber].type + "   :  " + gameWordValues[randomNumber].value);
                            if (gameWordValues[randomNumber].type == 'synonym') {
                                for (var index in game_word_synonyms) {
                                    if (gameWordValues[randomNumber].value == game_word_synonyms[index]) {
                                        game_word_synonyms.splice(index, 1);
                                    }
                                }
                            }
                            gameWordValues.splice(randomNumber, 1);
                            if (gameWordValues.length == 0) {
                                var jumble = ApiFunctions.permutations(game_word);
                                for (var index in jumble) {
                                    gameWordValues.push({
                                        type: "jumbled",
                                        value: jumble[index]
                                    });
                                }
                            }
                            console.log('\nTry to guess the word again using the hint provided.');
                            console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
                            console.log('Enter the word:');
                            break;
                        case 3:
                            console.log('\x1b[93m The correct word is : "' + game_word + '" \x1b[0m');
                            console.log('Thank you for trying out this game. \nGame Ended.');
                            if (score - 4 >= 0) {
                                score = score - 4;
                            } else {
                                score = 0;
                            }
                            console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
                            ApiFunctions.dictionary(game_word).then((results) => {
                                playgame();
                            });
                            break;
                        default:
                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
};

var printGameRetryText = () => {
    console.log('\x1b[93m Your score is "' + score + '": \x1b[0m');
    console.log('\x1b[31m You have entered incorrect word.  \x1b[0m');
    console.log('Choose the options from below menu:');
    console.log('\t1. Try Again');
    console.log('\t2. Hint');
    console.log('\t3. Skip');
};

module.exports = {
    playgame
};
