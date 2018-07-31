let wgl = require('w-gl');

export default class KMLLayer extends wgl.Element {
  constructor(file, projector) {
    super();
    this.paths = file.paths.map((path) => toXYCoordinates(path, projector));
    this.strokeWidth = 2;
    this.color = {
      r: 255, g: 0, b: 0, a: 1
    }
    this.updateColor(this.color);
  }

  draw(ctx) {
    let transform = this.worldTransform;
    let pixelRatio = this.scene.getPixelRatio();
    let scale = transform.scale/pixelRatio;

    ctx.lineWidth = this.strokeWidth/scale;
    ctx.strokeStyle = this.colorStr;
    this.paths.forEach(p => {
      ctx.beginPath();
      let el = p[0];
      ctx.moveTo(el.x, el.y);
      for (let i = 1; i < p.length; ++i) {
        el = p[i];
        ctx.lineTo(el.x, el.y);
      }
      ctx.stroke();
    })
  }

  updateColor(newColor) {
    this.color = newColor;
    const {r, g, b, a} = this.color;
    this.colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}


function toXYCoordinates(path, projector) {
  return path.map(el => {
    return projector(el.lon, el.lat);
  })
}