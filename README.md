# vargs-callback
 
## The Problem
 
Dealing with variable function arguments makes you write some uncool boilerplace of this sort:
 
```js
function openTheDoor(door, options, callback) {
    if (typeof options === 'function') {
        callback = options
        options = {}
    }
    // actual function code using parameters
    if (door.isOpen) return
    // ...
}
```

## Bad solutions

There are some libraries providing the solution by processing arguments object. It ends up with another boilerplate like this:
 
```js
function openTheDoor() {
    var args = somehowParse(arguments)
    // actual function code using args object
    // note there are no argument names 
    if (args.first.isOpen) return 
    // ...
}
```
 
Or even with little "arguments definition language":
 
```js
function openTheDoor() {
    var args = parseArgs(['door|obj', 'options||obj', 'callback||func'], arguments)
    // actual function code using args object
    if (args.door.isOpen) return
    // ...
}
```

Some do weird call-twice-to-set-arguments magic which forces you to cast a spell involving ```this``` and write your actuial code inside a callback:

```js
function openTheDoor(door, options, callback) {
    return magic(this, ['door|obj', 'options||obj', 'callback||func'], function () {
        // actual function code using parameters
        // note the callback around and the return statement at the beginning
        if (door.isOpen) return
        // ...
    })
}
```





