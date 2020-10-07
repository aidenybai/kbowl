function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const socket = io();

const view = {
  buzzed: false,
  buzzerIcon: '<i class="fas fa-bell"></i>',
  score: `Score: 0`,
  groupNumber: null,
  seconds: 3,
  async buzz() {
    if (isNaN(this.groupNumber) || this.groupNumber === null)
      return alert('Please enter a valid group number');
    const buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
    buzzSound.play();
    socket.emit('client-buzz', { groupNumber: this.groupNumber });

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
  if (parseInt(data.groupNumber) === parseInt(app.$view.groupNumber)) {
    app.$view.score = `Score: ${data.score}`;
  }
});
