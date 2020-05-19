const http = require('http');
const args = process.argv;
const userArgs = args.slice(2);
const userArgslength = userArgs.length;
const baseApi = 'http://fourtytwowords.herokuapp.com/';
const wordApi = baseApi + 'word.json/';
const wordsApi = baseApi + 'words.json/';
const api_key = '9e6759e60c71e91458f697bb4773fd5f70c151a3ac21a78745ef83c129217037abbf20f9d7c78a87ce47b962ef973ff938ba32676e4e6623d162cd2c35ce47c7e20ab9c12733be141662f80ce5fe3395';
const readline = require('readline');
var apiRequest = (url, callback) => {
    http.get(url, (res) => {
        res.setEncoding('utf8');
        var rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                var parsedData = JSON.parse(rawData);
                callback(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (err) => {
        console.error(err);
    });
};

function apiRequestPromises (url) {
	const promiseToken = new Promise((resolve,reject) =>{
		http.get(url, (res) => {
		var rawData = '';
    	res.on('data', (chunk) => rawData += chunk);
    	res.on('end', () => resolve(rawData));
		
    });
	});
  return promiseToken;
}
function printDefinitions (word) {
		const promiseToken = apiRequestPromises(wordApi+word+'/definitions?api_key='+api_key);
		promiseToken.then((promisedData) =>
		{
			if(promisedData.length >= 1){
      			console.log('\x1b[93m The definitions for the word "'+word+'": \x1b[0m');
				console.log(JSON.parse(promisedData)[0].text);
      			for(var index in promisedData)
					{
       			 		console.log((parseInt(index)+1) +  '\t' + JSON.parse(promisedData)[index].text);
      				}
      			}
			else{
      			console.log('\x1b[31m No definitions found for the word "'+word+'" \x1b[0m');
    			}
			});
		}

var definitions = (word, callback) => {
    var url = '';
    api = word + '/definitions?api_key=' + api_key;
    url = wordApi + api;
    apiRequest(url, (data) => {
        callback(data);
    });
};

var synonyms = (word, callback) => {
    var url = '';
    api = word + '/relatedWords?api_key=' + api_key;
    url = wordApi + api;
    apiRequest(url, (data) => {
        callback(data);
    });
};

var printSynonyms = (word) => {
    synonyms(word, (data) => {
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

var antonyms = (word, callback) => {
    var url = '';
    api = word + '/relatedWords?api_key=' + api_key;
    url = wordApi + api;
    apiRequest(url, (data) => {
        callback(data);

    });
}

var printAntonyms = (word) => {
    antonyms(word, (data) => {
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

function examples (word) {
		const promiseToken = apiRequestPromises(wordApi+word+'/examples?api_key='+api_key);
		promiseToken.then((promisedData) =>
		{
			if(promisedData.length >= 1){
      			console.log('\x1b[93m The examples for the word "'+word+'": \x1b[0m');
      			for(var index in promisedData)
					{
       			 		console.log((parseInt(index)+1) +  '\t' + JSON.parse(promisedData).examples[index].text);
      				}
      			}
			else{
      			console.log('\x1b[31m No examples found for the word "'+word+'" \x1b[0m');
    			}
			});
		}

var dictionary = (word) => {
    printDefinitions(word);
    printSynonyms(word);
    printAntonyms(word);
    examples(word);
};

var isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

var wordOftheDay = (callback) => {
    var url = '';
    api = 'randomWord?api_key=' + api_key;
    url = wordsApi + api;
    apiRequest(url, (data) => {
        if (!isEmpty(data)) {
            callback(data);
        } else {
            console.log('\x1b[31m Sorry, unable to fetch the word of the day \x1b[0m');
        }
    });
};

function randomWord(callback) {
    var url = '';
    api = 'randomWord?api_key=' + api_key;
    url = wordsApi + api;
    apiRequest(url, (data) => {
        if (!isEmpty(data)) {
            callback(data);
        } else {
            console.log('\x1b[31m Sorry, unable to fetch the word of the day \x1b[0m');
        }
    });
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
    apiRequest,
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
