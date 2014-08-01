function variableArguments(fn, strict) {
    var slice = Array.prototype.slice,
        paramsCount = fn.length

    return function () {
        var argsCount = arguments.length,
            lastArg = arguments[argsCount - 1]

        if (strict && typeof lastArg !== 'function')
            throw new TypeError('Callback is required')

        if (argsCount >= paramsCount || typeof lastArg !== 'function')
            return fn.apply(this, arguments)

        var args = slice.call(arguments, 0, argsCount - 1)
        for (var i = paramsCount - argsCount; i; i -= 1)
            args.push(undefined)
        args.push(lastArg)

        return fn.apply(this, args)
    }
}

module.exports = function vargs(fn) {
    return variableArguments(fn, false)
}

module.exports.strict = function vargs_strict(fn) {
    return variableArguments(fn, true)
}
