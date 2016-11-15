# Visualizing Pain

Real time visualization of geotagged tweets in response to this year's election results to visualize pain and violence in the aftermath for americans all over the USA and find ways to help. Aggregating tweets in real time over a socket connection based on keywords that are typically associated with online harassment. 

This project is purely to show the volume at which our citizens are being targeted in various ways.

Resources:
- [http://joelgrus.com/2016/02/27/trump-tweets-on-a-globe-aka-fun-with-d3-socketio-and-the-twitter-api/ ] by Joel Grus for the twitter socket connection starter code 
- [http://bl.ocks.org/mbostock] for the d3 resources and usa map 
- And, always, google fonts for being free and beautiful 


###To get start:

```bash
$ npm init
```

```bash
$ npm install
```

the twitter API credentials.js is stored in the gitignore, so you will need to make your own that looks like this: 


```js
module.exports = {
  consumer_key: "...",
  consumer_secret: "...",
  access_token_key: "...",
  access_token_secret: "..."
};
```

To run the project locally on 'localhost:3000' 

```bash
$ node twitter.js
```




