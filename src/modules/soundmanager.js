class SoundManager{
  constructor() {
    this.sounds = {};

  }

  add(name, path) {
    if (this.sounds[name]) return;
    let tmp = new Audio(path);
    this.sounds[name] = tmp;
  }

  play(name) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
    }
  }
}

SoundManager.instance = null;
SoundManager.getInstance = function () {
  if (this.instance === null) {
    this.instance = new SoundManager();
  }
  return this.instance;
}

module.exports = SoundManager.getInstance();