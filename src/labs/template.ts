import * as THREE from 'three'

interface IUniforms {
  u_time: { type: 'f'; value: number }
  u_resolution: { type: 'v2'; value: THREE.Vector2 }
  u_mouse: { type: 'v2'; value: THREE.Vector2 }
  u_texture: { type: 't'; value: THREE.Texture }
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
  }
  animation() {
    const { scene, camera, renderer } = this
    this.uniforms.u_time.value += 1
    renderer.render(scene, camera)
    requestAnimationFrame(this.animation)
  }
}

export { Lab }
