function join() {
  const code = prompt('Enter Room Code');
  if (!code || code.length !== 4) return;
  location = `${location.origin}/${code.toUpperCase()}`;
}
