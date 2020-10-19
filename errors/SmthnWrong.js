class SmthnWrong extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = SmthnWrong;
