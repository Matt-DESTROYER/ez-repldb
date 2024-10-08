[![Version](https://img.shields.io/npm/v/ez-repldb.svg?style=flat)](https://www.npmjs.com/package/ez-repldb)
[![Install size](https://packagephobia.com/badge?p=ez-repldb)](https://www.npmjs.com/package/ez-repldb)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/ez-repldb?style=flat)](https://www.npmjs.com/package/ez-repldb)
[![Downloads/month](https://img.shields.io/npm/dm/ez-repldb.svg?style=flat)](https://www.npmjs.com/package/ez-repldb)

# EZReplDB
Easy Repl DB is a quick and easy way to interact with Replit's database with next to no set up required.

## Using EZReplDB
```js
const db = require("ez-repldb");
```
Yep, that's all you need to do, you can start using the database right away!
(By default this will automatically connect to your database, however it is also possible to customise which database this connects to; see `db.url`.)

## Methods
These are methods of the exported database object.

> Note: EZReplDB supports storage of all valid JSON datatypes.

---
```js
db.set(String key, Any value);
```
Sets a `key` in the Replit database to `value`.
Returns a promise which resolves to `true` or `false`, indicating the success of the operation.
```js
db.set("key", 123).then(console.log);             // -> true/false (depending on if it worked or not)
console.log(await db.set("msg", "Hello world!")); // -> true/false (depending on if it worked or not)
```
---
```js
db.set(Any[] keysAndValues);
```
Reads the input (one dimensionsal array) as `key`-`value` pairs and sets all the `key`s to their corresponding `value`s in the Replit database.
Returns a promise which resolves to `true` or `false`, indicating the success of the operation.
```js
db.set("key", 123, "msg", "Hello world!").then(console.log);  // -> true/false (depending on if it worked or not)
console.log(await db.set("key", 123, "msg", "Hello world!")); // -> true/false (depending on if it worked or not)
```
---
```js
db.get(String key);
```
Gets the value stored using `key` from the Replit database.
Returns a promise which resolves to the value stored using the input `key` or `null` (if an error occurs or the `key` didn't exist).
```js
db.get("key").then(console.log);  // -> 123/null (depending on if it worked or not)
console.log(await db.get("msg")); // -> "Hello world!"/null (depending on if it worked or not)
```
---
```js
db.get(String[] keys);
```
Gets an array of values stored using the `key`s in `keys` from the Replit database.
Returns a promise which resolves to an array of values stored using the input `key`s.
```js
db.get("key", "msg").then(console.log);  // -> [ 123, "Hello world!" ]/null (depending on if it worked or not)
console.log(await db.get("key", "msg")); // -> [ 123, "Hello world!" ]/null (depending on if it worked or not)
```
---
```js
db.delete(String key);
```
Deletes the value stored using `key` from the Replit database.
Returns a promise which resolves to `true` or `false`, indicating the success of the operation.
```js
db.delete("key").then(console.log);  // -> true/false (depending on if it worked or not)
console.log(await db.delete("msg")); // -> true/false (depending on if it worked or not)
```
---
```js
db.delete(String[] keys);
```
Deletes the values stored using the `key`s in `keys` from the Replit database.
Returns a promise which resolves to `true` or `false`, indicating the success of the operation.
```js
db.delete("key", "msg").then(console.log);  // -> true/false (depending on if it worked or not)
console.log(await db.delete("key", "msg")); // -> true/false (depending on if it worked or not)
```
---
```js
db.list();
```
Gets the keys currently stored in the Replit database.
Returns a promise which resolves to an array containing the keys stored in the Replit database (the array will be empty if the database has had no keys set or if an error occurs).
```js
db.list().then(console.log);  // -> [ "key", "msg" ]/[] (depending on if it worked or not)
console.log(await db.list()); // -> [ "key", "msg" ]/[] (depending on if it worked or not)
```
---
```js
db.list(String prefix);
```
Gets the keys currently stored in the Replit database that start with the input `prefix`.
Returns a promise which resolves to an array containing the keys stored in the Replit database that begin with the input `prefix` (the array will be empty if the database has had no keys set or if an error occurs).
```js
db.list("k").then(console.log);  // -> [ "key" ]/[] (depending on if it worked or not)
console.log(await db.list("m")); // -> [ "msg" ]/[] (depending on if it worked or not)
```
---
```js
db.getAll();
```
Gets all the key-value pairs currently stored in the Replit database.
Returns a promise which resolves to an object with its properties and their values as the key-value pairs stored in the Replit database (the object will be empty if the database has had no keys set or if an error occurs).
```js
db.getAll().then(console.log);  // -> { "key": 123, "msg": "Hello world!" }/{} (depending on if it worked or not)
console.log(await db.getAll()); // -> { "key": 123, "msg": "Hello world!" }/{} (depending on if it worked or not)
```
---
```js
db.cache();
```
Caches all current keys.
This speeds up `get` significantly (`get` itself will automatically cache values of keys that aren't already cached, and `set` will automatically update values in the cache).
To disable using cached values within get, set `db.cachingEnabled` (see in properties below) to `false`.
`db.cache` returns a promise when called that resolves to either `true` or `false`, depending on whether the method was able to connect to the database (`true` does not neccessarily indicate caching succeeded, however it does indicate it is highly likely it did).

---
```js
db.clear();
```
Removes all key-value pairs from the Replit database.
Returns a promise which resolves to an array indicating the success of deleting each key-value pair from the Replit database.
```js
db.clear().then(console.log);  // -> [ true, true ]/[ false, false ] (depending on if it worked or not)
console.log(await db.clear()); // -> [ true, true ]/[ false, false ] (depending on if it worked or not)
```
---
```js
db.getObject(Object object);
```
Retrieves the keys stored as properties within the input `object` from the Replit database and applies them to `object`.
Returns a promise that resolves with the resulting object (note that `Object`s are passed by reference so this will actually alter the object passed in to the function).
```js
const obj = {
	"key": null,
	"msg": null
};
db.getObject(obj).then(function() {
	console.log(obj); // -> { "key": 123, "msg": "Hello world!" }/{ "key": null, "msg": null } (depending on if it worked or not)
});
await db.getObject(obj);
console.log(obj);     // -> { "key": 123, "msg": "Hello world!" }/{ "key": null, "msg": null } (depending on if it worked or not)
```
---
```js
db.applyObject(Object object);
```
Sets the keys stored as properties within the input `object` to their respcetive values and applies them to the Replit database.
Returns a promise that resolves to `true` or `false` depending on the success of the operation.
```js
const obj = {
	"key": 123,
	"msg": "Hello world!"
};
db.applyObject(obj).then(console.log);  // -> true/false (depending on if it worked or not)
console.log(await db.applyObject(obj)); // -> true/false (depending on if it worked or not)
```
---
```js
db.import(String url);
```
Imports the key-value pairs from another Replit database using the input URL (to get this URL, in the shell of the Repl you would like to import the database from enter `echo $REPLIT_DB_URL`).
Returns a promise that resolves the `true` or `false` depending on the success of the operation.
Also logs to the console all imported keys and potentially unsuccessfully imported keys (or upon failure, during which operation the failure occurred).
```js
db.import("https://kv.replit.com/some-arbitrary-string").then(console.log); // -> true
```
Also output:
```
Imported the following keys: "key", "msg"
```
---

## Properties
These are properties of the exported database object.

---
```js
db.url;
```
This property allows you access to the full URL used by all database methods, you can actually set this to a different Repl's database URL and all the methods will interact with that database instead.
> Note: You can `get` and `set` this property, `set`ing it will also change the value of `db.path`.
---
```js
db.host;
```
This property allows you to see the host of your Replit database (which will always be `kv.replit.com`).
> Note: You can only `get` this property, `set`ing it will not change its value.
---
```js
db.path;
```
This property allows you to see the path of your Replit database.
> Note: You can only `get` this property, `set`ing it will not change its value (although it's value will be changed if `db.url` is altered).
---
```js
db.cachingEnabled;
```
This property allows you to enable/disable (enabled, `true`, by default) caching. All values accessed are cached enabling much faster `get`ing (at the cost of memory).

---
