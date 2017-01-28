# wait-queue

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

  A javascript wait queue object handle infinity loop tasks more efficiently (using ES6 class and promise)

## Installation

```
$ npm install wait-queue
```

## ES5 version

[ES5 version](https://github.com/flarestart/wait-queue-es5)

## Benchmark

```
$ npm install
$ npm run benchmark
```

Sample data in Macbook Pro MF839/8GB

### 1.0.3(Use LinkList)

    .push() 1k data speed test x 511,367 ops/sec ±31.07% (27 runs sampled)
    .unshift() 1k data speed test x 269,995 ops/sec ±39.60% (14 runs sampled)
    .push() 4k data speed test x 41,531 ops/sec ±12.20% (7 runs sampled)
    .unshift() 4k data speed test x 35,928 ops/sec ±5.11% (8 runs sampled)
    .shift() 69614.33093950555 /s

### 1.0.2(Use Array)

    .push() 1k data speed test x 554,552 ops/sec ±26.09% (25 runs sampled)
    .unshift() 1k data speed test x 132 ops/sec ±2.96% (72 runs sampled)
    .push() 4k data speed test x 75,107 ops/sec ±22.32% (9 runs sampled)
    .unshift() 4k data speed test x 115 ops/sec ±2.15% (71 runs sampled)
    .shift() `wait too long, I didn't wait for the result, I guess is about 110/s`

## Change log

### 1.0.3

 * Replace `wq.queue` from `Array` to `LinkList`, because do shift() operation on `Array` of 10,000,000 items cost too many time

## Simple Example

```js
'use strict'
const WaitQueue = require('wait-queue')
const wq = new WaitQueue

// there's no task here 
wq.shift()
.then((item)=>{
    console.log('receive', item)
})

// task will add after 1s
setTimeout(function(){
    wq.push('any object')
}, 1000)
```

## Example: Multi Worker

```js
'use strict'
const WaitQueue = require('wait-queue')
const wq = new WaitQueue

// worker loop
function run_worker(id, time){
    var loop = function(){
        // get item at the front of the queue
        wq.shift()
        .then((item)=>{
            console.log('worker-' + id)
            console.log('  queue-len', wq.queue.length, 'item', item)
            setTimeout(loop, time)
        })
    }
    loop()
}

// worker-a use 1s every task
run_worker('a', 1000)
// worker-b use 2s every task
run_worker('b', 2000)
// worker-c use 5s every task
run_worker('c', 5000)

// add a task every 500ms
for(var n=0; n<20; n++){
    wq.push(n)
}
```

## Example: Push a function

```js
'use strict'
const WaitQueue = require('wait-queue')
const wq = new WaitQueue

// there's no task here 
wq.shift()
.then((item)=>{
    item.call()
})

// add a function as item
wq.push(function(){
    console.log('a function')
})
```

## Example: Loop Tasks

```js
'use strict'
const WaitQueue = require('wait-queue')
const wq = new WaitQueue

// do loop until catch a TerminateError, use e.isTerminateQueue to check
function loop(){
    // put first element out of queue
    wq.shift()
    .then(function(item){
        // do some job on item
        console.log(item)
        // do next loop
        setImmediate(loop)
    })
    .catch(function(e){
        // check if is a TerminateError
        if(e.isTerminateQueue){
            // should not do loop, because wait-queue is terminate somewhere
            console.log('end loop', e)
        }else{
            // error throw by other Promise object
            // you can record errors and do next loop
            setImmediate(loop)
        }
    })
}
setImmediate(loop)

var taskID = 0
var interval
// add a task every 1s
interval = setInterval(function(){
    wq.push({
        taskid: taskID++
    })
}, 1000)

// will trigger this event while wq.terminate() is called
wq.on('terminate', function(){
    clearInterval(interval)
})

// terminate after 10s
setTimeout(function(){
    wq.terminate()
}, 10*1000)


```

## Using with co

```js
const co = require('co')
const wq = new WaitQueue

// do loop until catch a TerminateError, use e.isTerminateQueue to check
co(function *(){
    while(true){
        let item = yield wq.shift()
        // catch errors from runTask, so that it won't stop the task loop
        try{
            yield runTask(item)
        }catch(e){
            // output errors
            console.error('error', item)
            // you can re do task from here
            wq.push(item)
            console.log('add error item to end of queue')
        }
    }
})

function runTask(item){
    return new Promise(function(resolve, reject){
        // a task will run 2s
        setTimeout(function(){
            if(Math.random() > 0.8){
                return reject(new Error('some unknown error'))
            }
            console.log('done', item)
            resolve()
        }, 1000)
    })
}

// add a task every 1s
var taskID = 0
setInterval(function(){
    wq.push({
        taskid: taskID++
    })
}, 1000)

// terminate after 10s
// setTimeout(function(){
//    wq.terminate()
// }, 10*1000)
```

## Methods

### wq.push(item)

Add an item to the end of the queue, will return true if item added to the queue,
if wait-queue is terminated, it will return false

### wq.shift().then( item => )

Got an item from front of the queue, this is a Promise method, if there's no item
in the queue, it will wait

### wq.unshift(item)

Put an item in front of the queue, will return true if item added to the queue,
if wait-queue is terminated, it will return false

### wq.pop().then( item => )

Got an item at the end of the queue, this is a Promise method, if there's no item
in the queue, it will wait

### wq.terminate()

Teminate the queue, and if there's any `shift()` or `pop()` waited, every method
will receive a TerminateError, you can use e.isTerminateQueue to check

### wq.empty()

Clear the queue that haven't assign

## Properties

### wq.queue

A plain javascript array, used to store the queue items

### wq.listeners

If no elements in queue yet, listener will add here, Don't modify it

### wq.terminated

Always be false, until `terminate()` is called

## Events

### terminate

This event will trigger after wq.terminate() is called

```js
wq.on('terminate', function(){
    console.log('terminated')
})
```

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/wait-queue.svg
[npm-url]: https://npmjs.org/package/wait-queue
[downloads-image]: http://img.shields.io/npm/dm/wait-queue.svg
[downloads-url]: https://npmjs.org/package/wait-queue