(function () {

   var log = console.log;

   var kaboot = require ('kaboot');
   var a = require ('astack');
   var dale = require ('dale');
   var teishi = require ('teishi');

   var monitor = exports;

   monitor.vmstat = function (aStack) {
      kaboot.do (aStack, [
         [kaboot.run, 'vmstat'],
         [function (aStack) {
            var raw = aStack.last.stdout.replace (/\r/g, '').split ('\n');
            var headings = raw [1].split (/ +/);
            var data = raw [2].split (/ +/);
            var output = {};
            dale.do (data, function (v, k) {
               if (v === '') return;
               output [headings [k]] = parseInt (v);
            });
            a.return (aStack, output);
         }]
      ]);
   }

}).call (this);
