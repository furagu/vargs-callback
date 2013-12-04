function vargs(fn) {
    return function () {
        var args = Array.prototype.slice.apply(arguments)
        if (args.length < fn.length && typeof args[args.length - 1] === 'function')
            Array.prototype.splice.apply(args, [args.length - 1, 0].concat(new Array(fn.length - args.length)))
        return fn.apply(this, args)
    }
}

Object.defineProperty(Function.prototype, 'vargs', {
    set: function () {},
    get: function () {
        return vargs(this)
    },
    configurable: true
})


module.exports = vargs
