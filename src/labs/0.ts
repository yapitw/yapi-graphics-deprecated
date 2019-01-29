import * as THREE from 'three'

interface IUniforms {
  u_time: { type: 'f'; value: number }
  u_resolution: { type: 'v2'; value: THREE.Vector2 }
  u_mouse: { type: 'v2'; value: THREE.Vector2 }
}

class Lab {
  camera: THREE.OrthographicCamera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  uniforms: IUniforms
  pixelRatio: number
  renderSize: number
  constructor() {
    this.init = this.init.bind(this)
    this.animation = this.animation.bind(this)
    this.init()
    this.animation()
  }
  init() {
    const vertexShader = require('./0/shaderVertex.glsl')
    const fragmentShader = require('./0/shaderFragment.glsl')

    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-2, 2, -2, 2)
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.pixelRatio = 0.8
    this.renderSize = 350
    const { scene, camera, renderer, pixelRatio, renderSize } = this
    renderer.setSize(renderSize, renderSize)
    renderer.setPixelRatio(pixelRatio)
    document.getElementById('app').appendChild(renderer.domElement)

    camera.position.set(1, 1, 1)
    camera.lookAt(0, 0, 0)
    this.canvas = document.querySelector('canvas')

    const geometry = new THREE.PlaneBufferGeometry(2, 2)
    this.uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2(pixelRatio * renderSize, pixelRatio * renderSize) },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
    }

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    })

    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  }
  animation() {
    const { scene, camera, renderer } = this
    this.uniforms.u_time.value += 1
    renderer.render(scene, camera)
    requestAnimationFrame(this.animation)
  }
}

export { Lab }
