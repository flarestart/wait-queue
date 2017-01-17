const WaitQueue = require('../index')
const wq = new WaitQueue

// do loop while catch a error
function loop(){
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
