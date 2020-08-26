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

var portable = (window.inheritWidth <= 720 && window.inheritWidth <= 960 ? true : false);

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
});

// ************************************************************* -- END


// JPG animation *************************************************************************************

var seznam = document.getElementById("list");
var searchDiv = document.getElementById("searchDiv").children[0];
var animationDiv = document.getElementsByClassName("jpg-animation")[0];
var animationParent = document.getElementById("picture");

var loadImage = function (event) {
	wordDOM = event.target.options[event.target.selectedIndex];
	name = event.target.value;
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
		
		if (portable) {
      wordDOM.innerText += " ○";
		}
	}
	img.onerror = function() {
		alert("Ni internetne povezave, prav tako ni slike na napravi!")
	}
}

// ************************************************************* -- END


// Resize function *******************************************************************************

window.addEventListener("resize", function() {
	var w = animationParent.offsetWidth;
	var h = animationParent.offsetHeight;
	console.log(w, h);
/* 	var s = (w/200) < (h/256) ? (w/200) : (h/256);
	
	if (w <= 575) { // col-md-12
		animationDiv.style.transform = "scale(" + s + ", " + s + ")";
	}
	else if (w >= 1000) {
		animationDiv.style.transform = "scale(" + s + ", " + s + ")";
	} */
	
}, true);



// ************************************************************* -- END


// Search function *******************************************************************************

var searchDict = function (text) {
	if (text == "") {this.resetAllDict(); return;}
	
	for (var i = 0; i < seznam.children.length; i++) {
		if (seznam.children[i].text.toLowerCase().indexOf(text.toLowerCase()) < 0) {
			seznam.children[i].setAttribute("hidden", "");
		}
		else {
			seznam.children[i].removeAttribute("hidden");
		}
	}
}

var clearSearch = function (el) {
	if (searchDiv.value != "") {
		searchDiv.value = "";
		el.blur();
		this.resetAllDict();
	}
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
}

// ************************************************************* -- END

var checkConnection = funcion() {
  fetch("https://google.com/").then(function(response) {
			if (response.status >= "400") {
				offline = true;
			} else {
        offline = false;
			}
	});
}