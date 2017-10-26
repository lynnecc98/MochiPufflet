//The twitter bot is mimicking an interactive pet. In the beginning, the project to me was very bland. 
//The idea of creating a twitter bot in itself was very cool but the majority of what twitter bots 
//actually do are mostly the same, mimic a celebrity or person, automated retweets and likes, and maybe 
//automated images for something more interesting. It was challenging to figure out a way to put my 
//personality into this project. However, perhaps it was due to the large amount of pet games I play and 
//my interest in cute things, I got the inspiration to create an interactive pet through twitter. 
//
//Mochi Pufflet is what I call my interactive pet. It has five distinct moods. Happy, hungry, sad, bored, 
//and unfortunately dying. Mochi expresses its emotions periodically through a status update and an image 
//(self-drawn). The audience can then care for Mochi by replying to it and using the keywords “food”, 
//“play”, and “love”. These mentions will be processed and increase Mochi’s condition as well as thank 
//the mentioner who cared for it. 
//
//https://twitter.com/mochipufflet
//The interval was set to a minute to quickly show how the twitter bot updates and interacts with other 
//people. However, the actual interval will be an hour long.

var request = require('request');
var hunger = 100;
var boredom = 100;
var love = 100;
var satiated = 300;
var lastReply = " ";
var twitter_handle = "mochipufflet"

var Twit = require('twit');
var T = new Twit(require('./config.js'));
var fs = require("fs");

function tweet() {
	if (hunger == 0 && boredom == 0 && love == 0) {
		console.log("dead");
		var b64content = fs.readFileSync('/Users/chloechoi/Desktop/Project3/dead.png', { encoding: 'base64' })
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		  var mediaIdStr = data.media_id_string
		  var altText = "Mochi pufflet is dying."
		  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		  T.post('media/metadata/create', meta_params, function (err, data, response) {
		    if (!err) {
		      var params = { status: 'Mochi Pufflet is dying... Give me attention with food, play, or love... #mochipufflet', media_ids: [mediaIdStr] }
		      T.post('statuses/update', params, function (err, data, response) {
		      })
		    }
		  })
		})
	}
	else if (hunger >= 80 && boredom >= 80 && love >= 80) {
		console.log("satiated");
		var b64content = fs.readFileSync('/Users/chloechoi/Desktop/Project3/happy.png', { encoding: 'base64' })
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		  var mediaIdStr = data.media_id_string
		  var altText = "Mochi pufflet is satisfied."
		  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		  T.post('media/metadata/create', meta_params, function (err, data, response) {
		    if (!err) {
		      var params = { status: 'Mochi Pufflet is happy!~ #mochipufflet', media_ids: [mediaIdStr] }
		      T.post('statuses/update', params, function (err, data, response) {
		      })
		    }
		  })
		})
	} else if (findCondition() == hunger) {
		console.log("hunger");
		var b64content = fs.readFileSync('/Users/chloechoi/Desktop/Project3/hungry.png', { encoding: 'base64' })
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		  var mediaIdStr = data.media_id_string
		  var altText = "Mochi Pufflet is hungry."
		  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		  T.post('media/metadata/create', meta_params, function (err, data, response) {
		    if (!err) {
		      var params = { status: 'Mochi Pufflet is hungry! Feed me food T^T #mochipufflet', media_ids: [mediaIdStr] }
		      T.post('statuses/update', params, function (err, data, response) {
		      })
		    }
		  })
		})
	} else if (findCondition() == boredom) {
		console.log("boredom");
		var b64content = fs.readFileSync('/Users/chloechoi/Desktop/Project3/bored.png', { encoding: 'base64' })
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		  var mediaIdStr = data.media_id_string
		  var altText = "Mochi Pufflet is bored."
		  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		  T.post('media/metadata/create', meta_params, function (err, data, response) {
		    if (!err) {
		      var params = { status: 'Mochi Pufflet is bored! Play with me... #mochipufflet', media_ids: [mediaIdStr] }
		      T.post('statuses/update', params, function (err, data, response) {
		      })
		    }
		  })
		})
	} else if (findCondition() == love){
		console.log("love");
		var b64content = fs.readFileSync('/Users/chloechoi/Desktop/Project3/sad.png', { encoding: 'base64' })
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		  var mediaIdStr = data.media_id_string
		  var altText = "Mochi Pufflet is sad."
		  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		  T.post('media/metadata/create', meta_params, function (err, data, response) {
		    if (!err) {
		      var params = { status: 'Mochi Pufflet is sad! Give me some more love.. </3 #mochipufflet', media_ids: [mediaIdStr] }
		      T.post('statuses/update', params, function (err, data, response) {
		      })
		    }
		  })
		})
	}
}

function findCondition() {
	var mostNeeded = satiated;
	if (mostNeeded > hunger) {
		mostNeeded = hunger;
	}
	if (mostNeeded > boredom) {
		mostNeeded = boredom;
	}
	if (mostNeeded > love){
		mostNeeded = love;
	}
	return mostNeeded;
}

var stream = T.stream('user');
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
    var reply_to   = tweet.in_reply_to_screen_name;
    var text       = tweet.text;
    var from       = tweet.user.screen_name;
    var nameID     = tweet.id_str;
    var params     = {reply_to, text, from, nameID};
    console.log("Tweet text: " + text);
    console.log("Reply_to: " + reply_to);
    var reply  = "";
    var new_tweet = " ";
    if (reply_to != null && reply_to.indexOf(twitter_handle) > -1) {
	    if(text.includes("food")) {
	  		console.log("mention food");
	  		hunger += 50;
	  		reply = "Thank you for feeding me @";
	  		new_tweet = reply + from + "!";
		}
		if(text.includes("play")) {
			console.log("mention play");
	  		boredom += 50;
	  		reply = "Thank you for playing with me @";
	  		new_tweet = reply + from + "!";
		}
		if(text.includes("love")) {
			console.log("mention love");
	  		love += 50;
	  		reply = "Thank you for giving me love @";
	  		new_tweet = reply + from + "!";
		}
		console.log("Reply: " + reply);
		console.log("new_tweet: " + new_tweet);

		if (lastReply !== text && new_tweet != " "){
			lastReply = text;
	        var tweet = {
	            status: new_tweet,
	            in_reply_to_status_id: nameID
	        }
	        T.post('statuses/update', tweet, tweeted);
	        function tweeted(err, data, response) {
	            if (err) {
	                console.log("Something went wrong!");
	            } else {
	                console.log("It worked!");
	            }
	        }
		}
    }
}

function runBot() {
	console.log(" ");
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log("-------Tweet something");
	tweet();
	console.log("-------Tweet complete");
	if (hunger >= 0) {
		hunger -= Math.floor(Math.random() * (30));
	}
	if (boredom >= 0) {
		boredom -= Math.floor(Math.random() * (30));
	}
	if (love >= 0) {
		love -= Math.floor(Math.random() * (30));
	}
	replied = false;
	lastReply = " ";
	console.log("-------Stats: ");
	console.log("Hunger: " + hunger);
	console.log("Boredom: " + boredom);
	console.log("Love: " + love);
}
runBot();
setInterval(runBot, 3600000);