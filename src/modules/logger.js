class Logger{
  constructor() {
    this.messages = [];
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