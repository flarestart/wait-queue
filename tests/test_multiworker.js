'use strict'
const WaitQueue = require('../index')
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