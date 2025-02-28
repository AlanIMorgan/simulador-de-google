searchForm = document.querySelector(".home__form");

searchInput = document.querySelector(".google-search");

directAccess = document.querySelector(".home__direct-access");

function showForm() {

    searchForm.classList.toggle("hidden");

    searchInput.focus();

	searchInput.value = '';

	return liveSearch();
}

document.documentElement.addEventListener("keydown", (e)=>{

	if (e.key == "|"){

        e.preventDefault();

		return showForm();
	}
});

document.getElementById('form-btn').addEventListener("click", showForm);

document.getElementById("img_mask").addEventListener("click", ()=> searchInput.focus() );

document.getElementById("home_img").getElementsByTagName("img")[0].addEventListener("click", ()=> searchInput.focus() );

document.querySelector(".home__logo-containerrr").addEventListener("click", ()=> searchInput.focus() );

const historyAccesses = document.getElementById("direct_access_row");

directAccess.addEventListener("click", ()=> searchInput.focus() );

searchEngineMenuOptions = [

	{"Baidu" : "https://www.baidu.com/s?ie=utf-8&wd="},

	{"Bing" : "https://www.bing.com/search?q="},

	{"Brave" : "https://search.brave.com/search?q="},

	{"Duckduckgo" : "https://duckduckgo.com/?q="},

	{"Ecosia" : "https://www.ecosia.org/search?q="},

	{"Google" : "https://www.google.com/search?q="},

	{"Qwant" : "https://www.qwant.com/?q="},

	{"Yandex" : "https://yandex.com/search/?text="},

	{"Yandex-r" : "https://yandex.ru/search/?text="}
];

if (localStorage.getItem("search_engines") ){

	cachedSearchEngines = localStorage.getItem("search_engines");

	cachedSEArray = cachedSearchEngines.split(",");

	cachedSEArray.forEach(e => {

		cachedSE = e.split();

		cachedSESplit = cachedSE[0].split(";;;");

		cachedSESplit[0];

		cachedSESplit[1];

		newSEObject = JSON.parse('{ "' + cachedSESplit[0] + '" : "' + cachedSESplit[1] + '" }');

		searchEngineMenuOptions.push(newSEObject);
	});
}

function createOptions (name) {

	let option = document.createElement("option");

	option.setAttribute("value", name);

	name == "Google" ? option.setAttribute("selected", "true") : false;

	searchEngineMenu.appendChild(option);

	option.innerText = name;
}

searchEngineMenuOptions.forEach(e => {

	optionName = Object.keys(e);

	createOptions(optionName[0]);
});

searchEngineMenu.addEventListener("input", ()=> localStorage.setItem("searchEngine", searchEngineMenu.value) );

if (localStorage.getItem("searchEngine") ){

	searchEngineMenu.value = localStorage.getItem("searchEngine");
}

links = document.querySelectorAll(".result");

if (localStorage.getItem("favorites") == null){

	localStorage.setItem("favorites", "GooStav");

	location.reload();
}else{

	favorites = localStorage.getItem("favorites");

	favs = favorites.split(";;;");

	for (let i = 0; i < links.length; i++) {

		let e = links[i].innerHTML.split("<")[0];

		links[i].addEventListener("click", ()=>{

			searchInput.value = "";

			liveSearch();

			searchInput.focus();
		});

		for (let n = 0; n < favs.length; n++){

			let l = favs[n];

			if (e == l){

				let a = document.createElement('a');

				let icon = document.createElement("span");

				let p = document.createElement('p');

				a.setAttribute("href", links[i].href);

				a.setAttribute("target", "_blank");

				a.setAttribute("title", e);

				a.innerText = "";

				favoritesRow.appendChild(a);

				icon.innerText = l[0];

				a.appendChild(icon);

				p.innerText = l;

				a.appendChild(p);
			}
		}
	}

	if (favoritesRow.scrollWidth > favoritesRow.clientWidth){

		favoritesRow.style.justifyContent = "flex-start"
	}
}

const currentURL = window.location.href;

function addFav(e){

	let favSite = e.target.dataset.site;

	if (localStorage.getItem("favorites") == null){

		localStorage.setItem("favorites", favSite);

		return location.reload();
	}

	let favorites = localStorage.getItem("favorites");

	if (favorites.includes(";;;") ){

		let favs = favorites.split(";;;");

		if (favs.find((m)=>{return m == favSite}) == undefined){

			localStorage.setItem("favorites", favorites + ";;;" + favSite);
		}

		return location.reload();
	}

	if (favorites != favSite){

		localStorage.setItem("favorites", favorites + ";;;" + favSite);
	}

	return location.reload();
}

function isEmptyOrSpaces (str) {

    return str == null || str.match(/^\s*$/) !== null;
}

favMenu = false;

function liveSearch(){

	let q = searchInput.value;

	for (i = 0; i < links.length; i++){

		if (isEmptyOrSpaces(q) ){

			links[i].classList.remove("actual");

			resultsBoxC.classList.add("hidden");

			directAccess.style.display = "block";

			return
		}

		resultsBoxC.classList.remove("hidden");

		directAccess.style.display = "none";
		
		searchEngineMenuOptions.forEach(e => {

			if (searchEngineMenu.value == Object.keys(e) ){

				searchEngine = Object.values(e)[0];

				links[0].href = searchEngine + encodeURIComponent(q);

				links[0].innerHTML = searchEngine + encodeURIComponent(q);
			}
		});

		if (links[i].textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replaceAll(' ', '').includes(q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replaceAll(' ', '') ) ){

			links[i].classList.add("actual");
		}else{

			links[i].classList.remove("actual");
		}

		if (q.includes('.') && !q.includes(' ') ){

			https = q.includes("http") ? '' : "https://";

			links[0].href = https + q;

			links[0].innerHTML = https + q;
		}

		links[0].classList.add("actual");

		if (favMenu){

			links[0].classList.remove("actual");
		}
	}

	return
}

searchInput.addEventListener("input", liveSearch);

document.getElementById("add_fav").addEventListener("click", ()=>{

	searchInput.placeholder = "Nuevo favorito:";

	document.getElementById("cancel_btn").classList.remove("hidden");

	directAccess.style.display = "none";

	links.forEach(e => {

		e.dataset.site = e.innerHTML.split('<')[0];

		e.target = '';

		e.href = '#';

		e.addEventListener("click", (m)=> addFav(m) );
	});

	searchForm.classList.remove("hidden");

	favMenu = true;

	return liveSearch();
});

function updateHistory() {

	switch ( localStorage.getItem("history") ) {

		case null:

		break;

		default:

			userHistory = localStorage.getItem("history");

			inputs = userHistory.split(';;;');

			switch (userHistory == "noHistory") {

				case false:

					historyAccesses.innerHTML = "";

					for (let i = 0; i < inputs.length; i++) {

						let element = inputs[i];

						let shortcut = document.createElement("a");

						for (let i = 0; i < searchEngineMenuOptions.length; i++) {

							let e = searchEngineMenuOptions[i];

							let sEMOKey = Object.keys(e);

							switch ( element.includes( sEMOKey[0] ) ) {

								case false:

								break;

								default:

									elementEngine = Object.values(e);

									elementLink = element.replace(sEMOKey[0] + ": ", elementEngine[0]);

								break;
							}
						}

						shortcut.setAttribute("href", elementLink);

						shortcut.setAttribute("title", "Acceso directo");

						shortcut.setAttribute("class", "direct-access");

						shortcut.setAttribute("target", "_blank");

						historyAccesses.appendChild(shortcut);

						let icon = document.createElement("img");

						icon.setAttribute("src", "./img/android-icon-192x192.png");

						icon.setAttribute("class", "direct-access__img");

						shortcut.appendChild(icon);

						let info = document.createElement("div");

						info.setAttribute("class", "direct-access__info");

						shortcut.appendChild(info);

						info.innerText = element;
					}

				break;
			}

		break;
	}
}

updateHistory();

function openTab(sEngine, array) {

	switch (sEngine) {

		case 0:

			searchEngine = "";

		break;

		default:

			for (let i = 0; i < searchEngineMenuOptions.length; i++) {

				let e = searchEngineMenuOptions[i];

				switch ( searchEngineMenu.value == Object.keys(e) ) {

					case false:

					break;

					default:

						searchEngine = Object.values(e)[0];

					break;
				}
			}

			switch ( localStorage.getItem("history") ) {

				case null:

					localStorage.setItem('history', searchEngineMenu.value + ": " + array);

				break;

				default:

					switch (userHistory == "noHistory") {

						case false:

							userHistory = userHistory + ";;;" + searchEngineMenu.value + ": " + array;

							inputs = userHistory.split(";;;");

							switch (inputs.length < 6) {

								case false:

									inputs.shift();

									newHistory = "";

									inputs.forEach(e => {

										newHistory == "" ? newHistory = e : newHistory += ";;;" + e;
									});

									localStorage.setItem('history', newHistory);

								break;

								default:

									localStorage.setItem('history', userHistory);

								break;
							}

						break;
					}

				break;
			}

			array = encodeURIComponent(array);

		break;
	}

	searchInput.value = "";

	liveSearch();

	directAccess.style.display = "block";

	setTimeout( () => {

		window.open(searchEngine + array);
	}, 250);

	updateHistory();
}

function redirect(array) {

	switch ( array.includes("http") ) {

		case false:

			url = 'http://' + array;

		break;

		default:

			url = '' + array;

		break;
	}

	confRedir = confirm("Estás llendo a: " + array);

	confRedir == true ? openTab(0, url) : false;
}

function createLink(path, tag, keyWords) {

	switch ( document.getElementById(keyWords) ) {

		case null:

			let site = document.createElement("a");

			site.setAttribute("href", path);

			site.setAttribute("id", keyWords);

			site.setAttribute("class", "result actual");

			results.appendChild(site);

			site.innerText = tag;

			let words = document.createElement("span");

			words.setAttribute("class", "key_words");

			site.appendChild(words);

			words.innerText = keyWords;

			resultsBoxC.classList.remove("hidden");

			links = document.querySelectorAll('.result');

		break;
	}
}

document.querySelector(".home__form").addEventListener("submit", (e)=>{

	e.preventDefault();

	let voiceText = searchInput.value;

	switch ( isEmptyOrSpaces(voiceText) ) {

		case false:

			switch ( voiceText.includes('.') && !voiceText.includes(' ') ) {

				case false:

					openTab(1, voiceText);

				break;

				default:

					redirect(voiceText);

				break;
			}

		break;
	}
});