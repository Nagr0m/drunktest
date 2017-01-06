// Création d'une application angular
let app = angular.module('UndrunkApp', ['ngRoute']);

// Configuration de l'application angular
app.config(function($routeProvider) {

	// Configuration des routes
	$routeProvider
		.when('/accueil', {
			templateUrl  : 'views/accueil.html',
			controller   : 'AccueilCtrl',
			controllerAs : 'accueil'
		})
		.when('/scores', {
			templateUrl  : 'views/scores.html',
			controller   : 'ScoresCtrl',
			controllerAs : 'scores'
		})
		.when('/questions', {
			templateUrl  : 'views/questions.html',
			controller   : 'QuestionsCtrl',
			controllerAs : 'questions'
		})
		.when('/resultat', {
			templateUrl  : 'views/resultat.html',
			controller   : 'ResultatCtrl',
			controllerAs : 'resultat'
		})
		.otherwise({
			redirectTo	 : '/accueil'
		});

});

// Contrôleur de la page d'accueil
app.controller('AccueilCtrl', function($location) {
	let accueil = this;
	accueil.confirm = false;
});

// Contrôleur de la page des scores
app.controller('ScoresCtrl', function($http) {
	let scores = this;
	scores.sortType = '-date';
	scores.sortReverse = false;
	$http.get('https://api.myjson.com/bins/chuon').then(function(response){
		scores.list = response.data;
	});
});

// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, shuffleArray, $interval, $location, $rootScope) {
	let questions = this;
	questions.nextStatut = false;
	questions.list = [];
	questions.actuel = [];
	questions.index = 0;
	questions.score = 1;

	// Initialisation des questions
	$http.get('/data.json').then(function(response){
		questions.temp = shuffleArray.shuffle(response.data);
		questions.list = questions.temp.slice(0, 5);
		questions.list = questions.temp.map(function(a) {
			shuffleArray.shuffle(a.reponses);
			return a;
		});
	});

	// Affichage boutton "Question suivante"
	questions.nextQuestion = function() {
		questions.nextStatut = true;
	};

	// Partie timer !
	const MAX_TIME = 7000; // 7 secondes
	questions.timer = 100;
	
	let interval = $interval(function() {
		questions.timer -= 100 / (MAX_TIME/ (1000/60) );
		
		if (questions.timer <= 0) {
			questions.nextQuestion();
		}
	}, 1000/60);

	// Validation des questions
	questions.submit = function() {
		let bonnereponse = questions.list[questions.index].correct;
		if (questions.reponse === bonnereponse) {
			if (questions.timer >= 50) {
				questions.score = questions.score + 2;
			} else if (questions.timer < 50) {
				questions.score = questions.score + 1;
			}
		} else {
			questions.score = questions.score -2;
		}
		if (questions.index === 4) {
			$rootScope.resultatfinal = questions.score;
			$interval.cancel(interval);
			$location.url('/resultat');
			return;
		}

		questions.nextStatut = false;
		questions.reponse = undefined;
		questions.timer = 100; // Réinitialisation du timer
		questions.index++;
	};

});

// Contrôleur de la page du resultat
app.controller('ResultatCtrl', function($rootScope, $http) {
	let resultat = this;
	resultat.resultatfinal = $rootScope.resultatfinal;
	resultat.alreadysave = false;

	// Affichage du message correspondant au score
	if (resultat.resultatfinal > 4) {
		resultat.class = "ok";
		resultat.img = "img/good.png"
		resultat.message = "Même Chuck Norris n'a jamais été aussi sobre que vous ! Bonne route !";
	} else if (resultat.resultatfinal >= 0) {
		resultat.class = "ok";
		resultat.img = "img/good.png"
		resultat.message = "Vous semblez un peu stressé. Détendez-vous, tout va bien ! Vous pouvez-y aller, et surtout roulez tranquillement !";
	} else if (resultat.resultatfinal < 0) {
		resultat.class = "ko";
		resultat.img = "img/cancel.png"
		resultat.message = "Avec des réponses pareilles, mieux vaut être prudent . Attendez un peu avant de reprendre la route.";
	} else if (resultat.resultatfinal < -2) {
		resultat.class = "ko";
		resultat.img = "img/cancel.png"
		resultat.message = "Bon, il est définitivement temps d'aller cuver votre alcool !!! Jetez immédiatement ces clés de voiture !";
	}

	// Enregistrement du score
	resultat.submit = function() {
		let score = { name : resultat.pseudo, score : resultat.resultatfinal, date : Date.now()};
		$http.get('https://api.myjson.com/bins/chuon').then(function(response){
			resultat.scores = response.data;
			resultat.scores.push(score);
			$http.put('https://api.myjson.com/bins/chuon', resultat.scores);
			resultat.alreadysave = true;
		});
		return;
	};
});


app.factory('shuffleArray', function() {
	return {
		shuffle : function(d) {
			for (var c = d.length - 1; c > 0; c--) {
				var b = Math.floor(Math.random() * (c + 1));
				var a = d[c];
				d[c] = d[b];
				d[b] = a;
			}
			return d;
		}
	};
});
