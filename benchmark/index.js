'use strict';
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var WaitQueue = require('../dist/index');
var LinkedList = require('../dist/libs/LinkedList');
var Buffer = require('buffer').Buffer;

var newBuffer;
if (typeof Buffer.allocUnsafe === 'function') {
  newBuffer = function(size) {
    return Buffer.allocUnsafe(size);
  };
} else {
  newBuffer = function(size) {
    return new Buffer(size);
  };
}

var wq = new WaitQueue();
var array = [];
suite.add('Array.push(1k data) speed test', function() {
  array.push(newBuffer(1024));
});
suite.add(
  'Array.push(1k data) 1000000 times then Array.shift() speed test',
  function() {
    array.shift();
  },
  {
    onStart: function() {
      for (let n = 0; n < 1000000; n++) {
        array.push(newBuffer(1024));
      }
    },
    onCycle: function() {
      array.push(newBuffer(1024));
    },
  }
);
suite.add('WaitQueue.push(1k data) speed test', function() {
  wq.push(newBuffer(1024));
});
suite.add('WaitQueue.unshift(1k data) speed test', function() {
  wq.unshift(newBuffer(1024));
});
suite.add('WaitQueue.shift() speed test', function() {
  wq.shift();
});
suite.add('WaitQueue.pop() speed test', function() {
  wq.pop();
});
suite.add(
  'WaitQueue.push(1k data) 1000000 times then WaitQueue.shift() speed test',
  function() {
    wq.shift();
  },
  {
    onStart: function() {
      for (let n = 0; n < 1000000; n++) {
        wq.push(newBuffer(1024));
      }
    },
    onCycle: function() {
      wq.push(newBuffer(1024));
    },
  }
);
suite.add(
  'WaitQueue.push(1k data) 1000000 times then WaitQueue.pop() speed test',
  function() {
    wq.pop();
  },
  {
    onStart: function() {
      for (let n = 0; n < 1000000; n++) {
        wq.push(newBuffer(1024));
      }
    },
    onCycle: function() {
      wq.unshift(newBuffer(1024));
    },
  }
);
suite.add('Array.push(4k data) speed test', function() {
  array.push(newBuffer(4096));
});
suite.add(
  'Array.push(4k data) 1000000 times then Array.shift() speed test',
  function() {
    array.shift();
  },
  {
    onStart: function() {
      for (let n = 0; n < 1000000; n++) {
        array.push(newBuffer(4096));
      }
    },
    onCycle: function() {
      array.push(newBuffer(4096));
    },
  }
);
suite.add('WaitQueue.push(4k data) speed test', function() {
  wq.push(newBuffer(4096));
});
suite.add('WaitQueue.unshift(4k data) speed test', function() {
  wq.unshift(newBuffer(4096));
});
suite.add(
  'WaitQueue.push(4k data) 1000000 times then WaitQueue.shift() speed test',
  function() {
    wq.shift();
  },
  {
    onStart: function() {
      for (let n = 0; n < 1000000; n++) {
        wq.push(newBuffer(1024));
      }
    },
    onCycle: function() {
      wq.push(newBuffer(4096));
    },
  }
);
suite.add(
  'WaitQueue.push(4k data) 1000000 times then WaitQueue.pop() speed test',
  function() {
    wq.pop();
  },
  {
    onStart: function() {
      for (let n = 0; n < 1000000; n++) {
        wq.push(newBuffer(1024));
      }
    },
    onCycle: function() {
      wq.unshift(newBuffer(4096));
    },
  }
);

suite
  .on('cycle', function(event) {
    console.log(String(event.target));
    array = [];
    wq.empty();
    wq.listeners = new LinkedList();
  })
  .on('error', function(err) {
    console.error(err);
  })
  .run({ queued: true });
