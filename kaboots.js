/*
kaboots - v0.9.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source (but not just yet!).
*/

(function () {

   var dale = require ('dale');
   var k    = require ('kaboot');
   var fs   = require ('fs');

   var kaboots = exports;

   dale.do (fs.readdirSync (k.path.join (__dirname, 'modules')), function (v) {
      if (v.match (/.js$/)) k.extend (v.replace (/^/, __dirname + '/modules/'));
   });

}) ();
