$(function() {

	//funkcija za generisanje random broja u intervalu [min, max]
	function randomBroj(min, max) {
	    return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	//https://bost.ocks.org/mike/shuffle/
	//funkcija za random redoslijed kojim ce se moguci odgovori dodavati u niz odgovora da ne bi uvijek bio npr tacan odgovor pod A
	function shuffle(niz) {
	    let n = niz.length, pom, i;

	    while (n) {

	        i = Math.floor(Math.random() * n--);

	        pom = niz[n];
	        niz[n] = niz[i];
	        niz[i] = pom;
	        }

	    return niz;
	}
	//funkcija kojom se generise pitanje
	function generisiPitanje(a, b) {
		//moguce racunske operacije
		let operatori = ['+', '-', '*', '/'];
		let indeksOperatora = Math.floor(Math.random() * 4);
		let randomOperator = operatori[indeksOperatora];
		//brojevi koji ce se nalaziti u pitanju
		let br1 = randomBroj(a, b);
		let br2 = randomBroj(a, b);

		var pitanje = br1 + ' ' + randomOperator + ' ' + br2;
			
		var tacanOdg;
		switch(indeksOperatora) {
			case 0: tacanOdg = br1 + br2; break;
			case 1: tacanOdg = br1 - br2; break;
			case 2: tacanOdg = br1 * br2; break;
			case 3: tacanOdg = Math.floor(br1 / br2); break;
		}

		var odgovori = [tacanOdg];

		while(odgovori.length < 4) {
			var netacanOdg;
			switch(indeksOperatora) {
			case 0: netacanOdg = randomBroj(a, b) + randomBroj(a, b); break;
			case 1: netacanOdg = randomBroj(a, b) - randomBroj(a, b); break;
			case 2: netacanOdg = randomBroj(a, b) * randomBroj(a, b); break;
			case 3: netacanOdg = Math.floor(randomBroj(a, b) / randomBroj(a, b)); break;
			}
			//provjera da ne bi imali 2 ista ponudjena odgovora
			if (odgovori.indexOf(netacanOdg) === - 1) {
				odgovori.push(netacanOdg);
			}	
		}
			//niz odgovora se izmijesa da ne bi uvijek bio tacan odgovor pod A
			odgovori = shuffle(odgovori);

			return [pitanje, odgovori, tacanOdg];
		}
	
	const pitanjeOkvir = $('.pitanje #pitanje'); //varijabla koja cuva html element u kojem ce se nalaziti pitanje
	const odgovoriOkvir = $('.odgovori'); //varijabla koja cuva html element u kojem ce se nalaziti odgovori
	var nivo = -1; 
	var postavljenoPitanje; //varijabla u kojoj ce se cuvati trenutno pitanje
	var tacanOdgovor; //varijabla u kojoj ce se cuvati tacan odgovor na trenutno pitanje
	var iznos; //varijabla u kojoj ce se cuvati do sada osvojeni iznos
	const porukaOkvir = $('.poruka'); //varijabla koja cuva html element u kojem ce se ispisivati poruke igracu
	const poruka = $('#poruka'); //poruke koje se ispisuju unutar tog okvira
	
	//funkcija kojom se postavlja pitanje
	function postaviPitanje() {
		//zavisno od nivoa generise se pitanje razlicite tezine
		//tezina se mijenja nakon svakog petog pitanja
		if (nivo <=4) {
			postavljenoPitanje = generisiPitanje(1, 5);
		} else if (nivo > 4 && nivo <= 9) {
			postavljenoPitanje = generisiPitanje(5, 15);
		} else if (nivo > 9 && nivo <= 14) {
			postavljenoPitanje = generisiPitanje(15, 45);
		}

		//dodaje se tekst pitanja u html element namijenjen za cuvanje teksta
		// [0] jer je tekst pitanja prvi element u nizu koji vraca funkcija generisi pitanje
		pitanjeOkvir.html(postavljenoPitanje[0]);
		
		//prvo se isprazni html element koji cuva moguce odgovore (jer bi nakon sto je postavljeno pitanje ostali moguci odgovori na prethodno)
		//nakon toga se u isti element dodaju button elementi koji cuvaju pojedinacne odgovore. 
		//Njima se pristupa pomocu dvostrukih srednjih zagrada jer se odgovori cuvaju u nizu unutar niza
		//Atribut data-odgovor je custom data atribut u koji se smjeste moguci odgovori i sluzi da bi se mogla pokupiti vrijednost koju je igrac odabrao
		odgovoriOkvir.empty();
		odgovoriOkvir.append('<button data-odgovor=' + postavljenoPitanje[1][0] + '> A: ' + postavljenoPitanje[1][0]+ '</button>');
		odgovoriOkvir.append('<button data-odgovor=' + postavljenoPitanje[1][1] + '> B: ' + postavljenoPitanje[1][1]+ '</button>');
		odgovoriOkvir.append('<button data-odgovor=' + postavljenoPitanje[1][2] + '> C: ' + postavljenoPitanje[1][2]+ '</button>');
		odgovoriOkvir.append('<button data-odgovor=' + postavljenoPitanje[1][3] + '> D: ' + postavljenoPitanje[1][3]+ '</button>');

		tacanOdgovor = postavljenoPitanje[2]; //smjesta se tacan odgovor u globalnu varijablu da bi se mogao koristiti u drugim funkcijama
		console.info(tacanOdgovor);
		//kada igrac klikne na neki od odgovora pozove se funkcija odgovoriNaPitanje
		$('.odgovori button').on('click', odgovoriNaPitanje);
	}

	//funkcija kojom se provjerava da li je igrac tacno odgovorio
	function odgovoriNaPitanje() {

		$('.odgovori button').off(); //prvo se uklanjaju event-handleri sa html elemenata koji cuvaju odgovor

		let odgovoreno = $(this).data('odgovor'); //varijabla u koju se smjesti odgovor koji je igrac odabrao
		//provjera da li je igrac tacno odgovorio
		if (odgovoreno == tacanOdgovor) {

			porukaOkvir.fadeIn(800); //nakon 0.8s se pojavljuje okvir sa porukom
			//nakon 0.5s se poziva funkcija i prikazuje se odgovarajuci ispis
			setTimeout(function() {
				if (iznos != '1 000 000 KM')
					poruka.text('Tačan odgovor! Osvojili ste ' + iznos + '. Pripremite se za iduće pitanje.');
				else {
					poruka.text('Čestitamo postali ste milijunaš!');
				}
			}, 500);
			//nakon 3s se poziva funkcija i okvir nestaje sa ekrana te se element koji sadrzi tekst poruke postavlja na prazan string da bi se mogle ubacivati naknadne poruke
			setTimeout(function() {
				porukaOkvir.fadeOut(800, function() {
					poruka.text('');
				});
			}, 3000);
			//u istom periodu(3s) se poziva funkcija za iduce pitanje, a na novcanoj skali sa desne strane imamo klasu koja pokazuje na kojem je igrac pitanju trenutno
			//nakon tacnog odgovora se trenutnom pitanju ukloni klasa "trenutno" a doda se elementu koji je prije njega
			setTimeout(function() {
				iducePitanje();
				$('.trenutno').removeClass('trenutno').prev().addClass('trenutno');

			}, 3000);
			
			iznos = $('.trenutno').text(); //varijabla u koju se smjesti zarada koju nosi trenutno pitanje
			$('.osvojeno').text(iznos); //zarada se smjesti u html element koji prikazuje igracu koliko je do sada zaradio
			
		} 
		//ovaj dio se izvrsava ako igrac nije odgovorio tacno ali je presao prvi prag (nakon petog pitanja)
		//za ispise analogno kao gore samo sto se u ovom slucaju ne poziva funkcija iducePitanje nego se prikazuje okvir u kojem igrac moze restartovati igru
		else if (odgovoreno != tacanOdgovor && nivo > 4 && nivo <= 9) {

			porukaOkvir.fadeIn(800);
			setTimeout(function() {
				poruka.text('Netačan odgovor! Izgubili ste ali odlazite sa 1000 KM!');
			}, 500);
			setTimeout(function() {
				porukaOkvir.fadeOut(800, function () {
					poruka.text('');
				});
				restartOkvir.fadeIn(800);
			}, 3000);
		} 
		//analogno kao prethodni else if, ali se izvrsava ako je predjen prag nakon desetog pitanja
		else if (odgovoreno != tacanOdgovor && nivo > 9) {

			porukaOkvir.fadeIn(800);
			setTimeout(function() {
				poruka.text('Netačan odgovor! Izgubili ste ali odlazite sa 32 000 KM!');
			}, 500);
			setTimeout(function() {
				porukaOkvir.fadeOut(800, function () {
					poruka.text('');
				});
				restartOkvir.fadeIn(800);
			}, 3000);
		} 
		//analogno ali se izvrsava ako igrac pogresno odgovori prije prvog praga
		else {
		
			porukaOkvir.fadeIn(800);
			setTimeout(function() {
				poruka.text('Netačan odgovor! Izgubili ste!');
			}, 500);
			setTimeout(function() {
				porukaOkvir.fadeOut(800, function() {
					poruka.text('');
				});
				restartOkvir.fadeIn(800);
			}, 3000);
		}
	}
	//funkcija kojom se postavlja iduce pitanje
	function iducePitanje() {
		
		nivo = nivo + 1;
		let maxNivo = $('.skala li').length; //varijabla u kojoj se cuva max. nivo da bi se znalo do kada ce se pitanja postavljati

		if (nivo < maxNivo) {

			postaviPitanje();
		} else {

			restartOkvir.fadeIn(4000);
		}

	}

	const restartOkvir = $('.restart'); //varijabla koja cuva html element u kojem se nalaze dugmad za povratak na pocetni meni i ponovnu igru 
	const restart = $('#restart'); //varijabla koja cuva dugme za restart
	//funkcija koja se poziva kad igrac odluci restartovati igru
	function restartuj() {

		nivo = -1; //nivo se vraca na pocetak
		$('.trenutno').removeClass('trenutno'); //elementu koji u datom momentu ima klasu 'trenutno' uklonjena je ta klasa
		$('.skala li:last').addClass('trenutno'); //klasa trenutno se postavlja na posljednji element u skali
		iznos = '0 KM'; //iznos se vraca na pocetak
		$('.osvojeno').text(iznos); //osvojeni iznos se vraca na pocetak
		iducePitanje(); //poziva se funkcija koja postavlja iduce pitanje
		restartOkvir.hide(); //okvir za restartovanje se uklanja sa ekrana
		//dugmadima za jokere se uklanja klasa iskoristeno i ponovno im se postavlja event-handler
		polaPola.removeClass('iskoristeno');
		polaPola.on('click', polaPolaFunkcija);
		publika.removeClass('iskoristeno');
		publika.on('click', publikaFunkcija);

	}

	const odustani = $('#odustani'); //varijabla koja cuva dugme za odustajanje
	//funkcija koja se poziva kad igrac klikne na dugme za odustajanje
	function odustaniFunkcija() {
		//ispisi analogni onima u funkciji odgovoriNaPitanje
		porukaOkvir.fadeIn(800);
			setTimeout(function() {
				if (nivo == 0) {
					poruka.text('Odustali ste! Odlazite sa 0 KM!');
				} else {
					poruka.text('Odustali ste! Odlazite sa ' + iznos + '!');
				} 
			}, 500);
			setTimeout(function() {
				porukaOkvir.fadeOut(800, function() {
					poruka.text('');
				});
				restartOkvir.fadeIn(800);
			}, 3000);

	}

	const polaPola = $('#polaPola'); //varijabla koja cuva dugme za joker 50-50
	//funkcija koja se poziva klikom na to dugme
	function polaPolaFunkcija() {
		//dugmetu se postavlja klasa 'iskoristeno' da bi igrac znao da je iskoristio taj joker te mu se uklanja event-handler
		polaPola.addClass('iskoristeno'); 
		polaPola.off();

		let brojac = 0; //brojac da bi se znalo koliko je odgovora uklonjeno
		//funkcija kojom se prolazi kroz svaki od odgovora te se uklanjaju 2 pogresna
		$('.odgovori button').each(function() {

			if (brojac < 2) {

				if ($(this).data('odgovor') != tacanOdgovor) {

					$(this).hide();
					brojac++;
				}
			}
		});
	}

	const publika = $('#publika'); //varijabla koja cuva dugme za joker pitaj publiku
	const pomocPublike = $('.pomocPublike'); //varijabla koja cuva prozor u kojem se nalaze odgovori publike

	function publikaFunkcija() {
		//analogno kao u funkciji za joker 50-50
		publika.addClass('iskoristeno');
		publika.off();

		//pop-up na slican nacin kao i gore
		porukaOkvir.fadeIn(800);
			setTimeout(function() {
				poruka.text('Molimo vas sačekajte! Publika razmišlja.');
			}, 500);
			setTimeout(function() {
				porukaOkvir.fadeOut(5000, function() {
					poruka.text('');
				});
				pomocPublike.fadeIn(800);
			}, 3000);

		//niz objekata koji cuva ponudjene odgovore, slovo sluzi da bi se kasnije mogli uredjivati odgovarajuci html elementi
		let opcije = [
			{ slovo: 'A', rezultat: postavljenoPitanje[1][0] },
			{ slovo: 'B', rezultat: postavljenoPitanje[1][1] },
			{ slovo: 'C', rezultat: postavljenoPitanje[1][2] },
			{ slovo: 'D', rezultat: postavljenoPitanje[1][3] }
		];

		//3 random broja za procente koji predstavljaju netacne odgovore publike
		let rnd1, rnd2, rnd3;
		//zavisno od nivoa i tezine pitanja raste mogucnost da publika netacno odgovori
		if (nivo <=4) {
			rnd1 = randomBroj(0, 10);
			rnd2 = randomBroj(0, 10);
			rnd3 = randomBroj(0, 10);
		} else if (nivo > 4 && nivo <= 9) {
			rnd1 = randomBroj(15, 20);
			rnd2 = randomBroj(15, 20);
			rnd3 = randomBroj(15, 20);
		} else if (nivo > 9 && nivo <= 14) {
			rnd1 = randomBroj(20, 30);
			rnd2 = randomBroj(20, 25);
			rnd3 = randomBroj(20, 25);
		}
		//da bi imali ukupno 100% ovako se racuna koliki procenat publike je tacno odgovorio
		let maxProcenat = 100 - rnd1 - rnd2 - rnd3;
		let procenti = [rnd1, rnd2, rnd3]; //netacni se cuvaju u nizu
		
		//prolazi se petljom kroz niz opcija i ako je rezultat jednak tacnom odgovoru onda se odgovarajucem html elementu dodaju neki css property i postavlja se odgovarajuci tekst
		//nakon toga se tacan odgovor uklanja iz niza opcija
		for(let i=0; i<opcije.length; i++) {
			if (opcije[i].rezultat == tacanOdgovor) {
				$(`.bar-${opcije[i].slovo}`).css({'width':`${maxProcenat}%`, "backgroundColor":"#fa7900", "color":"white"}).text(opcije[i].slovo + ': ' + maxProcenat + '%');
				opcije.splice(i, 1);
			} 
		}
		// u ovoj petlji preostalim html elementima se dodaju vrijednosti kojima odgovaraju netacni odgovori publike 
		for (let i=0; i<opcije.length; i++) {
			$(`.bar-${opcije[i].slovo}`).css({'width':`${procenti[i]}%`, "backgroundColor":"#fa7900", "color":"white"}).text(opcije[i].slovo + ': ' + procenti[i] + '%');
		}
	}

	//funkcija kojom se inicijalizira igra te se postavljaju event-handleri na odgovarajucu dugmad
	function igraj() {

		iducePitanje();
		restart.on('click', restartuj);
		odustani.on('click', odustaniFunkcija);
		polaPola.on('click', polaPolaFunkcija);
		publika.on('click', publikaFunkcija);
	
	}
	//ispod su varijable koje cuvaju dugmad i event-handleri za klikove na dugmad na pocetnom meniju, pravilima, dijelu o projektu
	//te za povratak na pocetni meni kada se pojavi okvir restart i zatvaranje prozora kod jokera pitaj publiku
	const pocetni = $('.pocetni');
	const glavni = $('.glavni');
	const pravila = $('.pravila');
	const oProjektu = $('.oProjektu');

	$('#novaIgra').on('click', function() {
		pocetni.fadeOut(100);
		glavni.fadeIn(800);
		igraj();
	});

	$('#pravila').on('click', function() {
		pocetni.fadeOut(100);
		pravila.fadeIn(800);
	});
	$('#povratak1').on('click', function() {
		pravila.fadeOut(100);
		pocetni.fadeIn(800);
	});

	$('#oProjektu').on('click', function() {
		pocetni.fadeOut(100);
		oProjektu.fadeIn(800);
	});
	$('#povratak2').on('click', function() {
		oProjektu.fadeOut(100);
		pocetni.fadeIn(800);
	});

	$('#pocetak').on('click', function() {
		restartOkvir.fadeOut(100);
		glavni.fadeOut(100);
		pocetni.fadeIn(800);
	});

	$('#zatvori').on('click', function() {
		pomocPublike.fadeOut(200);
	});

});



