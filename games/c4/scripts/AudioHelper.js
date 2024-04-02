class AudioHelper {
  constructor() {
    this.playerXSounds = [new Audio("../assets/audio/X pencil.mp3")]
    this.playerOSounds = [new Audio("../assets/audio/O pencil.mp3")]
    this.blockSounds = []
    this.eraseSounds = [new Audio("../assets/audio/Short eraser 1.mp3"), 
                        new Audio("../assets/audio/Short eraser 2.mp3"), 
                        new Audio("../assets/audio/Long eraser.mp3")]
  }
  
  playDrawSound(player) {
    if (player == "X") {
      this.playerXSounds[0].play()
    } else {
      this.playerOSounds[0].play()
    }
  }
} 

export { AudioHelper }