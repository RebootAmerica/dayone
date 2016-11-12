// 1. create map of USA, borrowed from https://bl.ocks.org/mbostock
// var twitterMap = d3.select("#twitterMap"); // a home for the map
var width = 960,
    height = 600;
var projection = d3.geo.albersUsa()
    .scale(1285)
    .translate([width / 2, height / 2]);
var path = d3.geo.path()
    .projection(projection);
var svg = d3.select("#twitterMap").append("svg")
    .attr("width", width)
    .attr("height", height);
var defs = svg.append("defs");
defs.append("filter")
    .attr("id", "blur")
  .append("feGaussianBlur")
    .attr("stdDeviation", 5);
d3.json("us.json", function(error, us) {
  if (error) throw error;
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
});
d3.select(self.frameElement).style("height", height + "px");


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
      $("#tweet").html(makeHTML(tweet));
    })
    .tween("rotate", function() {
      var p = tweet.latLong;
          // r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
      return function(tweet){
        tweet.latLong
      }
      // return function(t) {
      //   // Rotate the earth so that the new point is front and center.
      //   projection.rotate(r(t));
      //   // Erase the canvas.
      //   defs.clearRect(0, 0, width, height);
      //   // Fill in all the landmasses gray.
      //   defs.fillStyle = "#ccc", defs.beginPath(), path(land), defs.fill();
      //   // Draw the country borders in white.
      //   defs.strokeStyle = "#fff", defs.lineWidth = .5, defs.beginPath(), path(borders), defs.stroke();
      //   // Draw the earth's circumference in black.
      //   defs.strokeStyle = "#000", defs.lineWidth = 2, defs.beginPath(), path(globe), defs.stroke();
      //   // Get the canvas-coordinates of the latLong point, and draw a circle there.
      //   var center = projection(p);
      //   defs.strokeStyle = "#000", defs.fillStyle = "#f00", defs.beginPath(), defs.arc(center[0], center[1], 5, 0, 2 * Math.PI, false), defs.lineWidth = 2, defs.fill(), defs.stroke();
      // };
    });
});

