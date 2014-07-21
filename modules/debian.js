(function () {

   // Useful shorthand.
   var log = console.log;

   var kaboot = require ('kaboot');

   var a = require ('astack');

   var dale = require ('dale');
   var teishi = require ('teishi');

   var debian = exports;

   // XXX All these functions use sudo. Is it necessary to parametrize this?

   debian.addRepo = function (aStack, repo) {
      if (teishi.stop ({
         compare: repo,
         to: 'string',
         test: teishi.test.type,
         label: 'repo argument passed to kaboot.debian.addRepo'
      })) return a.return (aStack, false);

      kaboot.do (aStack, ['Add debian repo ' + repo, kaboot.run, 'sudo add-apt-repository -y ppa:' + repo]);
   }

   debian.update = function (aStack) {
      kaboot.do (aStack, [kaboot.run, 'sudo apt-get update']);
   }

   debian.upgrade = function (aStack) {
      kaboot.do (aStack, [kaboot.run, 'sudo apt-get upgrade -y']);
   }

   debian.install = function (aStack, packages) {
      if (teishi.stop ([{
         compare: packages,
         to: ['string', 'array'],
         test: teishi.test.type,
         multi: 'one_of',
         label: 'packages argument passed to kaboot.debian.install'
      }, {
         compare: packages,
         to: 'string',
         test: teishi.test.type,
         multi: 'each',
         label: 'each element of packages argument passed to kaboot.debian.install'
      }])) return a.return (aStack, false);

      if (teishi.type (packages) === 'array') packages = packages.join (' ');

      kaboot.do (aStack, [kaboot.run, ['sudo apt-get install -y', packages]]);
   }

}).call (this);
