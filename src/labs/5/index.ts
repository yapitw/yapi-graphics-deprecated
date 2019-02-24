import PerlinNoise from '../../libs/PerlinNoise'
import { ParticleSystem } from '../../libs/Partical'

const perlin = new PerlinNoise()

export class Lab {
  app: HTMLDivElement
  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  height: number = 500
  width: number = 500
  gridSize: number = 25 // size of force saving
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
    this.cvs.style.width = '350px'
    this.cvs.style.height = '350px'
    ;(this.app ? this.app : document.querySelector('body')).appendChild(this.cvs)

    this.draw()
    this.update()
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw = () => {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  drawPerlin = () => {
    // this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'

    for (let x = 0; x < this.width / this.gridSize; x++) {
      for (let y = 0; y < this.height / this.gridSize; y++) {
        const alpha = perlin.noise(x * 0.03, y * 0.03, this.xoff)

        // this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize)

        this.ctx.beginPath()
        // this.ctx.globalAlpha = 1
        this.ctx.translate(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2)
        this.ctx.rotate(alpha * Math.PI * 8)
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(0, this.gridSize / 2)
        this.ctx.resetTransform()
        this.ctx.stroke()

        // this.ctx.globalAlpha = 1
        this.ctx.fillStyle = `rgb(${alpha * 255},${alpha * 255},${alpha * 255})`
        this.ctx.beginPath()
        this.ctx.arc((x + 0.5) * this.gridSize, (y + 0.5) * this.gridSize, this.gridSize / 6, 0, 2 * Math.PI)
        this.ctx.fill()
      }
    }
  }

  update = () => {
    this.draw()
    this.drawPerlin()
    this.xoff += 0.005

    window.requestAnimationFrame(this.update)
  }
}
