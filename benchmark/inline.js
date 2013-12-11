var Benchmark = require('benchmark'),
    vargs = require('../index.js')

var add1 = vargs(function (a, b, options, callback) {
    options = options || {}
    var sum = a + b
    return callback(null, sum)
})

var add2 = function(a, b, options, callback) {
    if (typeof options === 'function') {
        callback = options
        options = {}
    }
    var sum = a + b
    return callback(null, sum)
}

;(new Benchmark.Suite)
    .add('vargs', function () {
        var total1
        add1(1, 2, function (error, sum) {
            total1 = sum
        })
    })
    .add('inline', function () {
        var total2
        add2(1, 2, function (error, sum) {
            total2 = sum
        })
    })
    .on('cycle', function (event) {
        console.log(String(event.target))
    })
    .on('complete', function () {
        console.log('The fastest is ' + this.filter('fastest').pluck('name') + '\n')
    })
    .run()
