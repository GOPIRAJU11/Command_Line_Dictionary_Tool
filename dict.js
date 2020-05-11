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
var printGameRetryText = () => {
  console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
  console.log('\x1b[31m You have entered incorrect word.  \x1b[0m');
  console.log('Choose the options from below menu:');
  console.log('\t1. Try Again');
  console.log('\t2. Hint');
  console.log('\t3. Skip');
};
function permutations(str){
  if (str.length === 1)
      return str;
  var permut = [];
  for (var i=0; i<str.length; i++){
      var s = str[0];
      var _new =  permutations(str.slice(1, str.length));
      for(var j=0; j<_new.length; j++)
          permut.push(s + _new[j]);
      str = str.substr(1, str.length -1) + s;
  }
  return permut; }

var playgame = () => {
	var game_word;
	var game_word_synonyms;
	var game_word_definitions = new Array();
	var hint = [];
	randomWord((data) => {
   // console.log('Random Word is: ' + data.word);
    	game_word = data.word.replace(" ", "%20");
    //console.log('Game Word: ' + game_word);
    	definitions(game_word, (data) => {
      	if(data.length >= 1){
        for(var index in data)
		{
            game_word_definitions[index] =  data[index].text;
 			hint.push({type:'definition',value:data[index].text})
        }
        //console.log('Length of definition array : ' + game_word_definitions.length);
      }
	  else
	  {
        console.log('\x1b[31m Error occured in the process.\nProcess will exit now. \x1b[0m');
        process.exit();
      }
		//user can guess synonyms also
      synonyms(game_word, (data) => 
	  {
      	
        var hasSynonyms = false;
        if(data.length >= 1){
        	hasSynonyms = true;
            game_word_synonyms = data[0].words;
 			//console.log(data[0]);
 
		for (var index in data[0].words)
		{
			var temp = data[0].relationshipType;
			hint.push({type:[temp],value:data[0].words[index]});
		}
		if(data.length==2)
		{
			for (var index in data[1].words)
			{
				var temp = data[1].relationshipType;
				hint.push({type:[temp],value:data[1].words[index]});
			}

		}
 		//console.log(hint);
         //console.log('The Length of synonyms: ' + game_word_synonyms.length);
         //console.log('synonyms : '+game_word_synonyms);
 
      }
      const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
      });
      console.log('Press "Ctrl + C" to exit the program.');
      console.log('Find the word with the following definition');
      console.log('Definition :\n\t'+game_word_definitions[0]);
	  console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
      console.log('Type the word and press the ENTER key.');
      rl.on('line', (input) => {
          var correctAnswer = false;
          if(hasSynonyms){
            	for(var index in game_word_synonyms){
              		if(`${input}` == game_word_synonyms[index]){
                		console.log('Congratulations! You have entered correct synonym for the word "'+game_word+'"');
                		rl.close();
                		correctAnswer = true;
						score=score+10;
						console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
              		}
            	}
          }
          if(`${input}` === game_word){
          	console.log('Congratulations! You have entered correct word.');
			score=score+10;
			console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
            rl.close();
          }
		  else
		  {
           	if(`${input}` == '3'){
             	rl.close();
            }
            if(!(`${input}` == '1' || `${input}` == '2' || `${input}` == '3') && !correctAnswer){
              	printGameRetryText();
            }
            switch(parseInt(`${input}`)){
              case 1:
                console.log('Please try to guess the word again:');
				if(score-2>=0)
				{
					score=score-2;
				}
				else{
					score=0;
				}
				console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
              	break;
              case 2:
              	var randomNumber = Math.floor((Math.random() * parseInt(game_word_definitions.length)) + 1);
                //console.log('Random Number : ' + randomNumber);
                if(randomNumber == game_word_definitions.length){
                  randomNumber = game_word_definitions.length - 1;
                }
				if(score-3>=0)
				{
					score=score-3;
				}
				else{
					score=0;
				}
                console.log('Hint:');
				var randomNumber = Math.floor((Math.random() * hint.length));
                console.log(hint[randomNumber].type+"   :  "+hint[randomNumber].value);
			    	if(hint[randomNumber].type=='synonym')
				{
					for(var index in game_word_synonyms)
						{
							if(hint[randomNumber].value==game_word_synonyms[index])
								{
									game_word_synonyms.splice(index,1);
								}
						}
				}
				hint.splice(randomNumber,1);
				//console.log("hintlength",hint.length);
				if(hint.length==0){
					var ana = permutations(game_word);
					for (var index in ana){
						hint.push({type:"jumbled",value:ana[index]});
					}
				}
                console.log('\nTry to guess the word again using the hint provided.');
				console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
                console.log('Enter the word:');
              break;
              case 3:
                console.log('The correct word is : ' + game_word);
                console.log('Thank you for trying out this game. \nGame Ended.');
				if(score-4>=0)
				{
					score=score-4;
				}
				else{
					score=0;
				}
				console.log('\x1b[93m Your score is "'+score+'": \x1b[0m');
                rl.close();
              break;
              default:
            }
          }
        });
      });
    });
  });
};
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
var startDictionary = () => {
  if(userargslength == 0){
    wordOftheDay((data) => {
      console.log('\x1b[93m Word of the Day - Dictionary: \x1b[0m');
      dictionary(data.word);
    });
  }else if(userargslength == 1){
    var word = userargs[0];
    switch(word){
      case 'play':
        playgame();
        break;
        case 'help':
        printHelp();
        break;
      default:
        console.log('\x1b[93m The dictionary for the word "'+word+'": \x1b[0m');
        dictionary(word);
    }
  }else if(userargslength == 2){
    var word = userargs[1];
    var url = '';
    switch(userargs[0]) {
        case 'def':
          printDefinitions(word);
          break;
        case 'syn':
          printSynonyms(word);
          break;
        case 'ant':
          printAntonyms(word);
          break;
        case 'ex':
          examples(word);
          break;
        case 'dict':
          console.log('\x1b[93m The dictionary for the word "'+word+'": \x1b[0m');
          dictionary(word);
          break;
        default:
          printHelp();
    }
  }else{
    printHelp();
  }
};
startDictionary();		 
