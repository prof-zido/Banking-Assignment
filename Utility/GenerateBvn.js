function generate11DigitString() {
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

module.exports = generate11DigitString;