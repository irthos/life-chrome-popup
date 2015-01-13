'use strict';
angular.module('irth', ['firebase'])
.controller('ctrl', function($scope, $firebase, $firebaseAuth, $location){
	var dbURL = 'https://yourlife.firebaseio.com/',
	ref = {}, sync = {}, bind = {}, authRef = new Firebase(dbURL);
	$scope.lifestyle = [ 'activity', 'event', 'fuel', 'exercise', 'day', 'task', 'note'];
	$scope.nav = {body:['fuel', 'exercise'], mind:['activity', 'task', 'note'], spirit:['day', 'event']};
	$scope.pictures = [
		'http://www.emahomagazine.com/wp-content/uploads/2013/04/%E7%BA%A2%E8%89%B2%E4%BC%A0%E8%AF%B42-Red-No.2.jpg',
		'http://wallpaperest.com/wallpapers/abstract-yellow-and-orange_325759.jpg',
		'http://goldbinaryoption.com/wp-content/uploads/2014/01/g2.jpg',
		'http://globe-views.com/dcim/dreams/green/green-05.jpg',
		'http://upload.wikimedia.org/wikipedia/commons/5/5a/Blue_Bunny.jpg',
		'http://fc00.deviantart.net/fs71/i/2010/270/9/9/purple_indigo_violet_by_aspartamee-d2zm8e3.jpg',
		'http://www.thierrybisch.com/edition/pop_prints/images_en/LION/LION-VIOLET.jpg',
		'http://www.geekmanifesto.net/wordpress/wp-content/uploads/2013/01/Mark-of-the-Ninja.jpg'
	];
	$scope.getPicture = function(){
		var randomNumber = Math.floor(Math.random() * $scope.pictures.length);
		console.log(randomNumber);
		var randomImage = $scope.pictures[randomNumber];
		console.log(randomImage);
		return randomImage;
	};
	$scope.style = {};
	$scope.style.note = {position:'fixed', bottom: 0, left:0, width:'300px', minHeight: '300px', margin: '0 0.7%', zIndex:0};
	$scope.show = {note:{big:true}};
	$scope.showLinks = {mind:true,body:true,spirit:true};
	$scope.life = [];
	$scope.syncArray = {};
	$scope.syncObject = {};
	$scope.bindObject = {};
	$scope.beGone = {};
	$scope.new = {};
	$scope.api = {add:{}};
	$scope.login = {email:'',password:''};
	$scope.authObj = $firebaseAuth(authRef);
	$scope.location = $location;
	$scope.auth = function(email, password){
		$scope.authObj.$authWithPassword({
			email: email,
			password: password
		}).then(function(authData) {
			$scope.authData = authData;
			console.log("Logged in as:", authData.uid);
			$scope.getData();

		}).catch(function(error) {
			console.error("Authentication failed:", error);
		});

	};
	if($scope.location.$$protocol === 'chrome-extension'){
		$scope.auth('i@o.io','o');
		$scope.showLinks = {};
	}

	$scope.getData = function(){
		angular.forEach($scope.lifestyle, function(life){
			$scope.new[life]={};
			$scope.beGone[life] = 'display:none';
			ref[life] = new Firebase(dbURL + '/irth/' + life);
			sync[life] = $firebase(ref[life]);
			$scope.syncObject[life] = sync[life].$asObject();
			bind[life] = sync[life].$asObject();
			$scope.syncArray[life] = sync[life].$asArray();
			$scope.bindObject[life] = bind[life].$bindTo($scope, life.toString());
		});
		$scope.beGone.activity = '';

	};
	$scope.getData();

		// API

		angular.forEach($scope.lifestyle, function(section){
			// Loop through the lifestyle array
			// and create a method on api.add for each section
			$scope.api.add[section] = function(submission) {
				var time = Date.now();
				submission.created = time;
				sync[section].$push(submission);
			};
		});

		$scope.removeEntry = function(type, id) {
			console.log( 'removing', type + ": " + id );
			sync[type].$remove(id);
		};

		$scope.copy = function(entry) {
			return angular.copy(entry);
		};



	$scope.hideAll = function () {
		angular.forEach($scope.lifestyle, function(life){
			$scope.beGone[life] = 'display:none';
		});
	};

	$scope.completeTask = function(id) {
		var timestamp = Date.now();
		sync.task.$update(id, {done:timestamp });
	};
	$scope.unCompleteTask = function(id) {
		var timestamp = Date.now();
		sync.task.$update(id, {done:false, undone:timestamp});
	};


		$scope.cLifestyle = [{name:'activity', models:{name: new String(), time: new Number(), details: new String(), tags: new Array() }, methods:{create:$scope.addActivity}}];


	})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);
/*
.filter('searchResults', function($firebase){
	return function(entries, search) {
		var results = [];
		console.log('search', search);
		console.log('entry', entries);
		var searchable = entries.$asArray();
		searchable.$filter();
		angular.forEach(entries, function(entry){
			if(search === entry) {
				console.log('value allowed',entry);
				results.push(entry)
			}
		});
		return results;
	}
});
*/