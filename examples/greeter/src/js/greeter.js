var announcer = require('./announcer.js');

module.exports = {
  greet: function (name) {
    announcer.announce('Hello ' + name + ', have a nice day!');
  }
};
