let wgl = require('w-gl');

export default class TextCanvasElement extends wgl.Element {
  constructor(text) {
    super();
    this.text = 'Hello world';
  }

  draw(ctx) {
    ctx.fillText(this.text, 0, 0);
  }
}
