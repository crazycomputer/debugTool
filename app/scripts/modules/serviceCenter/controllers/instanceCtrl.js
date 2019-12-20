angular.module('serviceCenter.sc')
    .controller('instanceController', ['$scope', '$state',
        '$stateParams', function ($scope, $state, $stateParams) {
            $scope.instance = $stateParams.instance
        }]);
