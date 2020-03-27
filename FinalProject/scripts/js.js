window.onload = function()  {
	var btnCallapi = document.getElementById('callAPI');
	var bgImgHeroes = document.querySelector('.bgImgHeroes');
	var startUrl = 'https://swapi.co/api/people/';
	var result;
	var next;
	var previous;
	var createListHeroes = document.getElementById("listHeroes");
	var heroInfoWindow = document.getElementById("heroInfoWindow");
	var wrapper = document.getElementById("wrapper");
	var heroInfoTable = document.getElementById("heroInfo");
	var arrFilms=[];
	var arrSpecies=[];
	var btnBackList = document.querySelector(".btnBackList");
	var animation = document.getElementById("animation");

	btnCallapi.onmouseover = function (e) {
		this.style.color = '#fbff00';
		this.style.cursor = 'pointer';
	};
	btnCallapi.onmouseout = function (e){
		this.style.color = 'white';
	};
	btnCallapi.onclick =function (e){
		bgImgHeroes.classList.toggle('notVisible');
		btnCallapi.style.display='none';
		getHeroes(startUrl);
	};

	function getHeroes(url) {
		fetch(url)
		  .then(  
		    function(response) {  
				if (response.status !== 200) {  
					console.log('Problem call api "getHeroes". Status Code: ' + response.status);  
				return;
				}
				var forNumber=0;
				var urlString = response.url.toString();
				if(urlString.includes('page=')){
					forNumber=(urlString.substring(urlString.indexOf('page=')+5)-1)*10;
				}
				response.json().then(function(data) { 
				if(url===startUrl){
					runAnimation();
				} 			
				result = data.results;  
				createListHeroes.innerHTML='';
				result.forEach(function(item, i) {
					let idHero = 'id' + (forNumber + i + 1);
					if (localStorage.getItem(idHero)===null){
						addToCache(idHero, JSON.stringify(item));
					}
					createItemList(createListHeroes, forNumber + i + 1 + '. ' + item.name, idHero);				
					});
				previous = data.previous;
				next = data.next;   
				createButtonList(createListHeroes, previous, next);								
				});  
		    }  
		  )  
		  .catch(function(err) {  
		    console.log('Error :-S', err);  
		  });
	};

	function createItemList(nameList, createText, idHero) {
		var newItemList = document.createElement("li");
		newItemList.innerHTML = createText;
		newItemList.onclick=function(e){
			getHeroInfoFromCache(idHero);
			// addToCacheCoordinates('x', e.x);
			// addToCacheCoordinates('y', e.y);
		};
		newItemList.classList.add('itemHero');
		nameList.appendChild(newItemList);
	};

	function createButtonList(nameList, prev, next) {
		var newItemList = document.createElement("li");
		var newDivBtn = document.createElement("div");
		newDivBtn.classList.add('areaBtn');
		if(prev!==null) {
			let newDiv = document.createElement("div");
			newDiv.innerHTML = '<i class="fas fa-angle-double-left"></i> Previous';
			newDiv.classList.add('btnRevious');
			newDiv.onclick=function(){
				getHeroes(prev);
			};
			newDivBtn.appendChild(newDiv);
		}
		if(next!==null){
			let newDiv = document.createElement("div");
			newDiv.innerHTML = 'Next <i class="fas fa-angle-double-right"></i>';
			newDiv.classList.add('btnNext');
			newDiv.onclick=function(){
				getHeroes(next);
			};
			newDivBtn.appendChild(newDiv);
		}
		newItemList.appendChild(newDivBtn);
		nameList.appendChild(newItemList);
	};

	function addToCache(id, object) {
		localStorage.setItem(id, object);
	};

	// function addToCacheCoordinates(axis, coordinates) {
	// 	localStorage.setItem(axis, coordinates);
	// };

	function getHeroInfoFromCache(id) {
		var Hero = JSON.parse(localStorage.getItem(id));
		getFullInfoAndCreateTable(Hero);
	};

	function getFullInfoAndCreateTable(heroObject){
		for(let i=0; i<heroObject.films.length; i++){
			fetch(heroObject.films[i])
				.then(  
					function(response) {  
						if (response.status !== 200) {  
							console.log('Problem call api "getFilmInfo". Status Code: ' + response.status);  
						return;
						}
						
						response.json().then(function(data) {    	
							arrFilms.push(data.title);
							if (i==heroObject.films.length-1){
								for(let i=0; i<heroObject.species.length; i++){
									fetch(heroObject.species[i])
										.then(  
											function(response) {  
												if (response.status !== 200) {  
													console.log('Problem call api "getSpeciesInfo". Status Code: ' + response.status);  
												return;
												}
												
												response.json().then(function(data) {    	
													arrSpecies.push(data.name);
													if (i==heroObject.species.length-1){
														fetch(heroObject.homeworld)
														.then(  
															function(response) {  
																if (response.status !== 200) {  
																	console.log('Problem call api "getHomeworldInfo". Status Code: ' + response.status);  
																return;
																}
																
																response.json().then(function(data) {    																												
																	setTimeout(() => createTableHeroInfo(heroObject, arrFilms, arrSpecies, data.name), 1000);	 	
																}); 						
															}  
														)  
														.catch(function(err) {  
														console.log('Fetch Error :-S', err);  
														});																
													} 	
												}); 						
											}  
										)  
										.catch(function(err) {  
										console.log('Fetch Error :-S', err);  
										});				
								}; 
							} 	
						}); 						
					}  
				)  
				.catch(function(err) {  
				console.log('Fetch Error :-S', err);  
				});				
		}; 
	};

	function createTableHeroInfo(heroObject, films, species, homeworld) {
		createRow(heroInfoTable, 'Name Hero', heroObject.name);
		createRow(heroInfoTable, 'Year of Birth', heroObject.birth_year);
		createRow(heroInfoTable, 'Gender', heroObject.gender);
		var filmsHTML='<ul>';
		films.forEach(function(item, i) {
			filmsHTML=filmsHTML + '<li>' + item + '</li>';			
			});
		filmsHTML=filmsHTML + '<ul>';
		createRow(heroInfoTable, 'Films', filmsHTML);
		createRow(heroInfoTable, 'Homeworld', homeworld);
		var speciesHTML='<ul>';
		species.forEach(function(item, i) {
			speciesHTML=speciesHTML + '<li>' + item + '</li>';			
			});
			speciesHTML=speciesHTML + '<ul>';
		createRow(heroInfoTable, 'Species', speciesHTML);
		heroInfoWindow.style.display='block';
		wrapper.style.display='block';
	};

	function createRow(table, column1, column2){
		var newTr = document.createElement("tr");
		var newTh1 = document.createElement("th");
		newTh1.innerHTML = column1;
		var newTh2 = document.createElement("th");
		newTh2.innerHTML = column2;
		newTr.appendChild(newTh1);
		newTr.appendChild(newTh2);
		table.appendChild(newTr);
	};


	btnBackList.onclick=function(){
		arrFilms=[];
		arrSpecies=[];
		heroInfoWindow.style.display = 'none';
		wrapper.style.display = 'none';
		heroInfoTable.innerHTML='';
	};
	wrapper.onclick = function () {
		arrFilms=[];
		arrSpecies=[];
		heroInfoWindow.style.display = 'none';
		wrapper.style.display = 'none';
		heroInfoTable.innerHTML='';
	}

	function runAnimation(){
		animation.style.display='block';
		//wrapper.style.display = 'block';
		setTimeout(hideAnimation, 4300);
	}
	function hideAnimation(){
		animation.style.display='none'; 
		wrapper.style.display = 'none';
		window.scrollTo(0,document.body.scrollHeight);
		
	}
	
	var dropbtn = document.querySelector(".dropbtn");
	dropbtn.onclick = myFunction;
	function myFunction() {
		document.getElementById("myDropdown").classList.toggle("show");
	  }
	  
	  // Close the dropdown if the user clicks outside of it
	  window.onclick = function(event) {
		if (!event.target.matches('.dropbtn')) {
		  var dropdowns = document.getElementsByClassName("dropdown-content");
		  var i;
		  for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
			  openDropdown.classList.remove('show');
			}
		  }
		}
	  }
}


