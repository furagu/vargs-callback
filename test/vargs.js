var should = require('should'),
    vargs = require('../index.js')

describe('vargs', function () {
    it('exported object should be a function', function () {
        vargs.should.be.type('function')
    })

    it('should make callaback the last argument', function () {
        function foo(a, b, c) {
            should.strictEqual(a ? 1 : undefined, a)
            should.strictEqual(b ? 2 : undefined, b)
            should(c).be.type('function')
        }
        foo = vargs(foo)

        foo(function () {})
        foo(1, function () {})
        foo(1, 2, function () {})
    })

    it('should not modify arguments if the last argument is not a function', function () {
        var foo = vargs(function foo(a, b, c) {
            should(c).not.be.type('function')
        })

        foo()
        foo(1)
        foo(1, 2)
        foo(1, 2, 3)
        foo(function () {}, 1)
    })

    it('should not modify arguments if there are more than stated in the function definition', function () {
        var cb = function () {}

        vargs(function (a, b, c) {
            arguments.should.eql([1, 2, 3, cb])
            ;[a, b, c].should.eql([1, 2, 3])
        })(1, 2, 3, cb)
    })
})
