# vargs-callback
 
## The Problem
 
Dealing with variable function arguments makes you write some uncool boilerplate of this sort:
 
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

This juggling is actually not what you want your function to do, this is just a workaround of JavaScript function arguments implementation. There should be a way to do variable arguments clearly.

## Bad Solutions

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
 
Or with little "arguments definition language":
 
```js
function openTheDoor() {
    var args = parseArgs(['door|obj', 'options||obj', 'callback||func'], arguments)
    // actual function code using args object
    if (args.door.isOpen) return
    // ...
}
```

Some do weird call-twice-to-set-parameters magic which forces you to cast a spell involving ```this``` and write your actuial code inside a callback:

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

The common problem of all that solutions is that you basically replace one boilerplate with another. Yes, you can not only load arguments, but also check types, you can even set default values. But still this is a boilerplate cluttering your code.

## Good Solution

Every problem has a root cause. The root cause of variable arguments problem is the callback.
