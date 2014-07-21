(function () {
   var kaboot = require ('kaboot');
   var dale = require ('dale');
   var fs = require ('fs');

   var kaboots = exports;

   dale.do (fs.readdirSync (kaboot.join (__dirname, 'modules')), function (v) {
      if (v.match (/.js$/)) {
         kaboots [v.replace (/.js$/, '')] = require ('./modules/' + v);
      }
   });

}).call (this);
