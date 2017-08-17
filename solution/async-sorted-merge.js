'use strict'

const PriorityQueue = require('priorityqueuejs');
const P = require('bluebird')

module.exports = (logSources, printer) => {
  let priorityQueue = new PriorityQueue((a, b) => {
    return b.logEntry.date.getTime() - a.logEntry.date.getTime();
  });

  let initPromises = [];
  logSources.forEach((logSource, index) => {
    initPromises.push(logSource.popAsync().then((logEntry) => {
      if (logEntry) {
        let logEntryNode = {
          logEntry: logEntry,
          logSourcesInd: index
        };
        priorityQueue.enq(logEntryNode);
      }
    }));
  });

  P.all(initPromises).then(() => {
    printAndEnqueueAllLogEntries().then(() => {
      printer.done();
    });
  });

  function printAndEnqueueAllLogEntries() {
    let logEntryNode = priorityQueue.deq();
    printer.print(logEntryNode.logEntry);

    return logSources[logEntryNode.logSourcesInd].popAsync().then((newLogEntry) => {
      if (newLogEntry) {
        let newlogEntryNode = {
          logEntry: newLogEntry,
          logSourcesInd: logEntryNode.logSourcesInd
        };
        priorityQueue.enq(newlogEntryNode);
      }
      if (priorityQueue.size()) {
        return printAndEnqueueAllLogEntries();
      }
    });
  }
}
