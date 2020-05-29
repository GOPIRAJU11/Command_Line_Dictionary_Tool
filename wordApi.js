const http = require('http');
const args = process.argv;
const userArgs = args.slice(2);
const userArgslength = userArgs.length;
const baseApi = 'http://fourtytwowords.herokuapp.com/';
const wordApi = baseApi + 'word.json/';
const wordsApi = baseApi + 'words.json/';
const api_key = '9e6759e60c71e91458f697bb4773fd5f70c151a3ac21a78745ef83c129217037abbf20f9d7c78a87ce47b962ef973ff938ba32676e4e6623d162cd2c35ce47c7e20ab9c12733be141662f80ce5fe3395';
const readline = require('readline');

function apiRequestPromises(url) {
    const promiseToken = new Promise((resolve, reject) => {
        http.get(url, (res) => {
            var rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                resolve(rawData);
            });

        });
    });
    return promiseToken;
}

function printDefinitions(word) {
    const promiseToken = definitions(word);
    promiseToken.then((promisedData) => {
            if (promisedData.length >= 1) {
                console.log('\x1b[93m The definitions for the word "' + word + '": \x1b[0m');
                promisedData = JSON.parse(promisedData);
                for (var index in promisedData) {
                    console.log((parseInt(index) + 1) + '\t' + (promisedData[index].text));
                }
            } else {
                console.log('\x1b[31m No definitions found for the word "' + word + '" \x1b[0m');
            }
        })
        .catch();
}

var definitions = (word) => {
    var url = '';
    api = word + '/definitions?api_key=' + api_key;
    url = wordApi + api;
    return apiRequestPromises(url);
};

var synonyms = (word) => {
    var url = '';
    api = word + '/relatedWords?api_key=' + api_key;
    url = wordApi + api;
    return apiRequestPromises(url);
};

var printSynonyms = (word) => {
    synonyms(word).then((data) => {
        data = JSON.parse(data)
        if (data.length == 1) {
            var words = data[0].words;
            console.log('\x1b[93m The synonyms for the word "' + word + '": \x1b[0m');
            for (var index in words) {
                console.log((parseInt(index) + 1) + '\t' + words[index]);
            }
        } else {
            console.log('\x1b[31m No synonyms found for the word "' + word + '" \x1b[0m');
        }
    });
};
var antonyms = (word) => {
    var url = '';
    api = word + '/relatedWords?api_key=' + api_key;
    url = wordApi + api;
    return apiRequestPromises(url);
}

var printAntonyms = (word) => {
    antonyms(word).then((data) => {
        data = JSON.parse(data)
        if (data.length == 2) {
            var words1 = data[0].words;
            console.log('\x1b[93m The antonyms for the word "' + word + '": \x1b[0m');
            for (var index in words1) {
                console.log((parseInt(index) + 1) + '\t' + words1[index]);
            }
        } else {
            console.log('\x1b[31m No antonyms found for the word "' + word + '" \x1b[0m');
        }
    });
};

function examples(word) {
    const promiseToken = apiRequestPromises(wordApi + word + '/examples?api_key=' + api_key);
    promiseToken.then((promisedData) => {
        if (promisedData.length >= 1) {
            console.log('\x1b[93m The examples for the word "' + word + '": \x1b[0m');
            promisedData = JSON.parse(promisedData);
            promisedData = promisedData.examples;
            for (var index in promisedData) {
                console.log((parseInt(index) + 1) + '\t' + promisedData[index].text);
            }
        } else {
            console.log('\x1b[31m No examples found for the word "' + word + '" \x1b[0m');
        }
    }).catch(error => {
        console.log(error);

    });
}

var dictionary = (word) => {
    printDefinitions(word);
    printSynonyms(word);
    printAntonyms(word);
    examples(word);
    let promise = new Promise((resolve, reject) => {
        resolve(123);
    });
    return promise;
};

var isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

var wordOftheDay = () => {
    var url = '';
    api = 'randomWord?api_key=' + api_key;
    url = wordsApi + api;
    return apiRequestPromises(url);
};

function randomWord() {
    var url = '';
    api = 'randomWord?api_key=' + api_key;
    url = wordsApi + api;
    return apiRequestPromises(url);
}

function permutations(str) {
    if (str.length === 1)
        return str;
    var permut = [];
    for (var i = 0; i < str.length; i++) {
        var s = str[0];
        var _new = permutations(str.slice(1, str.length));
        for (var j = 0; j < _new.length; j++)
            permut.push(s + _new[j]);
        str = str.substr(1, str.length - 1) + s;
    }
    return permut;
}
var printHelp = () => {
    console.log('The possible commands are:');
    console.log('\t1.dict def <word>');
    console.log('\t2.dict syn <word>');
    console.log('\t3.dict ant <word>');
    console.log('\t4.dict ex <word>');
    console.log('\t5.dict dict <word>');
    console.log('\t6.dict <word>');
    console.log('\t7.dict play');
};
module.exports = {
    definitions,
    synonyms,
    permutations,
    randomWord,
    wordOftheDay,
    dictionary,
    printHelp,
    printDefinitions,
    printSynonyms,
    printAntonyms,
    examples
};
