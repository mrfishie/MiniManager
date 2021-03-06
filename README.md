# MiniManager

[![Build Status](https://travis-ci.org/mrfishie/MiniManager.svg)](https://travis-ci.org/mrfishie/MiniManager)

MiniManager allows you to enable or disable function calling and read-only properties on an object.

```js
var evt = new EventEmitter();
evt.on('test', function() {
	console.log('test');
});

// Wrap your object in a MiniManager
var manager = new MiniManager(evt);

// Get the new 'managed' object
var instance = manager.instance;

// The managed instance is disabled by default
instance.emit('test'); // nothing

// But we can enable it with the manager
manager.enable();

// And now we can use it
instance.emit('test'); // "test"
```

## Get it

MiniManager is available with NPM or Bower, or by cloning the repo.

```shell
# Install with NPM
npm install minimanager --save

# Install with Bower
bower install minimanager --save

# Clone the repo
git clone git://github.com/mrfishie/MiniManager.git
```

To use it in Node, just require the module.

```js
var MiniManager = require('minimanager');
var manager = new MiniManager(/* ... */);
```

To use it with Bower, first load the Javascript file in your HTML.

```html
<script src="bower_components/minimanager/minimanager.js"></script>
```

Now the class will be defined in the global scope.

```js
var manager = new MiniManager(/* ... */);
```

## Contribute

MiniManager tests are run with Mocha, and use Chai for assertions. All tests are in the `test` folder.

To run all tests, first install all NPM dependencies.

```shell
npm install
```

Now run the NPM test command.

```shell
npm test
```

## License

MiniManager is licensed under the MIT license. See the LICENSE file for more details.
