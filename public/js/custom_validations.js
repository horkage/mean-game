gameApp.directive('loginAvailable', ['$http', function($http) {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function() {
        $http({
          method: 'POST',
          url: '/accountServices/isLoginAvailable',
          data: {'field': attrs.loginAvailable, 'value': c.$viewValue}
        }).success(function(data, status, headers, cfg) {
          c.$setValidity('available', data.isAvailable);
        }).error(function(data, status, headers, cfg) {
          console.log('Bork: ' + data);
        });
      })
    }
  }
}]);

gameApp.directive('equals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      if (!ngModel) {
        console.log('no ngModel');
        return;
      }

      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      attrs.$observe('equals', function(val) {
        validate();
      });

      var validate = function(val) {
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;
        if (!scope.signupForm.password.$pristine && !scope.signupForm.password_confirm.$pristine) {
          ngModel.$setValidity('equals', val1 === val2);
        }
      };
    }
  }
});
