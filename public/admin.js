const socket = io();
const scores = {};

const view = {
  entries: [],
  add(data) {
    const buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
    buzzSound.play();
    const payload = `<tr>
      <td>${data.teamName}</td>
      <td><button class="correct" onclick="correct('${data.teamName}'); this.disabled = true;"><i class="fas fa-check"></i> Correct</button></td>
    </tr>`;
    if (this.entries.includes(payload)) return;
    this.entries.push(payload);
  },
};

const MutationObserver =
  window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const observer = new MutationObserver(change);
observer.observe(document.querySelector('#app > div'), {
  childList: true,
});

const app = Lucia.createApp(view);
app.mount('#app');

socket.on('server-buzz', (data) => {
  if (!(`@@@${data.teamName}` in scores)) {
    scores[`@@@${data.teamName}`] = 0;
  }
  app.$view.add(data);
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
  document.querySelector('#entries').innerHTML = app.$view.entries.join('');
}

function correct(teamName) {
  if (!(`@@@${teamName}` in scores)) scores[`@@@${teamName}`] = 0; 
  socket.emit('client-score', { teamName, score: ++scores[`@@@${teamName}`] });
  updateScores();
}

function deleteTeam(team) {
  delete scores[team]; 
}