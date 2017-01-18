'use strict'
const WaitQueue = require('../index')
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