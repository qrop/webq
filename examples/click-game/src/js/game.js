var score = 0;

function start() {
  console.log('Game started');

  document.getElementById('game-button').addEventListener('click', function () {
    document.getElementById('score').innerHTML = ++score;
  });
}

module.exports = {
  start: start
};
