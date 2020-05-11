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
