const socket = io();
const scores = {};

const view = {
  entries: [],
  add(data) {
    const buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
    buzzSound.play();
    if (this.entries.includes(`<tr>
      <td>${data.groupNumber}</td>
      <td><button class="correct" onclick="correct(${data.groupNumber}); this.disabled = true;"><i class="fas fa-check"></i> Correct</button></td>
    </tr>`)) return;
    this.entries.push(`<tr>
      <td>${data.groupNumber}</td>
      <td><button class="correct" onclick="correct(${data.groupNumber}); this.disabled = true;"><i class="fas fa-check"></i> Correct</button></td>
    </tr>`);
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
  if (!(`group-${data.groupNumber}` in scores)) {
    scores[`group-${data.groupNumber}`] = 0;
  }
  app.$view.add(data);
  updateScores();
});

function updateScores() {
  document.querySelector('#groups').innerHTML = '';
  for (const group in scores) {
    document.querySelector('#groups').innerHTML += `<tr>
      <td>${group.replace('group-', '')}</td>
      <td>${scores[group]}</td>
    </tr>`;
  }
}

function change() {
  document.querySelector('#entries').innerHTML = app.$view.entries.join('');
}

function correct(groupNumber) {
  socket.emit('client-score', { groupNumber, score: ++scores[`group-${groupNumber}`] });
  updateScores();
}
