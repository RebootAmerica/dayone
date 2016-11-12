// 1. create map of USA, borrowed from https://bl.ocks.org/mbostock
// var twitterMap = d3.select("#twitterMap"); // a home for the map
var width = 960,
    height = 600;
var projection = d3.geo.albersUsa()
    .scale(1285)
    .translate([width / 2, height / 2]);

var svg = d3.select("#twitterMap").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(projection);
    // .context(c); // for tweets 

// Use canvas to draw tweets onto existing map??
var c = svg.node();
console.log(c);
var title = d3.select("#tweets");

var defs = svg.append("defs");

queue()
    .defer(d3.json, "/world-110m.json")
    .defer(d3.tsv, "/world-country-names.tsv")
    .defer(d3.json, "/us.json")
    .await(ready);

function ready(error, world, names, us) {
  if (error) throw error;
  defs.append("filter").attr("id", "blur")
    .append("feGaussianBlur")
    .attr("stdDeviation", 5);

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



// 3. Show tweets on map
socket.on('tweet', function(tweet) {
  d3.transition()
    .duration(1250)
    .each("start", function() {
      console.log(tweet);
      $("#tweet").html(makeHTML(tweet));
    });
    // show each tweet with dot at lat long 


    // .tween("rotate", function() {
    //   var p = tweet.latLong;
    //       // r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
    //   return function(t) {
    //     // Rotate the earth so that the new point is front and center.
    //     // projection.rotate(t); // rotate is maybe not right
    //     // Erase the canvas.
    //     c.clearRect(0, 0, width, height);
    //     // Fill in all the landmasses gray.
    //     c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
    //     // Draw the country borders in white.
    //     c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
    //     // Draw the earth's circumference in black.
    //     c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
    //     // Get the canvas-coordinates of the latLong point, and draw a circle there.
    //     // projection(p);
    //     c.strokeStyle = "#000", c.fillStyle = "#f00", c.beginPath(), c.arc(center[0], center[1], 5, 0, 2 * Math.PI, false), c.lineWidth = 2, c.fill(), c.stroke();
    //   };
    // });
});

};
d3.select(self.frameElement).style("height", height + "px");


