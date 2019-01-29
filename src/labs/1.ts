import * as THREE from 'three'

interface IUniforms {
  u_time: {
    type: string
    value: number
  }
}
class Lab {
  camera: THREE.OrthographicCamera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  uniforms: IUniforms
  pixelRatio: number
  renderSize: number
  mesh: THREE.Mesh

  constructor() {
    this.init = this.init.bind(this)
    this.animation = this.animation.bind(this)
    this.init()
    this.animation()
  }
  init() {
    const vertexShader = require('./1/shaderVertex.glsl')
    const fragmentShader = require('./1/shaderFragment.glsl')

    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-2, 2, -2, 2)
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.pixelRatio = window.devicePixelRatio
    this.renderSize = 350
    const { scene, camera, renderer, pixelRatio, renderSize } = this
    renderer.setSize(renderSize, renderSize)
    renderer.setPixelRatio(pixelRatio)
    document.getElementById('app').appendChild(renderer.domElement)

    camera.position.set(1, 1, 1)
    camera.lookAt(0, 0, 0)
    this.canvas = document.querySelector('canvas')

    this.uniforms = { u_time: { type: 'f', value: 1.0 } }

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      // blending: THREE.AdditiveBlending,
      wireframe: false,
      side: THREE.DoubleSide,
    })
    const geometry = new THREE.TorusKnotBufferGeometry(1, 0.25, 200, 18, 4, 3)
    this.mesh = new THREE.Mesh(geometry, material)
    scene.add(this.mesh)
  }
  animation() {
    const { scene, camera, renderer } = this
    this.uniforms.u_time.value += 0.005
    renderer.render(scene, camera)
    requestAnimationFrame(this.animation)
    this.mesh.rotateY(-0.05)
  }
}

export { Lab }
