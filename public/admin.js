function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const socket = io();
const scores = {};
let entries = [];
let timer = 15;
let timerLock = false;

const view = {
  add(data) {
    let buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
    if (Math.random() > 0.99) {
      buzzSound = new Audio(`${window.location.origin}/ahh.wav`);
    }
    buzzSound.play();
    const payload = `<tr>
      <td>${data.teamName}</td>
      <td>
        <button class="correct" onclick="correct('${data.teamName}'); this.disabled = true;"><i class="fas fa-check"></i> Correct</button> 
        <button onclick="this.parentNode.parentNode.remove(); entries.splice(entries.indexOf(entries.find(team => team.includes('${data.teamName}'))), 1); this.disabled = true;"><i class="fas fa-times"></i> Wrong</button>
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
  if (!(`@@@${data.teamName}` in scores)) {
    scores[`@@@${data.teamName}`] = 0;
  }
  app.$view.add(data);
  startTimer(data.teamName);
  updateScores();
});

function updateScores() {
  document.querySelector('#teams').innerHTML = '';
  for (const team in scores) {
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
  socket.emit('client-score', { teamName, score: ++scores[`@@@${teamName}`] });
  updateScores();
  change();
  stopTimer();
}

function deleteTeam(team) {
  delete scores[team];
}

function updateTimer() {
  document.querySelector('#timer').innerHTML = timer < 0 ? 'Waiting for entry...' : timer;
}

async function startTimer(name) {
  if (timerLock) return;
  timerLock = true;
  timer = 15;
  updateTimer();
  await delay(100);
  while (timer > 0) {
    await delay(1000);
    timer--;
    updateTimer();
  }
  entries.splice(entries.indexOf(entries.find(team => team.includes(name))), 1);
  timerLock = false;
  change();
  if (entries.length !== 0) startTimer(entries[0]);
  else {
    timer = -1;
    updateTimer() 
  }
}

function stopTimer() {
  timer = 0;
  updateTimer();
}

window.onbeforeunload = () => {
  return 'Are you sure you want to leave?';
};
