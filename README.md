# vargs-callback [![Build Status](https://travis-ci.org/furagu/vargs-callback.png?branch=master)](https://travis-ci.org/furagu/vargs-callback)

[Skip to usage](#Usage)

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

This parameter juggling is not what you actually want your function to do, it's just a workaround of the JavaScript function arguments implementation.
There should be a way to get rid of it.

## Bad Solutions

There are some libraries built to process the arguments object. It ends up with another boilerplate like this:

```js
function openTheDoor() {
    var args = somehowParse(arguments)
    // actual function code using args object
    // note there are no argument names
    if (args.first.isOpen) return
    // ...
}
```

Some provide a little "arguments definition language":

```js
function openTheDoor() {
    var args = parseArgs(['door|obj', 'options||obj', 'callback||func'], arguments)
    // actual function code using args object
    if (args.door.isOpen) return
    // ...
}
```

Some do weird call-twice-to-set-parameters magic forcing you to cast a spell involving ```this``` and write your code inside a callback:

```js
function openTheDoor(door, options, callback) {
    return magicArgs(this, ['door|obj', 'options||obj', 'callback||func'], function () {
        // actual function code using declared parameters
        // note the callback around and the return statement at the beginning
        if (door.isOpen) return
        // ...
    })
}
```

A common problem of all these solutions is that you simply replace one boilerplate with another. You must still do some tricks before you can use the function parameters. And it clutters your code.

## Good Solution

Let's talk about functions.

First, a well-designed function should not have many parameters. Having more than three parameters often means function needs refactoring. You should consider splitting the function code to several different funcitons or aggregating some of parameters into one parameter object until only small and concise functions left ([Refactoring: Improving the Design of Existing Code](http://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672) by Martin Fowler is the book to read on the subject).

Second, there is a native JavaScript way to deal with missing parameters. All missing parameters are set to ```undefined``` and you can do something like ```options = options || {}``` to handle such cases. It is natural, it is simple and easy to read.

Finally, there is the "Callback goes last" convention which simplifies asynchronous programming. This convention creates situations when the callback takes place of one of the optional parameters. Callback taking the wrong place is the root cause of the variable arguments problem.

Combining the above, the solution comes easily. The only thing needs to be done is _to move the callback to its place_, leaving missing parameters undefined. This is exactly what vargs-callback does.

<a name="Usage" />
## Usage

The library exports only one function which should be used as a decorator.

Function declarations:

```js
var vargs = require('vargs-callback')

function openTheDoor(door, options, callback) {
    // actual function code using parameters
    // options will be undefined if only door and callback given
    if (door.isOpen) return
    // ...
}
openTheDoor = vargs(openTheDoor) // Decorate global function
```

Function expressions:

```js
var vargs = require('vargs-callback')

var openTheDoor = vargs(function (door, options, callback) { // Decorate function expression
    // actual function code using parameters
    // options will be undefined if only door and callback given
    if (door.isOpen) return
    // ...
})
```

There is also __vargs.strict__ decorator which forces a callback presence. It checks if the last argument is a function and throws TypeError if it's not:

```js
var vargs = require('vargs-callback')

var handleResponse = vargs.strict(function (config, response, callback) {
    // function code
})

handleResponse('some', 'args') // TypeError: Callback is required
```

Note the __vargs.strict__ call.


## The Rules

Vargs is triggered on the decorated function call and does the following:

1.  If vargs.strict was used and the last argument is not a function, throw TypeError.
2.  If there are not enough arguments given and the last given argument is a function, insert ```undefined``` values into arguments just before the last element to make arguments the same size as the declared function parameter list.
3.  Call the original function with modified arguments.
4.  Do not modify arguments if there are enough arguments or the last argument is not a function.
