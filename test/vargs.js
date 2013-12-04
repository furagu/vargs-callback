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

    it('should inflate arguments with undefined values if the last given argument is a function')
})
