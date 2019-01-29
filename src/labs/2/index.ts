import * as THREE from 'three'
const texture = new THREE.TextureLoader().load('/doodle.png')

interface IUniforms {
  u_time: { type: 'f'; value: number }
  u_resolution: { type: 'v2'; value: THREE.Vector2 }
  u_mouse: { type: 'v2'; value: THREE.Vector2 }
  u_texture: { type: 't'; value: THREE.Texture }
  u_picture: { type: 't'; value: THREE.Texture }
}

class Lab {
  camera: THREE.OrthographicCamera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  uniforms: IUniforms
  textBuffer1: THREE.WebGLRenderTarget
  textBuffer2: THREE.WebGLRenderTarget
  switchTag: boolean
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
    this.switchTag = false
    const { scene, camera, renderer, pixelRatio, renderSize } = this
    renderer.setSize(renderSize, renderSize)
    renderer.setPixelRatio(pixelRatio)
    document.getElementById('app').appendChild(renderer.domElement)

    camera.position.set(1, 1, 1)
    camera.lookAt(0, 0, 0)
    this.canvas = document.querySelector('canvas')

    const vertexShader = require('./shaderVertex.glsl')
    const fragmentShader = require('./shaderFragment.glsl')
    const geometry = new THREE.PlaneBufferGeometry(2, 2)
    this.uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2(renderSize * pixelRatio, renderSize * pixelRatio) },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
      u_texture: { type: 't', value: undefined },
      u_picture: { type: 't', value: texture },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const targetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
    }
    this.textBuffer1 = new THREE.WebGLRenderTarget(renderSize * pixelRatio, renderSize * pixelRatio, targetOptions)
    this.textBuffer2 = new THREE.WebGLRenderTarget(renderSize * pixelRatio, renderSize * pixelRatio, targetOptions)
  }
  animation() {
    const { scene, camera, renderer } = this
    for (let i = 0; i < 8; i++) {
      this.uniforms.u_texture.value = this[this.switchTag ? 'textBuffer1' : 'textBuffer2'].texture
      renderer.render(scene, camera, this[this.switchTag ? 'textBuffer2' : 'textBuffer1'], true)
      this.uniforms.u_texture.value = this[this.switchTag ? 'textBuffer2' : 'textBuffer1'].texture
      this.switchTag = !this.switchTag
      this.uniforms.u_time.value += 1
    }
    renderer.render(scene, camera)
    requestAnimationFrame(this.animation)
  }
}

export { Lab }
