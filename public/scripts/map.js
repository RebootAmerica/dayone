var tweetCount = 0;
$("#tweetCount").text(tweetCount);

// 1. create map of USA, borrowed from https://bl.ocks.org/mbostock
// var twitterMap = d3.select("#twitterMap"); // a home for the map
var width = 960,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

// Use canvas to draw tweets onto existing map??
// not sure if these two are necessary, but there needs to be some connection to the socket
// var c = svg.node();
var tweetContainer = d3.select("#tweets");

// queue the json needed to for map and then build in the socket connection
queue()
    .defer(d3.json, "/world-110m.json")
    .defer(d3.tsv, "/world-country-names.tsv")
    .defer(d3.json, "/us.json")
    .await(ready);

function ready(error, world, names, us, topo) {
// d3.json("us.json", function(error, world, names, us, topo){
  if (error) throw error;
  // console.log(topo);
 
  // states = topojson.feature(topo, topo.objects.states).features
  // console.log(states);

  var svg = d3.select("#twitterMap").append("svg")
    .attr("width", width)
    .attr("height", height);

  // points
  aa = [-122.490402, 37.786453];
  // bb = [-122.389809, 37.72728];
  console.log(projection(aa));

  var defs = svg.append("defs");

  // defs is the outline of the map
  defs.append("filter").attr("id", "blur")
    .append("feGaussianBlur")
    .attr("stdDeviation", 5);

  // setting up state and county boundaries 
  defs.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("id", "land")
      .attr("d", path);
  svg.append("use")
      .attr("class", "land-glow")
      .attr("xlink:href", "#land");
  svg.append("use")
      .attr("class", "land-fill")
      .attr("xlink:href", "#land");
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.counties, function(a, b) {
        return a !== b // a border between two counties
            && (a.id === 53000 || b.id === 5300 // where a and b are in puget sound
              || a.id % 1000 && b.id % 1000) // or a and b are not in a lake
            && !(a.id / 1000 ^ b.id / 1000); // and a and b are in the same state
      }))
      .attr("class", "county-boundary")
      .attr("d", path);
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a !== b; // a border between two states
      }))
      .attr("class", "state-boundary")
      .attr("d", path);

// adds a circle to map with lat/long
  svg.selectAll("circle")
    .data([aa]).enter() // aa needs to be replaced with tweets 
    .append("circle")
    .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
    .attr("cy", function (d) { return projection(d)[1]; })
    .attr("r", "8px")
    // .attr("fill", "red");





  // 2. Open up a socket with Twitter, start stream AFTER map is rendered. 

  var socket = io({ "force new connection" : true });

  // TURN THIS INTO A TEMPLATE 
  function makeHTML(tweet) {
    return [
      '<div class="user">',
      '<a href="https://twitter.com/', tweet.user, '" target="_blank">', '@', tweet.user, '</a>',
      '<h1>', tweet.placeName, '</h1>',
      '<div class="tweet">',
      '<a href="https://twitter.com/', tweet.user, '/status/', tweet.id, '" target="_blank">',
      tweet.text, '</a>', '</div>'
    ].join('');
  }



  // 3. Show tweets on map: this section needs to work nicely with the svg map
  socket.on('tweet', function(tweet) {
    d3.transition()
      // .duration(1600)
      // .delay(6000)
      .each("start", function() {
        tweetCount += 1;
        $("#tweetCount").text(tweetCount);
        // create tweet
        $("#tweet").html(makeHTML(tweet));
        // create location dot
        var lat = tweet.latLong[0];
        var lon = tweet.latLong[1];
        var coordinates = projection([lat,lon]);      
        svg.selectAll("circle") // allows for only one at a time
        .attr("cx", coordinates[0])
        .attr("cy", coordinates[1])
        .attr("r", 5)
        .style("fill", "red");
      });
  });
}; // end ready()

d3.select(self.frameElement).style("height", height + "px");


