/*
kaboots - v0.9.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source (but not just yet!).
*/

(function () {

   var dale   = require ('dale');
   var teishi = require ('teishi');
   var k      = require ('kaboot');

   var debian = exports.debian = {};

   debian.update = ['Upgrading debian packages', [
      ['Updating packages',  k.run, 'apt-get update'],
      ['Upgrading packages', k.run, 'apt-get upgrade -y']
   ]];

   debian.install = function (s, packages) {
      if (teishi.t (packages) === 'string') packages = [packages];
      if (teishi.stop ('debian.install', ['packages', packages, 'string', 'each'])) return false;

      return ['Install debian packages', k.run, ['apt-get install -y', packages.join (' ')]];
   }

   debian.mapTo80 = function (s, port) {
      if (teishi.stop ('debian.mapTo80', [
         ['port', port, 'integer'],
         ['port', port, {min: 1, max: 65535}]
      ])) return false;

      return [['Map port', port, 'to port 80'].join (' '), kaboot.run, ['iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports', port]];
   }

}) ();
