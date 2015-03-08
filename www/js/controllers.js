angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    $scope.loginData = {};
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

      // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

  // Open the login modal
  $scope.login = function() {
    console.log("login modal");
    $scope.modal.show();

  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  })

  .controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('detailsPark', function($scope, $stateParams, $interval) {
  // used to update the UI

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('MapCtrl', function($scope, $http, $cordovaGeolocation, $ionicSideMenuDelegate, $ionicLoading, $compile, $interval) {


    $scope.checkout = function () {
      $scope.url_view = true;
    };

    $scope.url_view = true;
    var startCount = function () {

      var now = Date.now();
      timeFunc =
          $interval(function(){
            var duration = Date.now() - now;
            var seconds = Math.floor(duration/1000);
            var minutes = Math.floor(seconds/60);
            seconds = seconds - minutes*60;
            console.log(minutes+":"+seconds);
            var count = minutes+":"+seconds;
            $scope.detailCounter = minutes+":"+seconds;
          },1000);

          $scope.$on('$destroy', function () { $interval.cancel(timeFunc); });
    };

    $scope.centerOnMe = function(){
        $scope.statusBar = "Check Out";
        $scope.url_view = false;
        startCount();

        $http.post('https://lightpark.herokuapp.com/parkings/checkin?parkingId=54fbd114a6a3b7d7ce770732&userId=54fbacba08cf960').then(function(resp) {

          console.log(resp);
        });


      };


      $ionicSideMenuDelegate.canDragContent(false);
      $scope.map = {center: {latitude: 19.410381, longitude: -99.169983 }, zoom: 19 };
      $scope.options = {scrollwheel: true};
      $scope.markers = [];
      // get position of user and then set the center of the map to that position
      // $cordovaGeolocation
      //   .getCurrentPosition()
      //   .then(function (position) {
      //     var lat  = position.coords.latitude;
      //     var long = position.coords.longitude;
      //     $scope.map = {center: {latitude: lat, longitude: long}, zoom: 16 };
      //     //just want to create this loop to make more markers
      //     for(var i=0; i<3; i++) {
      //       $scope.markers.push({
      //           id: $scope.markers.length,
      //           latitude: lat + (i * 0.002),
      //           longitude: long + (i * 0.002),
      //           title: 'm' + i
      //       });
      //     }
      //
      //   }, function(err) {
      //     // error
      //   });
      $scope.marker = {
      id: 0,
      coords: {
        latitude: 19.410381,
        longitude: -99.169983
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          $log.log(lat);
          $log.log(lon);

          $scope.marker.options = {
            draggable: true,
            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };
        }
      }
    };

      function onSuccess(pos) {
           console.log(pos.coords.latitude+' Longitude: ' + pos.coords.longitude     );
      }

      // onError Callback receives a PositionError object
      //
      function onError(error) {
          console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
      }

      // Options: throw an error if no update is received every 30 seconds.
      //
      var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 500, timeout: 5000, enableHighAccuracy: true });

      $http.get('https://lightpark.herokuapp.com/parkings?lon=-99.181323&lat=19.440478').then(function(resp) {
          //console.log('Success', resp);
          $scope.circles = [];
          var first = false;
          angular.forEach(resp.data, function(item, index) {
            console.log('valor '+item);

            var color = item.obj.occupied?'#D02416':'#08B21F';


            var circle =
                        {
                            id: index,
                            center: {
                                latitude:  item.obj.location.coordinates[1] ,
                                longitude: item.obj.location.coordinates[0]
                            },
                            radius: 1.3,
                            stroke: {
                              color: item.obj.occupied?'#D02416':'#08B21F',
                                weight: 2,
                                opacity: 1
                            },
                            fill: {
                                color: item.obj.occupied?'#D02416':'#08B21F',
                                opacity: 0.6
                            },
                            geodesic: true, // optional: defaults to false
                            draggable: false, // optional: defaults to false
                            clickable: false, // optional: defaults to true
                            editable: false, // optional: defaults to false
                            visible: true, // optional: defaults to true
                            control: {}
                        }
                    ;

                    $scope.circles.push(circle);
          });

          console.log($scope.circles);
          $scope.statusBar = "Check In";
          // For JSON responses, resp.data contains the result
        }, function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
        });





              // Simple GET request example :
              //√$http.get('http://lightpark.herokuapp.com/parkings?lon=-99.181323&lat=19.440478').



});
