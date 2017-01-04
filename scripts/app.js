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
app.controller('QuestionsCtrl', function($http, shuffleArray) {
	let questions = this;
	let questRandom = Math.ceil(Math.random()*4);

	questions.list = [];
	questions.actuels = [];
	$http.get('/data.json').then(function(response){
		questions.list = shuffleArray.shuffle(response.data);
		questions.actuel = questions.list.slice(0, 5);
		console.log(questions.actuel);
	});

	questions.nextStatut = false;
	questions.nextQuestion = function(){
		questions.nextStatut = true;
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
			return d
		}
	};
});
