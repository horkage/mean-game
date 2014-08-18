'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
/*
angular.module('theGame.services', []).
  value('version', '0.1');
*/

angular.module('theGame.services', [])
  .factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}).service('BirthdayService', 
  function() {
    return {
      parsifyBirthday: function(userObject) {
        userObject.dob = new Date([
                            userObject.selectedYear.year,
                            userObject.selectedMonth.ord,
                            userObject.selectedDay.day
                         ].join(','))
                            
                            //parseInt(userObject.selectedMonth.ord) - 1,

        delete userObject.selectedDay
        delete userObject.selectedMonth
        delete userObject.selectedYear

        return userObject
      },

      getMonths: function() {
        return [
          { name:'Jan', ord:1 },
          { name:'Feb', ord:2 },
          { name:'Mar', ord:3 },
          { name:'Apr', ord:4 },
          { name:'May', ord:5 },
          { name:'Jun', ord:6 },
          { name:'Jul', ord:7 },
          { name:'Aug', ord:8 },
          { name:'Sep', ord:9 },
          { name:'Oct', ord:10 },
          { name:'Nov', ord:11 },
          { name:'Dec', ord:12 }
        ];
      },

      getDays: function() {
        var days = [];
        for (var i = 1; i <= 31; i++) {
          days.push({ day:i });
        }
        return days
      },

      getYears: function() {
        var years = [];
        for (var i = 1900; i <= 2014; i++) {
          years.push({ year:i });
        }
        return years
      }
    }
  }
).service('HTTPService', ['$http', '$q',
  function($http, $q) {
    return {
      createAccount: function(newUser) {
        var d = $q.defer()

        $http({
          method: 'POST',
          url: '/api/createAccount',
          data: newUser,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data) {
          if (data.success) {
            d.resolve(true)
          }  else {
            d.reject(true)
          }
        })
        .error(function(error) {
          d.reject(true)
        })

        return d.promise
      },

      getCurrentUser: function() {
        var d = $q.defer()
        $http({
          method: 'POST',
          url: '/api/getLogin',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data) {
          if(!data.user) { $location.path('/') }
          d.resolve(data.user)
        })
        .error(function(error) {
          $location.path('/')
        })
        return d.promise
      },

      dispatchQritter: function(qritterId) {
        var d = $q.defer();
        $http({
          method: 'POST',
          url: '/api/dispatchQritter',
          data: $.param({'qritterId': qritterId}),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data) {
          console.log(data);
          d.resolve(data.timestamp);
        })
        .error(function(data) {
          d.reject('HTTPService could not dispatch qritter');
        });
        return d.promise;
      }
    }
  }
]).factory('AccountService', ['$http', function($http) {
  var getCurrentUser = function() {
    return $http({
      method: 'POST',
      url: '/api/getLogin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  return {
    currentUser: function() {
      return getCurrentUser();
    }
  }
}]).factory('QritterService', ['$resource', function($resource) {
  return $resource('/snot/qritters/:id', { id: '@id' });
}]).factory('WeaponService', ['$resource', function($resource) {
  return $resource('/snot/weapons/:id', { id: '@id' });
}]).factory('ArmorService', ['$resource', function($resource) {
  return $resource('/snot/armors/:id', { id: '@id' });
}]).factory('ItemService', ['$resource', function($resource) {
  return $resource('/snot/items/:id', { id: '@id' });
}])
