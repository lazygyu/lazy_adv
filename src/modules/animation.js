class Animation{
    /**
     * Create an animation instance.
     * @param {SpriteSheet} sheet 
     * @param {Array} frames 
     * @param {float} duration 
     * @param {boolean} loop 
     */
  constructor(sheet, frames, duration, loop) {
    this.sheet = sheet;
    this.frames = frames;
    this.duration = duration;
    this.durationPerFrame = this.duration / this.frames.length;
    this.loop = loop || false;
    this.done = false;
    this.elapsed = 0;
    this.cur = 0;
  }

  /**
   * update this animation's state
   * @param {float} delta elapsed time after last call
   */
  update(delta) {
    if( this.done ) return;
    this.elapsed += delta;
    if( !this.loop && this.elapsed >= this.duration){
        this.cur = this.frames.length-1;
        this.done = true;
        return;
    }
    while (this.elapsed >= this.durationPerFrame) {
      this.elapsed -= this.durationPerFrame;
      this.cur++;
    }
    this.cur %= this.frames.length;
  }

/**
 * render this animation to canvas
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 */
  draw(ctx, x, y) {
    this.sheet.draw(ctx, x, y, this.frames[this.cur]);
  }
}

module.exports = Animation;