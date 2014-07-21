(function () {

   // Useful shorthand.
   var log = console.log;

   var kaboot = require ('kaboot');

   var a = require ('astack');

   var dale = require ('dale');
   var teishi = require ('teishi');

   var unix = exports;

   unix.scp = function (aStack, options) {

      // VALIDATION

      if (teishi.stop ([{
         compare: options,
         to: 'object',
         test: teishi.test.type,
         label: 'options passed to kaboot.unix.scp'
      }, {
         compare: dale.do (options, function (v, k) {return k}),
         to: ['from', 'to', 'recursive'],
         multi: 'each_of',
         label: 'Keys within options passed to kaboot.unix.scp'
      }, {
         compare: [options.from, options.to],
         to: ['string', 'object'],
         test: teishi.test.type,
         multi: 'each_of',
         label: 'options.from and options.to passed to kaboot.unix.scp'
      }, {
         compare: options.recursive,
         to: [true, false, undefined],
         multi: 'one_of',
         label: 'options.recursive passed to kaboot.unix.scp'
      }])) return a.return (aStack, false);

      var remote;
      if (teishi.type (options.from) === 'string') remote = options.to;
      else if (teishi.type (options.to) === 'string') {
         remote = options.from;
      }
      else {
         log ('options.from or options.to passed to kaboot.unix.scp must be a string path!');
         return a.return (aStack, false);
      }

      if (teishi.stop ([{
         compare: remote,
         to: 'object',
         test: teishi.test.type,
         label: 'remote object (either options.from or options.to) passed to kaboot.unix.scp'
      }, {
         compare: dale.do (remote, function (v, k) {return k}),
         to: ['host', 'key', 'path'],
         multi: 'each_of',
         label: 'Keys of remote object (either options.from or options.to) passed to kaboot.unix.scp'
      }, {
         compare: remote,
         to: 'string',
         test: teishi.test.type,
         multi: 'each',
         label: 'remote.host, remote.key and remote.path within remote object passed to kaboot.unix.scp'
      }])) return a.return (aStack, false);

      var command = ['scp', '-v', '-o StrictHostKeyChecking=no', '-i', remote.key];
      if (options.recursive) command.push ('-r');
      if (teishi.type (options.from) === 'object') {
         options.from = options.from.host + ':' + options.from.path;
      }
      else {
         options.to = options.to.host + ':' + options.to.path;
      }

      command = command.concat ([options.from, options.to]);

      kaboot.do (aStack, [
         ['Perform scp', kaboot.run, command]
      ]);
   }

   unix.tar = function (aStack, options) {
      if (teishi.stop ({
         compare: options,
         to: 'object',
         test: teishi.test.type,
         label: 'options passed to kaboot.unix.tar'
      })) return a.return (aStack, false);

      if (teishi.stop ([{
         compare: options.to,
         to: 'string',
         test: teishi.test.type,
         label: 'options.to passed to kaboot.unix.tar'
      }, {
         compare: [options.compress, options.extract],
         to: ['string', 'undefined'],
         test: teishi.test.type,
         multi: 'each_of',
         label: 'options.compress, options.extract'
      }, {
         compare: teishi.test.type (options.compress) === teishi.test.type (options.extract),
         to: false,
         label: 'options.compress and options.extract can\'t be defined simultaneously.'
      }])) return a.return (aStack, false);

      if (options.compress) {
         // We create these variables so that if you pass an absolute path to tar, you will still store the files without the absolute path.
         var root = kaboot.root (options.compress);
         var path = kaboot.last (options.compress);
         kaboot.do (aStack, ['Compress to tarfile', kaboot.run, root, ['tar', 'czvf', options.to, path]]);
      }

      else kaboot.do (aStack, ['Extract from tarfile', kaboot.run, ['tar', 'xzvf', options.extract, '-C', options.to]]);
      // XXX add dvzf check
   }

}).call (this);
