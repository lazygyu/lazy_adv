class SpriteSheet{
  constructor(img, w, h) {
    this.img = img;
    this.tileWidth = w;
    this.tileHeight = h;
    this.columns = this.img.width / w;
    this.rows = this.img.height / h;
    this.img.addEventListener('load', () => { 
      this.columns = this.img.width / w;
    this.rows = this.img.height / h;
    });
  }

  draw(ctx, x, y, col, row) {
    if (row == null) {
      let c = col % this.columns;
      let r = Math.floor(col / this.columns);
      ctx.drawImage(this.img, c * this.tileWidth, r * this.tileHeight, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
    } else {
      ctx.drawImage(this.img, col * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
    }
  }
}

module.exports = SpriteSheet;