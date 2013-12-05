var should = require('should'),
    vargs = require('../index.js')

describe('vargs', function () {
    it('should be a function', function () {
        vargs.should.be.type('function')
    })

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
            c.should.be.type('function')
        }
        foo = foo.vargs

        foo(function () {})
        foo(1, function () {})
        foo(1, 2, function () {})
    })

    it('should not do anything if the last argument is not a function')

    it('should not do anything if the number of arguments is greater than stated in function definition')
})
