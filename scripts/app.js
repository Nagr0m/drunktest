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
		.otherwise({
			redirectTo	 : '/accueil'
		});

});

// Contrôleur de la page d'accueil
app.controller('AccueilCtrl', function($location) {
	let accueil = this;
	accueil.confirm = false;
	accueil.submit = function() {
		$location.url('/questions');
	};
});

// Contrôleur de la page des scores
app.controller('ScoresCtrl', function($http) {
	let scores = this;
	$http.get('https://api.myjson.com/bins/chuon').then(function(response){
		console.log(response);
	});
});

// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, shuffleArray, $interval) {
	let questions = this;
	questions.nextStatut = false;

	questions.list = [];
	questions.actuel = [];
	$http.get('/data.json').then(function(response){
		questions.list = shuffleArray.shuffle(response.data);
		questions.list = questions.list.slice(0, 5);
	});
	
	questions.index = 0;
	questions.actuel = questions.list[questions.index];
	console.log(questions.list);

	questions.nextQuestion = function(){
		questions.nextStatut = true;	
	};

	// Partie timer !
	const MAX_TIME = 7000; // 7 secondes
	questions.timer = 100;
	
	let interval = $interval(function() {
		questions.timer -= 100 / (MAX_TIME/ (1000/60) );
		
		if (questions.timer <= 0) {
			questions.submit();
		}
	}, 1000/60);

	questions.submit = function() {
		questions.index++;
		console.log(questions.reponse);
		questions.reponse = undefined;
		questions.timer = 100; // Réinitialisation du timer
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
