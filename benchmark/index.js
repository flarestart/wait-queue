var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var WaitQueue = require('../index')
var wq = new WaitQueue

var TimeStart = Date.now()
var End = new Error('end')
var Count = 0

// add a default consumer
function loop(){
    wq.shift()
    .then(function(item){
        // end loop, output shift speed
        if(item === End){
            console.log('.shift()', Count * 1000 / (Date.now() - TimeStart), '/s');
        }
        setImmediate(loop)
    })
    .catch(function(e){
        console.log(e)
    })
}
// start loop
loop()

// test push speed
suite.add('.push() 1k data speed test', function () {
    Count++
    wq.push(Buffer.allocUnsafe(1024))
})
suite.add('.unshift() 1k data speed test', function () {
    Count++
    wq.unshift(Buffer.allocUnsafe(1024))
})
suite.add('.push() 4k data speed test', function () {
    Count++
    wq.push(Buffer.allocUnsafe(4096))
})
suite.add('.unshift() 4k data speed test', function () {
    Count++
    wq.unshift(Buffer.allocUnsafe(4096))
})

suite.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('error', function(err){
    console.log(err)
})
.on('complete', function() {
    wq.push(End)
})
.run({ async: true })
