export default class PerlinNoise {
  PERLIN_YWRAPB: number
  PERLIN_YWRAP: number
  PERLIN_ZWRAPB: number
  PERLIN_ZWRAP: number
  PERLIN_SIZE: number
  perlin: number[]
  perlin_octaves: number
  perlin_amp_falloff: number

  constructor() {
    this.PERLIN_YWRAPB = 4
    this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB
    this.PERLIN_ZWRAPB = 8
    this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB
    this.PERLIN_SIZE = 4095
    this.perlin = null
    this.perlin_octaves = 4 // default to medium smooth
    this.perlin_amp_falloff = 0.5 // 50% reduction/octave

    this.noise = this.noise.bind(this)
    this.noiseDetail = this.noiseDetail.bind(this)
    this.noiseSeed = this.noiseSeed.bind(this)
  }

  noise(x: number, y?: number, z?: number): number {
    const {
      PERLIN_SIZE,
      perlin_octaves,
      perlin_amp_falloff,
      PERLIN_YWRAPB,
      PERLIN_YWRAP,
      PERLIN_ZWRAPB,
      PERLIN_ZWRAP,
    } = this
    y = y || 0
    z = z || 0

    if (this.perlin == null) {
      this.perlin = new Array(PERLIN_SIZE + 1)
      for (var i = 0; i < PERLIN_SIZE + 1; i++) {
        this.perlin[i] = Math.random()
      }
    }

    if (x < 0) {
      x = -x
    }
    if (y < 0) {
      y = -y
    }
    if (z < 0) {
      z = -z
    }

    var xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z)
    var xf = x - xi
    var yf = y - yi
    var zf = z - zi
    var rxf, ryf

    var r = 0
    var ampl = 0.5

    var n1, n2, n3

    for (var o = 0; o < perlin_octaves; o++) {
      var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB)

      rxf = scaled_cosine(xf)
      ryf = scaled_cosine(yf)

      n1 = this.perlin[of & PERLIN_SIZE]
      n1 += rxf * (this.perlin[(of + 1) & PERLIN_SIZE] - n1)
      n2 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]
      n2 += rxf * (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2)
      n1 += ryf * (n2 - n1)

      of += PERLIN_ZWRAP
      n2 = this.perlin[of & PERLIN_SIZE]
      n2 += rxf * (this.perlin[(of + 1) & PERLIN_SIZE] - n2)
      n3 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]
      n3 += rxf * (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3)
      n2 += ryf * (n3 - n2)

      n1 += scaled_cosine(zf) * (n2 - n1)

      r += n1 * ampl
      ampl *= perlin_amp_falloff
      xi <<= 1
      xf *= 2
      yi <<= 1
      yf *= 2
      zi <<= 1
      zf *= 2

      if (xf >= 1.0) {
        xi++
        xf--
      }
      if (yf >= 1.0) {
        yi++
        yf--
      }
      if (zf >= 1.0) {
        zi++
        zf--
      }
    }
    return r
  }

  noiseDetail(lod, falloff) {
    if (lod > 0) {
      this.perlin_octaves = lod
    }
    if (falloff > 0) {
      this.perlin_amp_falloff = falloff
    }
  }

  noiseSeed(seed) {
    const { PERLIN_SIZE } = this
    // Linear Congruential Generator
    // Variant of a Lehman Generator
    var lcg = (function() {
      // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
      var m = 4294967296
      // a - 1 should be divisible by m's prime factors
      var a = 1664525
      // c and m should be co-prime
      var c = 1013904223
      var seed, z
      return {
        setSeed: function(val) {
          // pick a random seed if val is undefined or null
          // the >>> 0 casts the seed to an unsigned 32-bit integer
          z = seed = (val == null ? Math.random() * m : val) >>> 0
        },
        getSeed: function() {
          return seed
        },
        rand: function() {
          // define the recurrence relationship
          z = (a * z + c) % m
          // return a float in [0, 1)
          // if z = m then z / m = 0 therefore (z % m) / m < 1 always
          return z / m
        },
      }
    })()

    lcg.setSeed(seed)
    this.perlin = new Array(PERLIN_SIZE + 1)
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      this.perlin[i] = lcg.rand()
    }
  }
}

function scaled_cosine(i) {
  return 0.5 * (1.0 - Math.cos(i * Math.PI))
}
