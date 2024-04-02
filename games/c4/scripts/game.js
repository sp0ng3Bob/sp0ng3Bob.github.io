import { contrast, hexToRgb, hexToHsl, hslToHex, getRandom } from "./Utils.js"
import { LocalizeHelper as Locals } from "./LocalizeHelper.js"
import { SessionHelper as Session } from "./SessionHelper.js"
import { AudioHelper as Audio } from "./AudioHelper.js"

class Game {
  constructor(locals, session) {
    this.playerX = document.querySelector("#playerX")
    this.playerO = document.querySelector("#playerO")
    this.playerXText = document.querySelector("#playerXText")
    this.playerOText = document.querySelector("#playerOText")
		this.blockText = {"X": document.querySelector("#blockXText"), "O": document.querySelector("#blockOText")}
    this.undoButton = document.querySelector("#undo")
    this.prefsButton = document.querySelector("#prefs")
    this.closePrefsButton = document.querySelector("#closePrefs")
    this.savePrefsButton = document.querySelector("#savePrefs")
    this.prefs = document.querySelector("#popoUpPrefs")
	
    this.setListeners()
    
    this.player = "X"
    this.numberOfBlocks = 2
    this.playerBlocksLeft = {"X": this.numberOfBlocks, "O": this.numberOfBlocks}
    this.block = false
    this.historyBook = []
    this.againstComputer = false
    this.startFirst = false
    this.playerDead = false
    this.usedBlock = false
    this.turnsLeft = 0
    this.winnerNumberOfLines = 0
    
    this.gameBoard = new Array(7).fill(0).map(() => new Array(7).fill(0))
    this.hasGameStarted = false
    
    this.backgroundColor = "white"
    this.gridColor = "black"
    this.playerColor = {"X": ["grey", "lightgrey"], "O": ["red", "pink"]}
    this.fontColor = "#000000"
    
    this.audio = new Audio()
		
		this.showAnimations = false //true
    
    this.setUpFromBefore(locals, session)
		
		//briši
		//this.checkWiner()
  }
  
  setListeners() {
	this.setTilesListeners(document.querySelectorAll(".tile"))
    document.querySelector("#blockX").addEventListener("click", this.block.bind(this), false)
    document.querySelector("#blockO").addEventListener("click", this.block.bind(this), false)
    this.prefsButton.addEventListener("click", this.toggleInfo.bind(this), false)
    this.undoButton.addEventListener("click", this.undo.bind(this), false)
    this.closePrefsButton.addEventListener("click", this.toggleInfo.bind(this), false)
    this.savePrefsButton.addEventListener("click", this.savePrefs.bind(this), false)
  }  
  
  setTilesListeners(tiles) {
    tiles.forEach(tile => {
      tile.addEventListener("click", this.click.bind(this), false)
    })
  }
  
  setUI() {
		//set text to number of blocks per player
		this.countBlocks(this.blockText["X"])
		this.countBlocks(this.blockText["O"])
		
		//texts
		/* setTimeout(() => {console.log(this.isSet, this.locals.getCurrents(""))}, 5000)
		setTimeout(() => {console.log(this.isSet, this.locals.getCurrents(""))}, 5000) */
		console.log(this.locals, this.locals.getCurrents("instructions"))
		
 		this.prefs.children[0].children[0].innerHTML = this.locals.currentTranslations.instructions
 		this.prefs.children[2].children[0].children[0].innerHTML = this.locals.currentTranslations.bgColor
		this.prefs.children[2].children[0].children[2].innerHTML = this.locals.currentTranslations.gridColor
		this.prefs.children[2].children[1].children[0].innerHTML = this.locals.currentTranslations.player
		this.prefs.children[2].children[1].children[2].innerHTML = this.locals.currentTranslations.player
		this.closePrefsButton.innerHTML = this.locals.currentTranslations.close
		this.savePrefsButton.innerHTML = this.locals.currentTranslations.save
  }
  
  setUpFromBefore(locals, session) {
		this.locals = locals
		//if (session any) { do }
		this.setUI()
		this.linkStyles()
  }
  
/*   info() {
    this.toggleInfo()
  } */
  
  toggleInfo() {
    if (this.prefs.style.display == "block") {
      this.prefs.style.display = "none"
    } else {
      this.prefs.style.display = "block"
    }
  }
  
  savePrefs() {
    this.backgroundColor = document.querySelector("#bgColor").value
    this.gridColor = document.querySelector("#gridColor").value
    let X = hexToHsl(document.querySelector("#colorX").value)
    X[2] += (100 - X[2]) * 0.6
    let O = hexToHsl(document.querySelector("#colorO").value)
    O[2] += (100 - O[2]) * 0.6
    this.playerColor["X"] = [document.querySelector("#colorX").value, hslToHex(X[0], X[1], X[2])]
    this.playerColor["O"] = [document.querySelector("#colorO").value, hslToHex(O[0], O[1], O[2])]
    
    const checks = this.checkReadability()
    if (checks[0]) {
      this.linkStyles()
      this.toggleInfo()
    } else {
      //sporoči
    }
  }
  
  checkReadability() {
    let out = [true, []]

    const bgRGB = hexToRgb(this.backgroundColor)
    const textRGB = hexToRgb(this.fontColor)
    const gridRGB = hexToRgb(this.gridColor)
    
    let ratioBgText = contrast([bgRGB["r"], bgRGB["g"], bgRGB["b"]], [textRGB["r"], textRGB["g"], textRGB["b"]])
    if (ratioBgText < 3) {
      this.flipFontColor()
      out[1].push("Ratio BG to Text bad. Flipping text color.")
    }
    
    let ratioBgGrid = contrast([bgRGB["r"], bgRGB["g"], bgRGB["b"]], [gridRGB["r"], gridRGB["g"], gridRGB["b"]])
    if (ratioBgGrid < 3) {
        this.flipGridColor()
      out[1].push("Ratio BG to Grid bad. Flipping grid color.")
    }
    
    return out
  }
  
  flipFontColor() {
    if (this.fontColor == "#ffffff") {
      this.fontColor = "#000000"
    } else {
      this.fontColor = "#ffffff"
    }
  }  
  
  flipGridColor() {
    let bg = hexToHsl(this.backgroundColor)
    let grid = hexToHsl(this.gridColor)
    if (bg[2] > 50) {
      grid[2] = 10
    } else {
      grid[2] = 70
    }
    this.gridColor = hslToHex(grid[0], grid[1], grid[2])
  }
  
  linkStyles() {
    document.querySelector("#gameUI").style.backgroundColor = this.backgroundColor
    document.querySelector("#Grid").style = "fill:"+this.gridColor
    this.playerX.style = "fill:"+this.playerColor["X"][0]
    this.playerO.style = "fill:"+this.playerColor["O"][0]
    document.querySelector("#blockX").style = "fill:"+this.playerColor["X"][1]
    document.querySelector("#blockO").style = "fill:"+this.playerColor["O"][1]
    
    this.changeFontColor()
  }
  
  changeFontColor() {
    document.querySelector("#playerXText").style = "fill:"+this.fontColor
    document.querySelector("#playerOText").style = "fill:"+this.fontColor
		this.blockText["X"].style = "fill:"+this.fontColor
		this.blockText["O"].style = "fill:"+this.fontColor
    this.prefsButton.style = "fill:"+this.fontColor
    this.undoButton.style = "fill:"+this.fontColor

    this.prefs.style.color = this.fontColor
    //manjkajo še gumbi
/*     this.closePrefsButton
    this.savePrefsButton */
  }
  
  saveState() {}
  
  click(e) {
    console.log(e, this)
    
    if (this.block) {
      //e.path[1].append(this.createRectSVG(e))
      e.target.parentElement.append(this.createRectSVG(e))
      this.block = false
      this.disableBlock(e)
      this.historyBook.push([this.player, e, true, this.playerDead]) // this.playerDead probably not needed
      this.draw(e.target.id.split(","), true)
      this.playerBlocksLeft[this.player]--
	  this.countBlocks(this.blockText[this.player])
      return
    } else {
      //this.audio.playDrawSound(this.player)
      
      //e.path[1].append(this.createTextSVG(e, this.player))
      e.target.parentElement.append(this.createTextSVG(e, this.player))
      this.disableBlock(e)
      this.historyBook.push([this.player, e, false, this.playerDead])
      this.draw(e.target.id.split(","), false)
      
      if (!this.playerDead) {
        this.checkWiner()        
        this.swapPlayers()
      } else {
        this.turnsLeft--
        if (this.turnsLeft == 0) {
          this.checkWiner()
        }
      }
      
      this.usedBlock = false
      
      if (!this.hasGameStarted) {
        this.hasGameStarted = true;
      }
    }
  }
  
  draw(coords, block) {
    if (block) {
      this.gameBoard[coords[0]][coords[1]] = -1
    } else {
      this.gameBoard[coords[0]][coords[1]] = this.player == "X" ? 1 : 2
    }
    //console.log(this.gameBoard)
  }
  
  erase(coords) {
    this.gameBoard[coords[0]][coords[1]] = 0
    //console.log(this.gameBoard)
  }
  
  createTextSVG(e, text) {
    let txt = document.createElementNS("http://www.w3.org/2000/svg", "text")
    txt.setAttributeNS(null, "class", "tileText")
    //txt.setAttributeNS(null, "x", parseFloat(e.path[0].attributes[2].nodeValue) + parseFloat(e.path[0].attributes[5].nodeValue * getRandom(0.07, 0.12)))
    txt.setAttributeNS(null, "x", parseFloat(e.target.attributes[2].nodeValue) + parseFloat(e.target.attributes[5].nodeValue * getRandom(0.07, 0.12)))
    //txt.setAttributeNS(null, "y", parseFloat(e.path[0].attributes[3].nodeValue) + parseFloat(e.path[0].attributes[6].nodeValue * getRandom(0.82, 0.88)))
    txt.setAttributeNS(null, "y", parseFloat(e.target.attributes[3].nodeValue) + parseFloat(e.target.attributes[6].nodeValue * getRandom(0.82, 0.88)))
    txt.setAttributeNS(null, "fill", this.fontColor)
    //txt.setAttributeNS(null, "font-size", e.path[0].attributes[5].nodeValue)
    txt.setAttributeNS(null, "font-size", e.target.attributes[5].nodeValue)
    txt.setAttributeNS(null, "font-family", "cursive")
    txt.innerHTML = text
    return txt
  }
  
  createRectSVG(e) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    //rect.setAttributeNS(null, "x", e.path[0].attributes[2].nodeValue)
    rect.setAttributeNS(null, "x", e.target.attributes[2].nodeValue)
    //rect.setAttributeNS(null, "y", e.path[0].attributes[3].nodeValue)
    rect.setAttributeNS(null, "y", e.target.attributes[3].nodeValue)
    rect.setAttributeNS(null, "style", "fill:"+this.playerColor[this.player][1]+";")
    //rect.setAttributeNS(null, "width", e.path[0].attributes[5].nodeValue)
    rect.setAttributeNS(null, "width", e.target.attributes[5].nodeValue)
    //rect.setAttributeNS(null, "height", e.path[0].attributes[6].nodeValue)
    rect.setAttributeNS(null, "height", e.target.attributes[6].nodeValue)
    return rect
  }
  
  swapPlayers() {
    if (this.player == "X") {
      this.player = "O"
			
			if (this.showAnimations) {
				this.playerXText.setAttribute("active-player", "false")
				this.playerOText.setAttribute("active-player", "true")
			} else {
				this.playerXText.removeAttribute("text-decoration")
				this.playerOText.setAttribute("text-decoration", "underline")
			}
			

			//this.playerOText.value.focus()
    } else {
      this.player = "X"
			
			if (this.showAnimations) {
				this.playerOText.setAttribute("active-player", "false")
				this.playerXText.setAttribute("active-player", "true")
			} else {
				this.playerOText.removeAttribute("text-decoration")
				this.playerXText.setAttribute("text-decoration", "underline")
			}

      //this.playerXText.value.focus()
    }
  }
  
  disableBlock(e) {
    //e.path[0].attributes[4].nodeValue = "fill:none;"
    e.target.attributes[4].nodeValue = "fill:none;"
  }
  
  enableBlock(e) {
    //e.path[0].attributes[4].nodeValue = "fill:transparent;"
    e.target.attributes[4].nodeValue = "fill:transparent;"
  }
  
  block(e) {
    if (this.player == e.target.id[e.target.id.length-1] && !this.usedBlock && this.playerBlocksLeft[this.player] > 0) {
      this.block = true
      this.usedBlock = true
    }
  }
  
  countBlocks(blockTextElement) {
		blockTextElement.innerHTML = this.playerBlocksLeft[this.player]
  }
  
  undo() {
    if (this.historyBook.length > 0) {
      let move = this.historyBook.pop()
      this.enableBlock(move[1])
      //move[1].path[1].children[1].remove()
      move[1].target.parentElement.children[1].remove()
      
      this.erase(move[1].target.id.split(","))
      
      if (!move[2]) {
        if (!move[3]) {         
          this.swapPlayers()
          this.playerDead = false
        } else {
          this.turnsLeft++
        }
      } else {
				this.playerBlocksLeft[this.player]++
				this.countBlocks(this.blockText[this.player])
			}
      
      if (this.historyBook.length == 0) {
        this.hasGameStarted = false
      }
    }
  }
  
  revange(maxLines) {
    //this.swapPlayers()
    this.turnsLeft = this.player == "X" ? 3 : 2 //If X is the looser he gets 2 more drawings, is O 3 -- the swapping of players comes after. lol
    this.playerDead = true
    this.winnerNumberOfLines = maxLines
  }
  
  checkWiner() {
		this.currentPlayerToCheck = this.player == "X" ? 1 : 2
    const drawnLines = this.checkWinnerForPlayer()
    
    if (drawnLines > 0 && !this.playerDead) {
      const congrats = "Player" //localization??
      alert(`${congrats} ${this.player} wins with ${drawnLines} lines.\nRevenge round!`)
      this.revange(drawnLines)
    } else if (this.playerDead) {
      if (drawnLines > this.winnerNumberOfLines) {
        alert(`Player ${this.player} you actually won. You have ${drawnLines} lines.\nRevenge win!`)
      } else {
        alert(`Player ${this.player} is the looser with ${drawnLines} lines.\nRevenge lost!`)
      }
    }
  }
	
	checkWinnerForPlayer() {
		let numberOfLines = 0
		
		// Check rows
    numberOfLines += this.checkLines(this.gameBoard, this.currentPlayerToCheck)

    // Check columns
    const transposedBoard = this.transpose([...this.gameBoard])
    numberOfLines += this.checkLines(transposedBoard, this.currentPlayerToCheck)

    // Check diagonals
    numberOfLines += this.checkDiagonals(this.gameBoard, this.currentPlayerToCheck)
    
		return numberOfLines
	}

  checkLines(board, player) {
    let count = 0

    for (let row of board) {
      for (let i = 0; i <= row.length - 4; i++) {
        const subRow = row.slice(i, i + 4)
        if (subRow.every(cell => cell === player)) {
          count++
        }
      }
    }

    return count
  }

  checkDiagonals(board, player) {
    let count = 0

    // Check diagonals from top-left to bottom-right
    for (let i = 0; i <= board.length - 4; i++) {
      for (let j = 0; j <= board[i].length - 4; j++) {
        const diagonal = [board[i][j], board[i+1][j+1], board[i+2][j+2], board[i+3][j+3]]
        if (diagonal.every(cell => cell === player)) {
          count++
        }
      }
    }

    // Check diagonals from top-right to bottom-left
    for (let i = 0; i <= board.length - 4; i++) {
      for (let j = 3; j < board[i].length; j++) {
        const diagonal = [board[i][j], board[i+1][j-1], board[i+2][j-2], board[i+3][j-3]]
        if (diagonal.every(cell => cell === player)) {
          count++
        }
      } 
    }

    return count
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]))
  }
}

document.addEventListener("DOMContentLoaded",() => {
	//check session stuff
	const session = new Session()
	
	const locals = new Locals("en")
	locals.waitLoading()
	
  const game = new Game(locals, session)
})