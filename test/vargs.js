var should = require('should'),
    vargs = require('../index.js')

describe('vargs', function () {
    it('should add non-enumerable vargs property to all the functions', function () {
        function foo() {}
        foo.should.have.property('vargs')
        foo.should.not.have.ownProperty('vargs')
        Object.keys(foo).should.not.include('vargs')
    })

    it('should make callaback the last argument', function () {
        function foo(a, b, c) {
            should.strictEqual(a ? 1 : undefined, a)
            should.strictEqual(b ? 2 : undefined, b)
            should(c).be.type('function')
        }
        foo = foo.vargs

        foo(function () {})
        foo(1, function () {})
        foo(1, 2, function () {})
    })

    it('should not modify arguments if the last argument is not a function', function () {
        function foo(a, b, c) {
            should(c).not.be.type('function')
        }
        foo = foo.vargs

        foo()
        foo(1)
        foo(1, 2)
        foo(1, 2, 3)
        foo(function () {}, 1)
    })

    it('should not modify arguments if there are more than stated in the function definition', function () {
        var cb = function () {}

        ;(function (a, b, c) {
            arguments.should.eql([1, 2, 3, cb])
            ;[a, b, c].should.eql([1, 2, 3])
        }.vargs(1, 2, 3, cb))
    })

    it('exported object should be a function', function () {
        vargs.should.be.type('function')
    })

    it('exported function should do the same thing as .vargs property', function () {
        function foo(a, b, c) {
            return arguments
        }
        foo = foo.vargs

        function bar(a, b, c) {
            return arguments
        }
        bar = vargs(bar)

        var cb = function () {}

        foo(1, cb).should.eql(bar(1, cb))
    })
})
