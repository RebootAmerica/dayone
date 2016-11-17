/**
 * This is the server that does everything. It serves the index.html web page.
 * It opens a streaming connection to Twitter and retrieves the tweets. It
 * publishes all of the geotagged tweets to a Socket.io socket.
 */

/**
 * EXPRESS BOILERPLATE GOES HERE
 */
var express = require('express'),
    app = express(),
    http = require('http').Server(app);

// Serve index.html at the root.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Serve static files in the public directory.
app.use(express.static('public'));

// Run on port 3000.
http.listen(process.env.PORT || 3000);


/**
 * Create an EventEmitter so that we can decouple the Twitter listener
 * and the socket.io socket.
 */
var EventEmitter = require('events'),
    util = require('util');

function TweetEmitter() {
  EventEmitter.call(this);
}
util.inherits(TweetEmitter, EventEmitter);

var tweetEmitter = new TweetEmitter();

/**
 * Here's all the socket.io stuff
 */

var io = require('socket.io')(http);

tweetEmitter.on('tweet', function(tweet) {
  io.emit('tweet', tweet);
});

// a helper function to average coordinate pairs
function average(coordinates) {
  var n = 0, lon = 0.0, lat = 0.0;
  coordinates.forEach(function(latLongs) {
    latLongs.forEach(function(latLong) {
      lon += latLong[0];
      lat += latLong[1];
      n += 1;
    })
  });
  return [lon / n, lat / n];
}

// Twitter api access and set up stream

var Twitter = require('twitter'),
    credentials = require('./credentials.js'),
    client = new Twitter(credentials);

// search terms, to be turned into groupings 
var query = "trump" &&  "hate" || "bitch" || "nigger" || "fag" || "muslim" || "racism" || "harassment" || "discrimination";

var tweetCount = 0; // +1 for each tweet


client.stream('statuses/filter', {track: query}, function(stream) {
  // Every time we receive a tweet...
  stream.on('data', function(tweet) {
    // ... that has the `place` field populated ...
    if (tweet.place) {
      if(tweet.place.country_code === "US"){
      console.log("_______");
      console.log(tweet);
      console.log("_______");
      // ... extract only the fields needed by the client ...
        var tweetSmall = {
          id: tweet.id_str,
          user: tweet.user.screen_name,
          text: tweet.text,
          placeName: tweet.place.full_name,
          latLong: average(tweet.place.bounding_box.coordinates),
        }
        tweetCount += 1;
      // ... and notify the tweetEmitter.
        tweetEmitter.emit('tweet', tweetSmall);
      }
    }
  });
});
