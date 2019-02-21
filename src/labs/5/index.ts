import PerlinNoise from '../../libs/PerlinNoise'

const perlin = new PerlinNoise()

export class Lab {
  app: HTMLDivElement
  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  height: number = 350
  width: number = 350
  gridSize: number = 14 // size of force saving
  xoff: number = 0
  yoff: number = 0
  zoff: number = 0
  constructor() {
    this.app = document.querySelector('#app')
    this.cvs = document.createElement('canvas')
    this.ctx = this.cvs.getContext('2d')
    this.init()
  }

  init = () => {
    this.cvs.width = this.width
    this.cvs.height = this.height
    ;(this.app ? this.app : document.querySelector('body')).appendChild(this.cvs)

    this.draw()
    this.update()
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw = () => {
    this.ctx.fillStyle = '#f2f2f2'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  drawPerlin = () => {
    this.ctx.strokeStyle = '#000'
    this.ctx.beginPath()

    for (let x = 0; x < this.width / this.gridSize; x++) {
      for (let y = 0; y < this.height / this.gridSize; y++) {
        const alpha = perlin.noise(x * 0.1, y * 0.1, this.xoff)
        // this.ctx.globalAlpha = alpha * 0.1
        // this.ctx.fillStyle = 'rgb(0,0,0)'
        // this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize)
        this.ctx.translate(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2)
        this.ctx.rotate(alpha * Math.PI * 2)
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(0, this.gridSize / 2)
        this.ctx.resetTransform()
      }
    }
    this.ctx.stroke()
  }

  update = () => {
    this.draw()
    this.drawPerlin()
    this.xoff += 0.01
    window.requestAnimationFrame(this.update)
  }
}
