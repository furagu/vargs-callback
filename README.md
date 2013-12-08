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

## The Solution

Let's talk about functions.

First, a well-designed function should not have many parameters. Having more than three parameters often means function needs refactoring. One should split the code to several different funcitons, aggregate some separate parameters into one parameter object, so there are only small and concise functions left ([Refactoring: Improving the Design of Existing Code](http://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672) by Martin Fowler is the book to read on the subject).

Second, there is a simple native way to deal with missing parameters. If there are less arguments than stated in the function parameter list, missing parameters take ```undefined``` value. One could do something like ```options = options || {}``` to handle such cases. It is natural, simple and easy to read.

Finally, there is the "Callback goes last" convention which simplifies asynchronous programming. This convention creates situations in which the callback takes place of one of the optional parameters. Callback taking the wrong place is the root cause of the variable arguments problem.

Stated thus, the solution comes easily. The only thing needs to be done is _to move the callback to its place_, leaving missing parameters undefined. This is exactly what vargs-callback does.

## Usage

The library exports only one function and adds one non-enumerable property ```vargs``` to Function.prototype. Use it as follows.

Global or named functions:

```js
var vargs = require('vargs-callback')

function openTheDoor(door, options, callback) {
    // actual function code using parameters
    if (door.isOpen) return
    // ...
}
openTheDoor = vargs(openTheDoor) // Decorate named/global function
```

Object methods:

```js
var vargs = require('vargs-callback')

var doorOpener = {
 open: function (door, options, callback) {
        // actual function code using parameters
        if (door.isOpen) return
        // ...
    }.vargs // Decorate anonymous function with accessor property. Note the absence of ()
    //...
}
```

## The Rules

Vargs decorator works on the original function call and does exactly the following:

1.  If there are not enough arguments given and the last given argument is a function, insert ```undefined``` values into original arguments just before the last element to make it the same size as the original parameter list.
2.  Call the original function with modified arguments.
3.  Do not modify arguments if there are enough arguments or the last argument is not a function.
