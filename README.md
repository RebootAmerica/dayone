With gratitude based off of [http://joelgrus.com/2016/02/27/trump-tweets-on-a-globe-aka-fun-with-d3-socketio-and-the-twitter-api/ ] by Joel Grus.

Real time visualization of geotagged tweets in response to this year's election results to track violence in the aftermath and find ways to help. 


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
ask @brittanyIRL for keys if you need them. 

To run the project locally on 'localhost:3000' 

```bash
$ node twitter.js
```

