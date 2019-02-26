import * as THREE from 'three'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector<HTMLDivElement>('#app').style.filter = 'saturate(0) brightness(1.4) contrast(2)'
})

const texture = new THREE.TextureLoader().load('/doodle.png')

interface IUniforms {
  u_time: { type: 'f'; value: number }
  u_resolution: { type: 'v2'; value: THREE.Vector2 }
  u_mouse: { type: 'v2'; value: THREE.Vector2 }
  u_texture: { type: 't'; value: THREE.Texture }
  u_picture: { type: 't'; value: THREE.Texture }
  u_mousedown: { type: 'bool'; value: boolean }
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
    this.pixelRatio = 1
    this.renderSize = 512
    this.switchTag = false

    const { scene, camera, renderer, pixelRatio, renderSize } = this

    renderer.setSize(renderSize, renderSize)
    renderer.setPixelRatio(pixelRatio)
    document.getElementById('app').appendChild(renderer.domElement)

    camera.position.set(1, 1, 1)
    camera.lookAt(0, 0, 0)

    this.canvas = document.querySelector('canvas')
    this.canvas.style.width = '350px'
    this.canvas.style.height = '350px'
    const geometry = new THREE.PlaneBufferGeometry(2, 2)
    this.uniforms = {
      u_time: { type: 'f', value: 0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2() },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
      u_texture: { type: 't', value: undefined },
      u_picture: { type: 't', value: texture },
      u_mousedown: { type: 'bool', value: false },
    }

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./shaderVertex.glsl'),
      fragmentShader: require('./shaderFragment.glsl'),
    })

    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const targetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      // type: THREE.FloatType,
      type: THREE.HalfFloatType, // for ios compatibility
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
    }
    this.textBuffer1 = new THREE.WebGLRenderTarget(renderSize * pixelRatio, renderSize * pixelRatio, targetOptions)
    this.textBuffer2 = new THREE.WebGLRenderTarget(renderSize * pixelRatio, renderSize * pixelRatio, targetOptions)

    this.uniforms.u_resolution.value.x = renderSize * pixelRatio
    this.uniforms.u_resolution.value.y = renderSize * pixelRatio

    const container = document.querySelector<HTMLDivElement>('#app')
    const moveHandler = e => {
      e.preventDefault()
      const x = (e.pageX - container.offsetLeft) / this.canvas.clientWidth
      const y = 1 - (e.pageY - container.offsetTop) / this.canvas.clientHeight
      this.uniforms.u_mouse.value.x = x
      this.uniforms.u_mouse.value.y = y
    }

    const text = document.createElement('div')
    text.innerText = 'TOUCH'
    text.style.position = 'absolute'
    text.style.color = 'white'
    text.style.left = '50%'
    text.style.top = '50%'
    text.style.transform = 'translate(-50%, -50%)'
    text.style.textShadow = '0 0 15px rgba(255,255,255, 0.3)'
    container.style.position = 'relative'
    container.appendChild(text)

    const input = {
      start: '',
      move: '',
      end: '',
    }

    const inputDetection = (e: MouseEvent) => {
      e.preventDefault()
      if (e.type == 'touchstart') {
        input.start = 'touchstart'
        input.move = 'touchmove'
        input.end = 'touchend'
        // text.innerText = 'touch'
      } else if (e.type == 'pointerdown') {
        input.start = 'pointerdown'
        input.move = 'pointermove'
        input.end = 'pointerup'
        // text.innerText = 'pointer'
      } else {
        input.start = 'mousedown'
        input.move = 'mousemove'
        input.end = 'mouseup'
        // text.innerText = 'mouse'
      }

      text.remove()
      this.canvas.removeEventListener('touchstart', inputDetection)
      this.canvas.removeEventListener('pointerdown', inputDetection)
      this.canvas.removeEventListener('mousedown', inputDetection)

      moveHandler(e)
      this.uniforms.u_mousedown.value = true
      this.canvas.addEventListener(input.move, moveHandler)
      this.canvas.addEventListener(input.start, downHandler)
    }

    this.canvas.addEventListener('touchstart', inputDetection)
    this.canvas.addEventListener('pointerdown', inputDetection)
    this.canvas.addEventListener('mousedown', inputDetection)

    console.log(input)

    const downHandler = e => {
      e.preventDefault()
      moveHandler(e)
      this.uniforms.u_mousedown.value = true
      this.canvas.addEventListener(input.move, moveHandler)
      this.canvas.addEventListener(input.end, upHandler)
    }

    const upHandler = e => {
      e.preventDefault()
      this.uniforms.u_mousedown.value = false
      this.canvas.removeEventListener(input.move, moveHandler)
      this.canvas.removeEventListener(input.end, upHandler)
    }

    // this.canvas.ontouchmove = moveHandler
    // this.canvas.addEventListener('touchstart', moveHandler)
    // this.canvas.ontouchstart = downHandler
    // this.canvas.addEventListener('touchmove', downHandler)
  }
  animation() {
    const { scene, camera, renderer } = this
    for (let i = 0; i < 12; i++) {
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
