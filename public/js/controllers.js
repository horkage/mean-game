'use strict';

/* Controllers */

angular.module('theGame.controllers', [])
  .controller('TestController', ['$scope', '$http', function($scope, $http) {
    $scope.dude = 'dude here'
    $scope.showDude = function() {
      $http({
        method: 'POST',
        url: '/api/getLogin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data) {
        $scope.dude = data
      })
    }
  }])
  .controller('HomeController', ['$scope', function($scope) {
    $scope.home = 'HOME SAYZ HIZ'
  }])
  .controller('GameController', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {
    AccountService.currentUser()
      .success(function(data, status, headers) {
        $scope.user = data.user
      });
  }])
  .controller('QritterController', ['$scope', 'AccountService', 'HTTPService', function($scope, AccountService, HTTPService) {
    $scope.qritters = {};
    $scope.showGuys = [];
    $scope.progress = 100;
    $scope.sentIndex = 0;
    $scope.progressArray = [];
    $scope.progressStyle = [];
    $scope.sentGuys = [];
    $scope.showDispatchedText = [];
    $scope.showReadyText = [];
    AccountService.currentUser()
      .success(function(data, status, headers) {
        $scope.user = data.user
        $scope.qritters = data.user.qritters
      });

    $scope.showThisGuy = function(index) {
      $scope.showGuys[index] = !$scope.showGuys[index];
    };

    $scope.dispatch = function(qritterId,index) {
      $scope.sentIndex = index;
      $scope.sentGuys.push(index);
      HTTPService.dispatchQritter(qritterId)
        .then(function(timestamp) {
          $scope.bob = timestamp;
          console.log('YAY: ' + timestamp);
          $scope.progress = 1;
          $scope.progressArray[index] = 1;
          $scope.time = timestamp;
          $scope.kickOff();
          $scope.qritters[index].dispatched = true;
          $scope.progressStyle[index] = 'warning';
          $scope.showDispatchedText[index] = true;
        }, function(msg) {
          console.log('BOO: ' + msg);
        });
    };

    $scope.kickOff = function() {
      $scope.interval = setInterval(function() { 
        // func()
        $scope.$apply($scope.draw);
      }, 1000);
    };

    $scope.draw = function() {
      //console.log($scope.time);
      $scope.sentGuys.forEach(function(index) {
        //$scope.progressArray[$scope.sentIndex] = $scope.progressArray[$scope.sentIndex] + 1;
        $scope.progressArray[index] = $scope.progressArray[index] + 1;
        if ($scope.progressArray[index] >= 100) {
          $scope.qritters[index].dispatched = false;
          $scope.progressStyle[index] = 'success';
          $scope.showDispatchedText[index] = false;
          clearTimeout($scope.interval);
        };
      });
    }

    //$scope.tickTock = function('2014-05-07T05:38:47.562Z') { };
  }])
  .controller('InventoryController', ['$scope', '$http', 'socket', function ($scope, $http, socket) {
    $scope.items = [];
  
    socket.on('item', function(data) {
      console.log('socket got item: ' + data.name);
      $scope.items.push( { id: data.id, name: data.name } );
    });
  
    $http.get('/inventory')
      .success(function(data) {
        $scope.items = data;
        //console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }])
  .controller('SigninController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.word = /^\s*\w*\s*$/
    $scope.existingUser = {}

    $scope.login = function() {
      $http({
        method: 'POST',
        url: '/api/login',
        data: $.param($scope.existingUser),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data) {
        if (!data.success) {
          $scope.errorLogin = true;
          $scope.errorLoginMessage = 'Invalid login credentials'
        } else {
          $location.path('/game')
        }
      })
    }
  }])
.controller('SignupController', ['$scope', '$location', 'BirthdayService', 'HTTPService', function($scope, $location, BirthdayService, HTTPService) {

    $scope.word     = /^\s*\w*\s*$/
    $scope.newUser  = {}

    $scope.months   = BirthdayService.getMonths()
    $scope.days     = BirthdayService.getDays()
    $scope.years    = BirthdayService.getYears()

    $scope.createAccount = function() {
      $scope.newUser = BirthdayService.parsifyBirthday($scope.newUser)
      HTTPService.createAccount($.param($scope.newUser))
        .then(function() {
          $location.path('/game')
        }, function(error) {
          $scope.errorLogin = true;
          $scope.errorLoginMessage = 'ACK! We were unable to create your account -- we\'re looking into why right now..';
        })
    } 
  }])
.controller('SnotController', ['$scope', 'QritterService', 'WeaponService', 'ArmorService', 'ItemService', function($scope, QritterService, WeaponService, ArmorService, ItemService) {
  var Qritter = QritterService;
  var Weapon = WeaponService;
  var Armor = ArmorService;
  var Item = ItemService;

  $scope.qritter = {};
  $scope.qritters = [];

  $scope.weapon = {};
  $scope.weapons = [];

  $scope.armor = {};
  $scope.armors = [];

  $scope.item = {};
  $scope.items = [];

  Qritter.query(function(qritters) {
    $scope.qritters = qritters;
  })

  $scope.saveQritter = function() {
    Qritter.save(
      {},
      $scope.qritter,
      function(response) { //success
        Qritter.query(function(qritters) {
          $scope.qritters = qritters;
        })
      }, 
      function(response) { //error
        $scope.response = 'boo'; 
      }
    );
  };

  $scope.deleteQritter = function(qritter) {
    // no, seriously, I referenced qritter._id up here, then the id magically passed, I removed the
    // reference here, reloaded/restarted the app OVER AND OVER and it refused to break again..
    // *shakes tiny fist at angular $resource
    var bob = Qritter.remove(
      {},
      { id: qritter._id }, 
      function(response) { //success
        $scope.response = 'yay';
        Qritter.query(function(qritters) {
          $scope.qritters = qritters;
        })
      },
      function(response) { //error
        $scope.response = 'boo';
      }
    );
  }
  
  Weapon.query(function(weapons) {
    $scope.weapons = weapons;
  })
  
  $scope.saveWeapon = function() {
    Weapon.save(
      {},
      $scope.weapon,
      function(response) { //success
        Weapon.query(function(weapons) {
          $scope.weapons = weapons;
        })
      }, 
      function(response) { //error
        $scope.response = 'boo'; 
      }
    );
  };
  
  $scope.deleteWeapon = function(weapon) {
    var bob = Weapon.remove(
      {},
      { id: weapon._id }, 
      function(response) { //success
        Weapon.query(function(weapons) {
          $scope.weapons = weapons;
        })
      },
      function(response) { //error
        $scope.response = 'boo';
      }
    );
  }
  
  Armor.query(function(armors) {
    $scope.armors = armors;
  })
  
  $scope.saveArmor = function() {
    Armor.save(
      {},
      $scope.armor,
      function(response) { //success
        Armor.query(function(armors) {
          $scope.armors = armors;
        })
      }, 
      function(response) { //error
        $scope.response = 'boo'; 
      }
    );
  };
  
  $scope.deleteArmor = function(armor) {
    var bob = Armor.remove(
      {},
      { id: armor._id }, 
      function(response) { //success
        Armor.query(function(armors) {
          $scope.armors = armors;
        })
      },
      function(response) { //error
        $scope.response = 'boo';
      }
    );
  }
  
  Item.query(function(items) {
    $scope.items = items;
  })
  
  $scope.saveItem = function() {
    Item.save(
      {},
      $scope.item,
      function(response) { //success
        Item.query(function(items) {
          $scope.items = items;
        })
      }, 
      function(response) { //error
        $scope.response = 'boo'; 
      }
    );
  };
  
  $scope.deleteItem = function(item) {
    var bob = Item.remove(
      {},
      { id: item._id }, 
      function(response) { //success
        Item.query(function(items) {
          $scope.items = items;
        })
      },
      function(response) { //error
        $scope.response = 'boo';
      }
    );
  }

}]);
