import PerlinNoise from '../../libs/PerlinNoise'
import { ParticleSystem, Particle, Vec2 } from './Particle'

const perlin = new PerlinNoise()

let particleDots
const forceMap = {}

export class Lab {
  app: HTMLDivElement
  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  height: number = 2000
  width: number = 3000
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
    this.cvs.style.width = '750px'
    this.cvs.style.height = '500px'
    ;(this.app ? this.app : document.querySelector('body')).appendChild(this.cvs)

    this.clear()
    particleDots = new ParticleSystem({
      limit: {
        x_min: 0,
        x_max: this.cvs.width,
        y_min: 0,
        y_max: this.cvs.height,
      },
    })
    particleDots.MAXIUM = 1000

    particleDots.draw = (particle: Particle) => {
      particle.speed.scale(0.95)
      particle.velocity =
        forceMap[`X${Math.floor(particle.x / this.gridSize)}Y${Math.floor(particle.y / this.gridSize)}`] ||
        new Vec2(0, 0)

      this.ctx.globalAlpha = 0.1
      this.ctx.fillStyle = '#ff1100'
      this.ctx.beginPath()
      this.ctx.translate(particle.x, particle.y)
      this.ctx.arc(0, 0, 1, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.resetTransform()
    }
    this.update()
  }

  clear = () => {
    this.ctx.globalAlpha = 1
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.globalAlpha = 1
  }

  drawPerlin = () => {
    // this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'

    for (let x = 0; x < this.width / this.gridSize; x++) {
      for (let y = 0; y < this.height / this.gridSize; y++) {
        const alpha = perlin.noise(x * 0.03, y * 0.03, this.xoff)

        const rotation = alpha * Math.PI * 8
        const newVec = new Vec2(Math.cos(rotation), Math.sin(rotation))
        newVec.scale(0.2)
        forceMap[`X${x}Y${y}`] = newVec
      }
    }
  }

  update = () => {
    // this.clear()
    this.drawPerlin()
    this.xoff += 0.002

    particleDots.update()
    window.requestAnimationFrame(this.update)
  }
}
