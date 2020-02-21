# @battlemanmk2/statusmanager

![npm](https://img.shields.io/npm/v/@battlemanmk2/statusmanager)

Takes Discord.js client object and returns StatusManager object that will change the bots game status on a set schedule.

Requires the following environmental variables be set:
```
DATABASE_ID (MongoDB database ID)
```

Also requires that Bot has botStatus field populated in website database>bots collection>bot document with an array of objects with the following fields:
1. name: String of status
2. statusType: Either "Playing" or "Watching"

## Install

```
$ npm install @battlemanmk2/twitter
```

## Usage

```js
const Twitter = require("@battlemanmk2/twitter");
const twitter = new Twitter(discordjsClient);
//=> Connecting to Twitter stream...
//=> Connected to Twitter stream!

If an error occurs, will auto reconnect. Each time an error occurs, it will increase reconnect time by 1 minute
//=> Reconnecting to Twitter stream in 60000ms...
//=> Connecting to Twitter stream...
//=> Connected to Twitter stream!

```