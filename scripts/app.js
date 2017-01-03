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
app.controller('AccueilCtrl', function() {
	let accueil = this;

});

// Contrôleur de la page des scores
app.controller('ScoresCtrl', function() {
	let scores = this;

});

// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http) {
	let questions = this;

	questions.nextStatut = false;

	questions.list = [];
	$http.get('/data.json').then(function(response){
		questions.list = response.data.questions;
	});

	questions.nextQuestion = function(){
		questions.nextStatut = true;
	};
});
