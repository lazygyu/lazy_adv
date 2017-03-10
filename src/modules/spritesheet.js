class SpriteSheet{
  constructor(img, w, h) {
    this.img = img;
    this.tileWidth = w;
    this.tileHeight = h;
    this.columns = this.img.width / w;
    this.rows = this.img.height / h;
    this.canvas = document.createElement("canvas");
    this.ctx = null;
    if( this.img.addEventListener )  this.img.addEventListener('load', () => { 
      this.columns = this.img.width / w;
      this.rows = this.img.height / h;
      this.canvas.width = img.width;
      this.canvas.height = img.height;
    });

    
  }

  draw(ctx, x, y, col, row) {
    if (this.img.width == 0 && this.img.height == 0) return;
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