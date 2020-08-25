// Check display mode ******************************************************************************

let displayMode = 'browser tab';

window.addEventListener('DOMContentLoaded', () => {
  if (navigator.standalone) {
    displayMode = 'standalone-ios';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
});

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
	}
	img.onerror = function() {
		alert("Ni internetne povezave, prav tako ni slike na napravi!")
	}
}

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

var onOff = function() {
	if (navigator.onLine) { //on
		lockAllDict(false);
	} else { //off
		lockAllDict(true);
	}
}

var lockAllDict = function (mode) {
	if (mode) {
		for (var i = 0; i < seznam.children.length; i++) {
			if (!seznam.children[i].hasAttribute("downloaded")) {
				seznam.children[i].addAttribute("disabled");
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