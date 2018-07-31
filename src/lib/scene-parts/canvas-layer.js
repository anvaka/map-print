let wgl = require('w-gl');

export default class CanvasLayer extends wgl.Element {
  constructor(ctx) {
    super();
    this.ctx = ctx;
  }

  draw() {
    const {ctx} = this;

    // TODO: read dimensions from `this`?
    const {canvas} = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    let transform = this.worldTransform;

    let pixelRatio = this.scene.getPixelRatio();

    let scale = transform.scale/pixelRatio;
    let dx = transform.dx/pixelRatio;
    let dy = transform.dy/pixelRatio;
    ctx.transform(scale, 0, 0, scale, dx, dy);

    for (var i = 0; i < this.children.length; ++i) {
      var child = this.children[i];
      child.draw(ctx);
    }

    ctx.restore();
  }
}