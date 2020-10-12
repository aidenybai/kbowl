const makeid = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

function create() {
  location = `${location.origin}/${makeid(4)}/host`;
}

function join() {
  const code = prompt('Enter Room Code')
  if (!code) return;
  location = `${location.origin}/${code}`;
}
