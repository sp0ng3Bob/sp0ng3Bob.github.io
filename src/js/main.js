// Make sure sw are supported
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/pwa/src/js/sw.js')
			.then(reg => console.log('*sw registered'))
			.catch(err => console.log('*sw registration failed: ', err));
	});
} else {alert("Vaša naprava ne podpira 'OFFLINE' načina.\nPri uporabi bo potrebna povezava z internetom!");} 


$(document).on('click', '.mobile-nav-toggle', function(e) {
	$('body').toggleClass('mobile-nav-active');
});

$(document).click(function(e) {
	var container = $(".mobile-nav-toggle");
	if (!container.is(e.target) && container.has(e.target).length === 0) {
		if ($('body').hasClass('mobile-nav-active')) {
			$('body').removeClass('mobile-nav-active');
		}
	}
});

var seznam = document.getElementById("list");
var searchDiv = document.getElementById("searchDiv").children[0];
var animationDiv = document.getElementsByClassName("jpg-animation")[0];

var loadImage = function (name) {
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
	}
	img.onerror = function() {
		alert("No internet, no cache!")
	}
}

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