class CallService {
  constructor(provider, answers) {
    this.provider = provider;
    this.answers = answers;
  }

  async transfer(CallUUID, options) {
    return this.provider.transfer(CallUUID, options);
  }

  async makeCall(options) {
    return this.provider.makeCall(options);
  }

  getAnswer(name, params) {
    return this.answers[name] ? this.answers[name](params) : null;
  }
}

module.exports = CallService;
