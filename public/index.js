function join() {
  const code = prompt('Enter Room Code');
  if (!code || code.length !== 4) return alert('Invalid code (4 digit uppercase letter). Ask your host for the code.');
  location = `${location.origin}/${code.toUpperCase()}`;
}

const makeid = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

document.querySelector('#form').action = `/${makeid(4)}`