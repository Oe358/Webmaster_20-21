const { MathematicaKernel } = require('mathematica.js');
const http = require('http');
const mathKernel = new MathematicaKernel("");

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  let output = "";
  //
  // const queries = [
  //   'Integrate[1/(x^3 - 1), x]',
  //   'ExportString[Log[I] // TeXForm,"String"]',
  //   'Factor[x^2-2x]',
  //   'testVar * 4',
  //   'Do[0, Infinity]',
  // ];
  //
  // // mathKernel.run(query: string, expectResult: boolean)
  // mathKernel.run('testVar := 4', false);
  //
  // for (const query of queries) {
  //   mathKernel.run(query).then(result => {
  //     output = output + `In: ${query}\nOut: ${JSON.stringify(result)}\n`
  //   });
  // }
  //
  // setTimeout(() => {
  //   mathKernel.destroy()
  // }, 4000);
  res.end('Hello World: ', output);
}).listen(3000);

