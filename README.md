# wait-queue

  A javascript wait queue object handle infinity loop tasks more efficiently (using ES6 class and promise)

## Installation

```
$ npm install wait-queue
```
## Examples

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

// do 
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

[npm-url]: https://npmjs.org/package/co
