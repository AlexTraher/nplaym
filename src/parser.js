import _ from 'lodash';
import util from './util.js';

let setting, args;

const Parser = {};

Parser.set = function (terms) {
  const strippedTerms = _.clone(terms);
  _.remove(strippedTerms, i => /^-/.test(i))
 if (strippedTerms[0] === 'install' ||  strippedTerms[0] === 'i') {
   if (strippedTerms.length === 1) {
     setting = 'npmInstall';
   } else {
     setting = 'npmInstallSomething';
   }
 } else {
   setting = 'default';
 }
 args = strippedTerms;
}

Parser.parse = function (d) {
  const bits = d.toString().match(/[a-zA-Z0-9\-_]+/)
  switch (setting) {
    case 'npmInstall':
      if (bits) {
        const packName = bits[0].slice(0);
        return packName;
      }
      return util.getRandom(args);
    break;
    case 'npmInstallSomething':
      if (bits) {
        const packName = bits[0].slice(0);
        return packName;
      }
      return args;
    break;
    default:
      const justLetters = d.toString().replace(/[^a-zA-Z0-9]+/g, '');
      const noColourCodes = justLetters.replace(/[\d]+m/, ' ');
      return noColourCodes;
    break;
  }
}



export default Parser;