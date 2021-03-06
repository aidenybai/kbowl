function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let room = document.getElementById('room').value;

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
    if (this.teamName.length > 25)
      return alert('Team length too long! Max 25');
    this.teamName = this.teamName.trim();
    let buzzSound = new Audio(`${window.location.origin}/ding.wav`);
    buzzSound.play();
    socket.emit('client-buzz', { teamName: `${this.teamName}|||${Date.now()}`, room });

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
  const [teamName, ping] = data.teamName.split('|||');
  const pfinal = Date.now() - parseInt(ping);
  if (data.room !== room) return;
  if (teamName === app.$view.teamName) {
    app.$view.score = `Score: ${data.score} - Ping: ${pfinal < 0 ? 'null ' : pfinal}ms`;
  }
});
