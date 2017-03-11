class Logger{
  constructor() {
    this.messages = [];
  }

  push(msg, type) {
    if (type == null) {
      type = "log";
    }

    this.messages.push({ msg: msg, type: type });
  }

  render(ctx) {
    
  }
}

Logger.instance = null;
Logger.getInstance = function () {
  if (Logger.instance === null) {
    Logger.instance = new Logger();
  }
  return Logger.instance;
}

module.exports = Logger.getInstance();