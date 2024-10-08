import glMatrix from "glMatrix"

const vec3 = glMatrix.vec3
const mat4 = glMatrix.mat4
const quat = glMatrix.quat

export class Node {

  constructor(options = {}) {
    this.translation = options.translation
      ? vec3.clone(options.translation)
      : vec3.fromValues(0, 0, 0)
    this.rotation = options.rotation
      ? quat.clone(options.rotation)
      : quat.create()
    this.scale = options.scale
      ? vec3.clone(options.scale)
      : vec3.fromValues(1, 1, 1)
    this.matrix = options.matrix
      ? mat4.clone(options.matrix)
      : mat4.create()

    if (options.matrix) {
      mat4.getRotation(this.rotation, this.matrix)
      mat4.getTranslation(this.translation, this.matrix)
      mat4.getScaling(this.scale, this.matrix)
    } else if (options.translation || options.rotation || options.scale) {
      this.updateMatrix()
    }

    this.camera = options.camera ?? null
    this.mesh = options.mesh ?? null

    this.skin = options.skin ?? null

    this.children = [...(options.children ?? [])]
    for (const child of this.children) {
      child.parent = this
    }
    this.parent = null

    //this.hasTransparentProperties = options.transparent || false
    this.transparrentPrimitives = [...(options.transparrentPrimitives ?? [])]
    this.opaquePrimitives = [...(options.opaquePrimitives ?? [])]
  }

  updateMatrix() {
    /*for (const childNode of this.children ?? []) {
      childNode.updateMatrix()
    }*/
    mat4.fromRotationTranslationScale(
      this.matrix,
      this.rotation,
      this.translation,
      this.scale)
  }

  addChild(node) {
    this.children.push(node)
    node.parent = this
  }

  removeChild(node) {
    const index = this.children.indexOf(node)
    if (index >= 0) {
      this.children.splice(index, 1)
      node.parent = null
    }
  }

  clone() {
    return new Node({
      ...this,
      children: this.children.map(child => child.clone()),
    })
  }

}