'use strict'

module.exports = (logSources, printer) => {
  console.log(logSources);
  printer.print(logSources[0].pop())
  // do {
  //   var test = logSources[0].pop();
  //   console.log(test);
  // } while (test);
	throw new Error('Not implemented yet!  That part is up to you!')
}
