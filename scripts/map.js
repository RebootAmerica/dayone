/* D3 meets socket and creates a live map of tweets */
// $(document).ready(function(){
// var width = 960,
//     height = 960;

// var projection = d3.geo.orthographic()
//     .translate([width / 2, height / 2])
//     .scale(width / 2 - 20)
//     .clipAngle(90)
//     .precision(0.6);

// var canvas = d3.select("body").append("canvas")
//     .attr("width", width)
//     .attr("height", height);

// var c = canvas.node().getContext("2d");

// var path = d3.geo.path()
//     .projection(projection)
//     .context(c);

// var title = d3.select(".title");

// queue()
//     .defer(d3.json, "/world-110m.json")
//     .defer(d3.tsv, "/world-country-names.tsv")
//     .await(ready);

// function ready(error, world, names) {
//   if (error) throw error;

//   var globe = {type: "Sphere"},
//       land = topojson.feature(world, world.objects.land),
//       countries = topojson.feature(world, world.objects.countries).features,
//       borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

//   countries = countries.filter(function(d) {
//     return names.some(function(n) {
//       if (d.id == n.id) return d.name = n.name;
//     });
//   }).sort(function(a, b) {
//     return a.name.localeCompare(b.name);
//   });
queue()
    .defer(d3.json, "/states.json");

var width = 700,
      height = 580;

// var canvas = d3.select("body").append("canvas")
//     .attr("width", width)
//     .attr("height", height);

// var c = canvas.node().getContext("2d");
// 
// var title = d3.select(".title");


var svg = d3.select("title")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var states = svg.append( "g");

var albersProjection = d3.geo.albers()
  .scale( 190000 )
  .rotate( [71.057,0] )
  .center( [0, 42.313] )
  .translate( [width/2,height/2] );

var path = d3.geo.path()
    .projection( albersProjection );

function ready(error, world, names) {
  if (error) throw error;

states.selectAll( "path" )
  .data( states.json )
  .enter()
  .append( "path" )
  .attr( "fill", "#ccc" )
  .attr( "d", path );

// }

// function ready(error, world, names) {
  // Open up a socket to the website.
  var socket = io({ "force new connection" : true });

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

  // And whenever you get a tweet message from the socket...
  socket.on('tweet', function(tweet) {
    console.log(tweet);
    d3.transition()
      .duration(1250)
      .each("start", function() {
        svg.html(makeHTML(tweet));
        console.log(makeHTML(tweet));
      });
      // .tween("rotate", function() {
      //   var p = tweet.latLong,
            // r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        // return function(t) {
          // Rotate the earth so that the new point is front and center.
          // projection.rotate(t);
          // Erase the canvas.
          // c.clearRect(0, 0, width, height);
          // Fill in all the landmasses gray.
          // c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
          // Draw the country borders in white.
          // c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
          // Draw the earth's circumference in black.
          // c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          // Get the canvas-coordinates of the latLong point, and draw a circle there.
          // var center = projection(p);
          // c.strokeStyle = "#000", c.fillStyle = "#f00", c.beginPath(), c.arc(center[0], center[1], 5, 0, 2 * Math.PI, false), c.lineWidth = 2, c.fill(), c.stroke();
        // };
      // });
  });
  }

d3.select(self.frameElement).style("height", height + "px");
  
// });