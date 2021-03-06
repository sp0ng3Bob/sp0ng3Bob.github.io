// Loader screen *********************************************************************************

var loader = document.getElementsByClassName("loader")[0];
var menuButtons = document.getElementsByClassName("nav-menu")[0];
var portable = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
var landscape = window.matchMedia("screen and (orientation:landscape)").matches;

var lockUnlockHeader = function (mode) {
	if (mode) {
		for (var i = 0; i < menuButtons.children[0].children.length; i++) {
			menuButtons.children[0].children.disabled = true;
		}
	} else {
		for (var i = 0; i < menuButtons.children[0].children.length; i++) {
			menuButtons.children[0].children.disabled = false;
		}
	}
}

var onOffClick = function (mode) {
	if (!mode) {
/* 		if (!portable) {
			lockUnlockHeader(true);
		} */
/* 		document.addEventListener("click", (e) => {
			e.stopPropagation();
			e.preventDefault();
		},false); */
		loader.hidden = false;
	} else {
/* 		if (!portable) {
			lockUnlockHeader(false);
		} */
/* 		document.removeEventListener("click", (e) => {
			e.stopPropagation();
			e.preventDefault();
		},false); */
/* 		document.addEventListener("click", (e) => {
			if (button !== e.target && button.children[0] !== e.target) {
				if (document.body.classList.contains("mobile-nav-active")) {
					document.body.classList.remove("mobile-nav-active");
					button.disabled = false;
				}
			}
		}); */
		loader.hidden = true;
	}
}

window.onload = onOffClick(true);

// ************************************************************* -- END


// SW script ****************************************************************************************

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('../../sw.js', { scope: '/' })
			.then(reg => console.log('*sw registered'))
			.catch(err => console.log('*sw registration failed: ', err));
	});
} else {alert("Vaša naprava ne podpira 'OFFLINE' načina.\nPri uporabi bo potrebna povezava z internetom!");} 

// ************************************************************* -- END


// Ask for storage ********************************************************************************

/* if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persist();
  console.log(`Persisted storage granted: ${isPersisted}`);
} */

// ************************************************************* -- END


// Check display mode ******************************************************************************

let displayMode = 'browser tab';
var offline = false;

window.addEventListener('DOMContentLoaded', () => {
  if (navigator.standalone) {
    displayMode = 'standalone-ios';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
});

var animationParent = document.getElementById("picture");
var animationDiv = document.getElementsByClassName("jpg-animation")[0];

var resizeAnimation = function () {
	var h = window.screen.height;
	var w = window.screen.width;
	var s = (w/200) < (h/256) || w < h ? (w/200) : (h/256);
	landscape = window.matchMedia("screen and (orientation:landscape)").matches;
	console.log(w, h, w/h, landscape);
	var ratio = w/h;
	
	if (ratio < 1.2 && ratio >= 0.9) {
		animationDiv.style.transform = "scale(" + s*0.55 + ", " + s*0.55 + ")";
		console.log("posebno, kvadrat");
	} else if (ratio < 0.9 && ratio >= 0.7) {
		console.log("phone, skoraj kvadrat");
		animationDiv.style.transform = "scale(" + s*0.52 + ", " + s*0.52 + ")";
	} else if (w <= 575 && !landscape) { // col-md-12
		console.log("phone, portret");
		animationDiv.style.transform = "scale(" + s*0.65 + ", " + s*0.65 + ")";
	} else if (w <= 575 && landscape) {
		console.log("phone, landscape");
		animationDiv.style.transform = "scale(" + s*0.7 + ", " + s*0.7 + ")";
	} else {
		animationDiv.style.transform = "scale(" + s*0.7 + ", " + s*0.7 + ")";
	}
}

resizeAnimation();

// ************************************************************* -- END


// Navigation bar toggle ****************************************************************************

var button = document.getElementById("MenuButton");

var toggleMenu = function() {
	document.body.classList.toggle("mobile-nav-active");
}

document.addEventListener("click", function(event) {
	if (button !== event.target && button.children[0] !== event.target) {
		if (document.body.classList.contains("mobile-nav-active")) {
			document.body.classList.remove("mobile-nav-active");
			button.disabled = false;
		}
	}
});

// ************************************************************* -- END


// Install PWA ***************************************************************************************

let deferredPrompt;
var installButton = document.getElementById("installPWA");

if (window.matchMedia("(display-mode: standalone)").matches) {
   installButton.hidden = true;
}

window.addEventListener("beforeinstallprompt", (e) => {
	onOffClick(false);
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  installButton.hidden = false;

  installButton.addEventListener("click", (e) => {
    // hide our user interface that shows our A2HS button
    installButton.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
          installButton.hidden = true;
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
  });
  
  onOffClick(true);
});

// ************************************************************* -- END


// JPG animation *************************************************************************************

var seznam = document.getElementById("list");
var searchDiv = document.getElementById("searchDiv").children[0];

var loadImage = function () {
	onOffClick(false);
	
	wordDOM = seznam.options[seznam.selectedIndex];
	name = seznam.value;
	
	animationDiv.style.animationName = "";
	animationDiv.style.backgroundImage = "url('./src/images/sprites/" + name + ".jpg')";
	
	animationDiv.scrollIntoView(false);
	
	var img = new Image;
	img.src = animationDiv.style.backgroundImage;
	img.src = img.src.replace(/url\(%22\.\/|%22\)$/g, "");
	img.onload = function() {
		var frames = this.naturalWidth/200;
		animationDiv.style.backgroundSize = frames*100 + "%, 100%";
		animationDiv.style.animationDuration = 0.06*frames + "s";
		animationDiv.style.animationDelay = "0.5s";
		animationDiv.style.animationTimingFunction = "steps(" + (frames-1) + ")";
		animationDiv.style.animationName = "spritemove";
		
		//icon for downloaded
		wordDOM.classList.add("downloaded");
		
		//if (portable) {
      //wordDOM.innerText += " ○";
		//}
	}
	img.onerror = function() {
		alert("Ni internetne povezave, prav tako ni slike na napravi!")
	}
	onOffClick(true);
}

var startStopAnimation = function (mode) {
	if (mode) {
		animationDiv.style.animationPlayState = "running";
	} else {
		animationDiv.style.animationPlayState = "paused";
	}
}

// ************************************************************* -- END


// Resize listener *******************************************************************************

window.addEventListener("resize", resizeAnimation, true);

// ************************************************************* -- END


// Search function *******************************************************************************

var searchDict = function (text) {
	if (text == "") {this.resetAllDict(); return;}
	
	for (var i = 0; i < seznam.children.length; i++) {
		if (seznam.children[i].text.toLowerCase().indexOf(text.toLowerCase()) < 0) {
			seznam.children[i].setAttribute("hidden", "hidden");
		}
		else {
			seznam.children[i].removeAttribute("hidden");
		}
	}
}

var clearButton = document.getElementsByClassName("btn-outline-danger")[0];

var clearSearch = function (el) {
	if (searchDiv.value != "") {
		searchDiv.value = "";
		el.blur();
		this.resetAllDict();
	}
	clearButton.blur(); //document.activeElement
}

var resetAllDict = function () {
	for (var i = 0; i < seznam.children.length; i++) {
		seznam.children[i].removeAttribute("hidden");
	}
}

// ************************************************************* -- END


// Lock words in dict when OFFLINE *****************************************************************

window.addEventListener("online", (e) => {
	onOff(true);
});

window.addEventListener("offline", (e) => {
	onOff(false);
});

var onOff = function(mode) {
	if (mode) { //on
		lockAllDict(!mode);
	} else { //off
		lockAllDict(!mode);
	}
}

var lockAllDict = function (mode) {
	if (mode) {
		for (var i = 0; i < seznam.children.length; i++) {
			if (!seznam.children[i].classList.contains("downloaded")) {
				seznam.children[i].setAttribute("disabled", "disabled");
			}
		}
	} else {
		for (var i = 0; i < seznam.children.length; i++) {
			if (seznam.children[i].hasAttribute("disabled")) {
				seznam.children[i].removeAttribute("disabled");
			}
		}
	}
}

// ************************************************************* -- END


// Download all pictures to cache *****************************************************************

var getList = function () {
	onOffClick(false);
	
	var list = [];
	for (var i = 0; i < seznam.children.length; i++) {
		if (!seznam.children[i].classList.contains("downloaded")) {
			if (seznam.children[i].hasAttribute("disabled")) {
				seznam.children[i].removeAttribute("disabled");
				seznam.children[i].classList.add("downloaded");
			} else {
				seznam.children[i].classList.add("downloaded");
			}
			
			fetch("/src/images/sprites/" + seznam.children[i].value + ".jpg").then(function(response) {
				if (response.status != "200") {
					seznam.children[i].classList.remove("downloaded");
				}
			});
		}
	}
	
	onOffClick(true);
}

// ************************************************************* -- END


// Controls for animation *************************************************************************

var left = document.getElementsByClassName("icofont-arrow-left")[0];
var right = document.getElementsByClassName("icofont-arrow-right")[0];

var forwardButton = function () {
	if (seznam.selectedIndex != -1) {
		var i = findVisibleOption("up");
		
		if (i == -1) {
			alert("Ni več vidnih besed v seznamu.")
			return;
		}
		
		seznam.selectedIndex = i;
		loadImage();
		
/* 		if (portable) {
			right.focus();
			right.blur();
		} */
	}
}

var backwardButton = function () {
	if (seznam.selectedIndex != -1) {
		var i = findVisibleOption("down");
		
		if (i == -1) {
			alert("Ni več vidnih besed v seznamu.")
			return;
		}
		
		seznam.selectedIndex = i;
		loadImage();
		
/* 		if (portable) {
			left.focus();
			left.blur();
		} */
	}
}

var findVisibleOption = function (mode) {
	if (mode == "up") {
		for (var i = seznam.selectedIndex + 1; i < seznam.options.length; i++) {
			if (!seznam.options[i].hasAttribute("hidden")) {return i;}
		}
		for (var i = 0; i < seznam.selectedIndex; i++) {
			if (!seznam.options[i].hasAttribute("hidden")) {return i;}
		}
	} else {
		for (var i = seznam.selectedIndex - 1; i >= 0; i--) {
			if (!seznam.options[i].hasAttribute("hidden")) {return i;}
		}
		for (var i = seznam.options.length - 1; i > seznam.selectedIndex; i--) {
			if (!seznam.options[i].hasAttribute("hidden")) {return i;}
		}
	}
	
	return -1;
}

var more = document.getElementsByClassName("icofont-listine-dots")[0];

var moreButton = function () {
	console.log("moreButton");
}

var playPause = document.getElementsByClassName("playAnimation")[0];
var animationCtrl = document.getElementsByClassName("animationControls")[0];

var playPauseButton = function () {
	if (seznam.selectedIndex > -1) {
		if (playPause.children[0].hasAttribute("hidden")) {
			startStopAnimation(true);
			playPause.children[1].setAttribute("hidden", "hidden");
			playPause.children[0].removeAttribute("hidden");
		} else {
			startStopAnimation(false);
			playPause.children[0].setAttribute("hidden", "hidden");
			playPause.children[1].removeAttribute("hidden");
		}
	}
}

var checkPlayer = function () {
	if (seznam.selectedIndex == -1) {
		animationCtrl.style.display = "none";
	} else {
		animationCtrl.style.display = "block";
	}
}

var settingsButton = function () {
	console.log("settings");
}

var bookmarkButton = function () {
	console.log("bookmark");
}

/* if (portable) {
	animationDiv.addEventListener("click", (e) => {
		playPause.removeAttribute("hidden");
		animationCtrl.removeAttribute("hidden");
	}, true);
} else {
	animationDiv.addEventListener("focus", (e) => {
		playPause.removeAttribute("hidden");
		animationCtrl.removeAttribute("hidden");
	}, true);

	animationDiv.addEventListener("blur", (e) => {
		playPause.setAttribute("hidden", "hidden");
		animationCtrl.setAttribute("hidden", "hidden");
	}, true);
} */

// ************************************************************* -- END


// ToggleDefinition function ***********************************************************************

var toggleDefButton = document.getElementsByClassName("toggleDefinition")[0];

var toggleDef = function () {
	if (toggleDefButton.children[0].hasAttribute("hidden")) {
		toggleDefButton.children[0].removeAttribute("hidden");
		toggleDefButton.children[1].setAttribute("hidden", "hidden");
	} else {
		toggleDefButton.children[0].setAttribute("hidden", "hidden");
		toggleDefButton.children[1].removeAttribute("hidden");
		
		//SSKJapi(seznam.options[seznam.selectedIndex].text);
	}
}

var SSKJapi = function (text) {
	fetch("https://fran.si/iskanje?View=1&Query="+text.replace(/s/g, "+")+"&hs=2", {mode: 'cors'}).then(function(response) {
		if (response.status == "200") {
			console.log(response);
		} else {
			console.log("problem");
		}
	});
}
		
// ************************************************************* -- END

var checkConnection = function() {
	fetch("https://google.com/").then(function(response) {
		if (response.status >= "400") {
			offline = true;
		} else {
			offline = false;
		}
	});
}