/*
kaboots - v0.9.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source (but not just yet!).
*/

(function () {

   var dale   = require ('dale');
   var teishi = require ('teishi');
   var k      = require ('kaboot');

   var unix = exports.unix = {};

   unix.scp = function (s, options) {

      if (teishi.stop ('unix.scp', [
         ['options', options, 'object'],
         function () {return [
            ['options keys', dale.keys (options), ['from', 'to', 'recursive', 'verbose'], 'eachOf', teishi.test.equal],
            ['options.from', options.from, ['string', 'object'], 'oneOf'],
            ['options.to',   options.to,   ['string', 'object'], 'oneOf'],
            [teishi.t (options.from) === 'string', ['type of options.to when options.from is a string', options.to, 'object']],
            [teishi.t (options.from) === 'object', ['type of options.to when options.from is an object ', options.to, 'string']],
         ]}
      ])) return false;

      var remote = teishi.t (options.from) === 'string' ? options.to : options.from;

      if (teishi.stop ('unix.scp', [
         ['remote', remote, 'object'],
         ['remote keys', dale.keys (remote), ['host', 'key', 'path'], 'eachOf', teishi.test.equal],
         ['remote options', remote, ['string', 'undefined'], 'eachOf']
      ])) return false;

      dale.do (remote, function (v, k) {
         if (v === true) remote [k] = s.vars [k];
      });

      var command = ['scp', options.verbose ? '-v' : '', '-o StrictHostKeyChecking=no', remote.key ? ['-i', remote.key] : '' , options.recursive ? '-r' : ''];

      if (teishi.t (options.from) === 'object') options.from = options.from.host + ':' + options.from.path;
      else                                      options.to   = options.to.host + ':' + options.to.path;

      return [k.run, command.concat ([options.from, options.to])];
   }

   unix.tar = function (s, options) {
      if (teishi.stop ('unix.tar', [
         ['options', options, 'object'],
         function () {return [
            ['options.to', options.to, 'string'],
            ['options.compress', options.compress, ['string', 'undefined'], 'oneOf'],
            [teishi.t (options.compress) === 'string', ['options.extract when options.compress is a string', options.extract, 'undefined']],
         ]}
      ])) return false;

      if (options.compress) {
         var root = k.path.root (options.compress);
         var path = k.path.last (options.compress);
         return ['Compress to tarfile', k.run, root, ['tar', 'czvf', options.to, path]];
      }

      var command = ['Extract from tarfile', k.run, ['tar', 'xzvf', options.extract, '-C', options.to]];
      if (options.strip) extract [extract.length - 1].push (['--strip-components', options.strip]);
      return command;
   }

   unix.vmstat = [
      ['Running vmstat', k.run, 'vmstat'],
      ['Processing data', function (s, last) {
         var raw = last.stdout.replace (/\r/g, '').split ('\n');
         var headings = raw [1].split (/ +/);
         var data = raw [2].split (/ +/);
         var output = {};
         dale.do (data, function (v, k) {
            if (v === '') return;
            output [headings [k]] = parseInt (v);
         });
         k.return (s, output);
      }]
   ];

}) ();
