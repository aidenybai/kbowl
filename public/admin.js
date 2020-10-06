const socket = io();

const view = {
  entries: [],
};

const app = Lucia.createApp(view).mount('#app');

socket.on('server-buzz', (data) => {
  const buzzSound = new Audio(`${window.location.origin}/buzz.wav`);
  buzzSound.play();
  app.entries = [
    ...app.entries,
    `<tr>
    <td>${data.groupNumber}</td>
    <td>${0}</td>
  </tr>`,
  ];
});
