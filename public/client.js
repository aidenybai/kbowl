function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const socket = io();

const view = {
  buzzed: false,
  buzzerIcon: '<i class="fas fa-bell"></i>',
  score: `Score: 0`,
  teamName: null,
  seconds: 3,
  async buzz() {
    if (this.teamName === null || this.teamName.split(' ').join('') === '')
      return alert('Please enter a valid team name');
    this.teamName = this.teamName.trim();
    let buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
    if (Math.random() > 0.99) {
      buzzSound = new Audio(`${window.location.origin}/ahh.wav`);
    }
    buzzSound.play();
    socket.emit('client-buzz', { teamName: this.teamName });

    this.buzzed = true;
    this.seconds = 3;
    await delay(1000);
    this.seconds = 2;
    await delay(1000);
    this.seconds = 1;
    await delay(1000);
    this.buzzed = false;
  },
};

const app = Lucia.createApp(view);
app.mount('#app');

socket.on('server-score', (data) => {
  if (parseInt(data.teamName.replace('@@@', '')) === parseInt(app.$view.teamName)) {
    app.$view.score = `Score: ${data.score}`;
  }
});
