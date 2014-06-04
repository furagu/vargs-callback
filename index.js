function vargs(fn, requiredCallback) {
    var slice = Array.prototype.slice,
        paramsCount = fn.length

    return function () {
        var argsCount = arguments.length,
            lastArg = arguments[argsCount - 1]
        if (requiredCallback && typeof lastArg !== 'function')
            throw new Error('callback is required')

        if (argsCount >= paramsCount || typeof lastArg !== 'function')
            return fn.apply(this, arguments)

        var args = slice.call(arguments, 0, argsCount - 1)
        for (var i = paramsCount - argsCount; i; i -= 1)
            args.push(undefined)
        args.push(lastArg)

        return fn.apply(this, args)
    }
}

module.exports = vargs