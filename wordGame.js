var ApiFunctions = require("./wordApi.js");
var score = 0;
const readline = require('readline');

function playgame() {
    var game_word;
    var game_word_synonyms;
    var gameWordValues = [];
    var hasSynonyms = false;

    ApiFunctions.randomWord().then((data) => {
        data = JSON.parse(data);
        game_word = data.word.replace(" ", "%20");
        ApiFunctions.synonyms(game_word).then((data) => {
            data = JSON.parse(data);
            if (data.length >= 1) {
                hasSynonyms = true;
                game_word_synonyms = data[0].words;
                for (var index in data[0].words) {
                    var temp = data[0].relationshipType;
                    gameWordValues.push({
                        type: [temp],
                        value: data[0].words[index]
                    });
                }
                if (data.length == 2) {
                    for (var index in data[1].words) {
                        var temp = data[1].relationshipType;
                        gameWordValues.push({
                            type: [temp],
                            value: data[1].words[index]
                        });
                    }

                }

            }
        });
	    
        ApiFunctions.definitions(game_word).then((data) => {
            data = JSON.parse(data);
            if (data.length >= 1) {
                for (var index in data) {
                    gameWordValues.push({
                        type: 'definition',
                        value: data[index].text
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
                                        console.log('synonyms : ' + game_word_synonyms);
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
                            ApiFunctions.dictionary(game_word);
                            playgame();
                            break;
                        default:
                    }
                }
            });
        });

    });
}

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
