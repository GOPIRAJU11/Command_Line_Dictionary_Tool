const http = require('http');
const args = process.argv;
const userargs = args.slice(2);
const userargslength = userargs.length;
const baseapi = 'http://fourtytwowords.herokuapp.com/';
const wordapi = baseapi + 'word.json/';
const wordsapi = baseapi + 'words.json/';
const api_key ='9e6759e60c71e91458f697bb4773fd5f70c151a3ac21a78745ef83c129217037abbf20f9d7c78a87ce47b962ef973ff938ba32676e4e6623d162cd2c35ce47c7e20ab9c12733be141662f80ce5fe3395';
const readline = require('readline');
var score=0;

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
var definitions = (word, callback) => {
  var url = '';
  api = word+'/definitions?api_key='+api_key;
  url = wordapi + api;
  apiRequest(url, (data) => {
    callback(data);
  });
};
var printDefinitions = (word) => {
  definitions(word, (data) => {
    if(data.length >= 1){
      console.log('\x1b[93m The definitions for the word "'+word+'": \x1b[0m');
      for(var index in data){
        console.log((parseInt(index)+1) +  '\t' + data[index].text);
      }
    }else{
      console.log('\x1b[31m No definitions found for the word "'+word+'" \x1b[0m');
    }
  });
};
var synonyms = (word, callback) => {
  var url = '';
  api = word+'/relatedWords?api_key='+api_key;
  url = wordapi + api;
  apiRequest(url, (data) => {
    callback(data);
  });
};
var printSynonyms = (word) => {
  synonyms(word, (data) => {
    if(data.length == 1){
      var words = data[0].words;
      console.log('\x1b[93m The synonyms for the word "'+word+'": \x1b[0m');
      for(var index in words){
        console.log((parseInt(index)+1) + '\t' +words[index]);
      }
    }else{
      console.log('\x1b[31m No synonyms found for the word "'+word+'" \x1b[0m');
    }
  });
};
var antonyms = (word, callback) => {
  var url = '';
  api = word+'/relatedWords?api_key='+api_key;
  url = wordapi + api;
  apiRequest(url, (data) => {
//console.log("antonyms "+data[0]);
    callback(data);

  });
}
var printAntonyms = (word) => {
  antonyms(word, (data) => {
    if(data.length == 2){
      var words1 = data[0].words;
 //console.log(data.length);
 //console.log(data[0]);
      console.log('\x1b[93m The antonyms for the word "'+word+'": \x1b[0m');
      for(var index in words1){
        console.log((parseInt(index)+1) + '\t' +words1[index]);
      }
    }else{
      console.log('\x1b[31m No antonyms found for the word "'+word+'" \x1b[0m');
    }
  });
};
var examples = (word) => {
  var url = '';
  api = word+'/examples?api_key='+api_key;
  url = wordapi + api;
  apiRequest(url, (data) => {
    if(!isEmpty(data)){
      var example_sentences = data.examples;
      console.log('\x1b[93m Example usages for the word "'+word+'": \x1b[0m');
      for(var index in example_sentences){
        console.log((parseInt(index)+1) +'\t'+ example_sentences[index].text);
      }
    }else{
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
  api = 'randomWord?api_key='+api_key;
  url = wordsapi + api;
  apiRequest(url, (data) => {
    if(!isEmpty(data)){
      callback(data);
    }else{
      console.log('\x1b[31m Sorry, unable to fetch the word of the day \x1b[0m');
    }
  });
};
var randomWord = (callback) => {
  var url = '';
  api = 'randomWord?api_key='+api_key;
  url = wordsapi + api;
  apiRequest(url, (data) => {
    if(!isEmpty(data)){
      callback(data);
    }else{
      console.log('\x1b[31m Sorry, unable to fetch the word of the day \x1b[0m');
    }
  });
};
