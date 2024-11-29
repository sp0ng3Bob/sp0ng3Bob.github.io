//import gobeJson from '../../database/gobe.si-without the značilnosti.json' assert { type: 'json' }

class Data {
  constructor() {
    this.gobe = null
  }
  
  async init() {
    await this.fetchData()
  }
  
  async fetchData() {
    try {
      const response = await fetch('../../database/gobe.si-without the značilnosti.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.gobe = await response.json();
    } catch (error) {
      console.error('Error loading JSON:', error);
    }
  }
  goba(index) {
    return this.gobe["seznam"][index]
  }
  
  seznam() {
    return this.gobe["seznam"]
  }
  
  pogostosti() {
    return this.gobe["pogostosti"]
  }
  
  domacaImena() {
    return this.gobe["domačaImena"]
  }
  
  zavarovane() {
    return this.gobe["zavarovane"]
  }
  
  rdeciSeznam() {
    return this.gobe["rdečiSeznam"]
  }
  
  uzitne() {
    return this.gobe["užitne"]
  }
  
  pogojnoUzitne() {
    return this.gobe["pogojnoUžitne"]
  }
}

export default Data