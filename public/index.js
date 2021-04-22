const Collapsable = Lucia.component(
  'Collapsable',
  ({ args }) => `
    <details>
    <summary>${args[0]}</summary>
    ${args[1]}
    </details>
  `
);

const app = Lucia.use(
  'App',
  {
    makeid(length) {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    },
    join() {
      const code = prompt('Enter Room Code');
      if (!code || code.length !== 5) {
        return alert('Invalid code (5 digit uppercase letter). Ask your host for the code.');
      }
      location = `${location.origin}/${code.toUpperCase()}`;
    },
  },
  Collapsable
);
