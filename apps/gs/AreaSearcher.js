export class AreaSearcher {
  constructor(colorList, canvas = null) {
    this.colorList = this.parseColorList(colorList);
    this.canvas = canvas || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Convert color list keys to RGB format for easier comparison
  parseColorList(colorList) {
    return Object.entries(colorList).map(([hex, label]) => {
      const rgb = this.hexToRgb(hex);
      return { r: rgb.r, g: rgb.g, b: rgb.b, hex, label };
    });
  }

  // Convert hex color (#RRGGBB) to {r, g, b}
  hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  // Set the image and draw it on the canvas
  setImage(imageElement) {
    this.canvas.width = imageElement.width;
    this.canvas.height = imageElement.height;
    
    this.ctx.drawImage(imageElement, 0, 0);
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const numChannels = imageData.data.length / (this.canvas.width * this.canvas.height);
    this.hasAlphaChannel = numChannels === 4 ? true : false;
  }
  
  drawCircle(centerX, centerY, radius, color = 'blue', lineWidth = 2) {
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  // Compare two colors with a tolerance
  isColorClose(colorA, colorB, tolerance = 50) {
    const keys = Object.keys(colorA)
    
    let squares = 0 
    keys.forEach(k => {
      squares += Math.pow(colorA[k] - colorB[k], 2)
    })
    
    const distance = Math.sqrt(squares);
    return distance <= tolerance;
  }
  
  getBestMatch(matches, totalPixels) {
    let i = 8 //colorList.length - 1
    let colorOccs = 0
    let colorKey = this.colorList[0].hex
    
    while (i > 0) {
      const tmpColorKey = this.colorList[i].hex
      
      if (tmpColorKey in matches) {
        if (colorOccs < matches[tmpColorKey]) {
          colorOccs = matches[tmpColorKey]
          colorKey = tmpColorKey
        }
      }
      
      i--
    }

    const procentage = parseFloat(( (colorOccs/(totalPixels/4)) * 100 ).toFixed(2))
    return {
      colorKey,
      procentage
    }
  }

  // Search for matching colors in a circular area
  searchArea(centerX, centerY, radius, tolerance = 50) {
    if (centerX && centerY) {
      const { width, height } = this.canvas;
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const multiplier = this.hasAlphaChannel ? 4 : 3
      const matches = {};
      let totalPixels = 0;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue; // Skip pixels outside the circle

          const pixelX = Math.round(centerX + dx);
          const pixelY = Math.round(centerY + dy);

          if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height)
            continue; // Skip out-of-bounds pixels

          totalPixels++;

          // Get the pixel color
          const index = (pixelY * width + pixelX) * multiplier;
          const color = {
            r: imageData.data[index],
            g: imageData.data[index + 1],
            b: imageData.data[index + 2],
            //a: imageData.data[index + 3]
          };
          
          /* if (this.hasAlphaChannel) {
            color.a = imageData.data[index + 3]; // Store alpha value if present
          } */

          // Check if the color matches any in the list
          for (const listColor of this.colorList) {
            if (this.isColorClose(color, listColor, tolerance)) {
              matches[listColor.hex] = (matches[listColor.hex] || 0) + 1;
            }
          }
        }
      }

      console.log(totalPixels, matches)
      return this.getBestMatch(matches, totalPixels); // Return a count of matches for each label
    }
  }
}