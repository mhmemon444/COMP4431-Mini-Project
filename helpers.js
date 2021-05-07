const CONSTANTS = {
  COLORS: [
    '#EE2B29',
    '#ff9800',
    '#ffff00',
    '#c6ff00',
    '#00e5ff',
    '#2979ff',
    '#651fff',
    '#d500f9',
    '#00FFFF',
    '#7FFF00',
    '#FF7F50',
    '#6495ED',
    '#DC143C',
    '#FF8C00',
    '#FF1493',
    '#1E90FF',
    '#FFD700',
    '#ADFF2F',
    '#FA8072',
    '#FF00FF',
    '#00FFFF',
    '#87CEEB',
    '#00FF7F',
    '#EE82EE',
  ],
};

class VisualKey {
  constructor() {
    this.keys = []; // the keys floating on the screen.

    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.lineWidth = 4;
    this.context.lineCap = 'round';
    this.contextHeight = 0;
  }

  resize(keyHeight) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = this.contextHeight =
      window.innerHeight - keyHeight - 20;
  }

  addKey(key, x, width) {
    const keyToVisualize = {
      x: parseFloat(x),
      y: 0,
      width: parseFloat(width),
      height: 0,
      color: CONSTANTS.COLORS[key],
      on: true,
    };

    this.keys.push(keyToVisualize);
    return keyToVisualize;
  }

  stopKey(keyToVisualize) {
    keyToVisualize.on = false;
  }

  drawLoop() {
    const dy = 5;
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.keys = this.keys.filter(
      (key) => key.on || key.y < this.contextHeight - 100
    );
    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i];
      if (key.on) {
        key.height += dy;
      } else {
        key.y += dy;
      }

      this.context.globalAlpha = 1 - key.y / this.contextHeight;
      this.context.fillStyle = key.color;
      this.context.fillRect(key.x, key.y, key.width, key.height);
    }

    window.requestAnimationFrame(() => this.drawLoop());
  }
}
