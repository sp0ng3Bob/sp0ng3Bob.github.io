class LocalizeHelper {
  constructor(initialLanguge) {
		this.initialLanguge = initialLanguge
		this.mainJson = {}
		this.currentTranslations = {}
		this.isSet = this.waitLoading() | false
  }
	
	waitLoading() {
		this.loadLocals()
 			.then(res => {
				this.mainJson = res[0]
				this.currentTranslations = res[1]
				return true
			})
			.catch(error => {
				alert(error)
				return false
			})
	}
	
	async loadLocals() {
		return await Promise.all([this.loadJson("../assets/local/locals.json"), 
															this.loadJson(`../assets/local/translations/${this.initialLanguge}.json`)])
	}
	
	loadJson(url) {
		return new Promise(async (resolve, reject) => {
			await fetch(url)
				.then(res => res.text())
				.then(res => JSON.parse(this.escapeUnicode(res)))
				.then(data => resolve(data))
				.catch(error => reject([url, error]))
		})
	}
	
	escapeUnicode(str) {
		return str.replace(/[^\0-~]/g, (ch) => {
			return "\\u" + ("0000" + ch.charCodeAt().toString(16)).slice(-4)
		})
	}
	
	getCurrents(id) {
		console.log(this.currentTranslations)
		return this.currentTranslations?.id
	}
} 

export { LocalizeHelper }