function join() {
  const code = prompt('Enter Room Code');
  if (!code || code.length !== 4) return alert('Invalid code (4 digit uppercase letter). Ask your host for the code.');
  location = `${location.origin}/${code.toUpperCase()}`;
}