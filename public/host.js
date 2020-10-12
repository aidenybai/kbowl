function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const socket = io();
const scores = {};
let entries = [];
let timer = 15;
let timerLock = false;
let room = document.getElementById('room').value;

const view = {
  add(data) {
    let buzzSound = new Audio(`${window.location.origin}/ding.wav`);
    buzzSound.play();
    const payload = `<tr>
      <td>${data.teamName}</td>
      <td>${new Date().toLocaleTimeString()}</td>
      <td>
        <button class="correct" onclick="correct('${
          data.teamName
        }'); this.disabled = true;"><i class="fas fa-check"></i></button> 
        <button onclick="this.parentNode.parentNode.remove(); if (entries.indexOf(entries.find(team => team.includes('${
          data.teamName
        }'))) === 0) { resetTimer(); startTimer(entries[0]); }; entries.splice(entries.indexOf(entries.find(team => team.includes('${
          data.teamName
        }'))), 1); this.disabled = true;"><i class="fas fa-times"></i></button>
      </td>
    </tr>`;
    if (entries.includes(payload)) return;
    entries.push(payload);
    change();
  },
};

const app = Lucia.createApp(view);
app.mount('#app');

socket.on('server-buzz', (data) => {
  if (data.room !== room) return;
  if (!(`@@@${data.teamName}` in scores)) {
    scores[`@@@${data.teamName}`] = 0;
  }
  if (entries.find((team) => team.includes(data.teamName))) return;

  app.$view.add(data);
  if (entries.length <= 1) startTimer(data.teamName);

  updateScores();
});

function updateScores() {
  document.querySelector('#teams').innerHTML = '';
  const sortedScores = Object.fromEntries(
    Object.entries({ ...scores }).sort(([, a], [, b]) => b - a)
  );
  for (const team in sortedScores) {
    document.querySelector('#teams').innerHTML += `<tr>
      <td>${DOMPurify.sanitize(team.replace('@@@', ''))}</td>
      <td>${DOMPurify.sanitize(scores[team]) || 0}</td>
      <td><button class="correct" onclick="this.parentNode.parentNode.remove(); deleteTeam('${team}')"><i class="fas fa-trash"></i> Delete</button></td>
    </tr>`;
  }
}

function change() {
  document.querySelector('#entries').innerHTML = entries.join('');
}

function correct(teamName) {
  entries = [];
  if (!(`@@@${teamName}` in scores)) scores[`@@@${teamName}`] = 0;
  socket.emit('client-score', { teamName, score: ++scores[`@@@${teamName}`], room });
  updateScores();
  change();
  stopTimer();
}

function deleteTeam(team) {
  delete scores[team];
}

function updateTimer() {
  document.querySelector('#timer').innerHTML =
    timer < 0 ? 'Waiting for entries...' : `Time: ${timer} s`;
}

async function startTimer(name) {
  if (timerLock) return;
  socket.emit('client-score', { teamName: name, score: scores[`@@@${name}`], room });
  timerLock = true;
  resetTimer();
  await delay(500);
  while (timer > 0) {
    if (entries.length === 0) {
      timerLock = false;
      return stopTimer();
    }
    await delay(1000);
    timer--;
    updateTimer();
  }
  timer = -1;
  timerLock = false;
  change();
}

function stopTimer() {
  timer = -1;
  updateTimer();
}

function resetTimer() {
  if (entries.length === 0) return stopTimer();
  timer = 15;
  updateTimer();
}

window.onbeforeunload = () => {
  return 'Are you sure you want to leave?';
};
