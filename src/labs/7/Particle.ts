import { random } from '../../libs/Math'

export class Vec2 {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  get u() {
    return this.x
  }
  get v() {
    return this.y
  }
  add = (vec: Vec2) => {
    this.x += vec.x
    this.y += vec.y
  }
  deduect = (vec: Vec2) => {
    this.x -= vec.x
    this.y -= vec.y
  }
  scale = (factor: number) => {
    this.x *= factor
    this.y *= factor
  }
  normalize = () => {
    this.x /= this.magnitude()
    this.y /= this.magnitude()
  }
  magnitude = () => {
    const { pow } = Math
    const { x, y } = this
    return pow(pow(x, 2) + pow(y, 2), 0.5)
  }
}

interface IPartical {
  x: number
  y: number
}
export class Particle {
  position: Vec2
  speed: Vec2
  velocity: Vec2
  mass: number
  kill: boolean
  age: number
  constructor({ x, y }: IPartical) {
    this.age = 0
    this.kill = false
    this.position = new Vec2(x, y)
    this.speed = new Vec2(random(-1, 1), random(-1, 1))
    this.mass = random(1, 3)
    // this.speed = new Vec2(0, 0)
    this.speed.scale(5)
    this.velocity = new Vec2(0, 0)
  }

  update() {
    this.age++
    this.speed.scale(this.mass)
    this.speed.add(this.velocity)
    this.speed.scale(1 / this.mass)
    this.position.add(this.speed)
  }

  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
  }
}

interface ILimit {
  x_min: number
  x_max: number
  y_min: number
  y_max: number
}

export class ParticleSystem {
  animationRequestID: number
  particles: Particle[]
  time: number
  MAXIUM: number
  limit: ILimit = {
    x_min: 0,
    y_min: 0,
    x_max: 300,
    y_max: 300,
  }
  constructor({ limit }: { limit: ILimit }) {
    this.MAXIUM = 50
    if (limit) this.limit = limit
    this.init()
  }

  init = () => {
    this.particles = []
    this.time = 0
  }

  update = () => {
    for (let i = 0; i < 10; i++) {
      if (this.particles.length < this.MAXIUM) {
        const particle = new Particle({ x: random(0, 1) * this.limit.x_max, y: random(0, 1) * this.limit.y_max })
        this.particles.push(particle)
      }
    }

    this.particles.forEach(particle => {
      if (particle.x > this.limit.x_max) particle.position.x -= this.limit.x_max
      if (particle.x < this.limit.x_min) particle.position.x += this.limit.x_max
      if (particle.y > this.limit.y_max) particle.position.y -= this.limit.y_max
      if (particle.y < this.limit.y_min) particle.position.y += this.limit.y_max
      // if (particle.age > 100) particle.kill = true
      particle.update()
      this.draw(particle)
    })

    this.particles = this.particles.filter(particle => !particle.kill)
  }

  draw = (particle: Particle): void => {}
}
