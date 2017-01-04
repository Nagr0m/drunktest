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
app.controller('QuestionsCtrl', function($http, $scope) {
	let questions = this;
	let questRandom = Math.ceil(Math.random()*4);

	questions.list = [];
	questions.actuel = [];
	$http.get('/data.json').then(function(response){
		questions.list = response.data;
		questions.actuel = questions.list[questRandom];
	});

	questions.random = function() {
        return 0.5 - Math.random();
    }

	questions.nextStatut = false;
	questions.nextQuestion = function(){
		questions.nextStatut = true;
	};
});
