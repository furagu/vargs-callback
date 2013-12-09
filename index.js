function vargs(fn) {
    return function () {
        var args = Array.prototype.slice.apply(arguments)
        if (args.length < fn.length && typeof args[args.length - 1] === 'function')
            Array.prototype.splice.apply(args, [args.length - 1, 0].concat(Array(fn.length - args.length)))
        return fn.apply(this, args)
    }
}

module.exports = vargs
