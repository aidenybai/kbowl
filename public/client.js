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
    const buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
    buzzSound.play();
    socket.emit('client-buzz', { groupNumber: this.groupNumber });
    console.log(this.groupNumber);
    if (isNaN(this.groupNumber) || this.groupNumber === null) return alert('Please enter a valid group name');

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

const app = Lucia.createApp(view).mount('#app');
