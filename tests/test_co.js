'use strict'
const WaitQueue = require('../index')
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