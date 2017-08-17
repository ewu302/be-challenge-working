'use strict'

const PriorityQueue = require('priorityqueuejs');

module.exports = (logSources, printer) => {
  let priorityQueue = new PriorityQueue((a, b) => {
    return b.logEntry.date.getTime() - a.logEntry.date.getTime();
  });

  logSources.forEach((logSource, index) => {
    let logEntry = logSource.pop();
    if (logEntry) {
      let logEntryNode = {
        logEntry: logEntry,
        logSourcesInd: index
      };
      priorityQueue.enq(logEntryNode);
    }
  });

  while (priorityQueue.size()) {
    let logEntryNode = priorityQueue.deq();
    printer.print(logEntryNode.logEntry);

    let newLogEntry = logSources[logEntryNode.logSourcesInd].pop();
    if (newLogEntry) {
      let newlogEntryNode = {
        logEntry: newLogEntry,
        logSourcesInd: logEntryNode.logSourcesInd
      };
      priorityQueue.enq(newlogEntryNode);
    }
  }
  printer.done();
}
