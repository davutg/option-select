var myApp = angular.module('app', []);

myApp.
directive('ngSize', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (!element.nodeName === 'SELECT') {
                return;
            }
            attrs.$observe('ngSize', function setSize(value) {
                attrs.$set('size', attrs.ngSize);
            });
        }
    }
}).
controller('optionsController', ['$scope', '$http', optionsController]);

function optionsController($scope, $http) {
    var vm = this;
    vm.options = {};
    vm.optionSize = 1;
    vm.init = function (callback) {
        if ($scope.optionsUrl) {
            if (!vm.options || !vm.options.length) {
                $http.get($scope.optionsUrl)
                    .then(function (res) {
                        vm.options = res.data;
                        for (var i = 0; i < vm.options.length; i++) {
                            var rrSize = vm.options[i].Options.length;
                            if (rrSize > vm.optionSize) {
                                $scope.vm.optionSize = rrSize + 1; //+1 is for null option
                            }
                        }
                        callback();
                    });
            } else {
                callback();
            }
        }
    }
    vm.uniqueId = $scope.uniqueId;
    vm.showModal = function (paramVal) {
        vm.init(function () {
            $('#' + vm.uniqueId).css("display", "block");
            if (paramVal) {
                $scope.modelResult = paramVal;
            }
        });
    }
    vm.closeModal = function () {
        $('#' + vm.uniqueId).css("display", "none");
    }
    vm.select = function (vmVal) {
        var temp = '';
        for (var i = 0; i < vmVal.options.length; i++) {
            var selectedText = null;
            if (!vmVal.options[i] || !vmVal.options[i].selection)
                selectedText = null;
            else
                selectedText = vmVal.options[i].selection.Text;

            if (selectedText && selectedText != 'n/a')
                temp = temp +' '+String.fromCharCode(29) + selectedText; //29 GS (group seperater), 9 HT (Horizontal tab)
        }
        temp = temp.substring(1); //remove leaing space
        //vmVal.result = temp;
        $scope.result = temp;
        //vm.result = temp;
        vm.closeModal();
    }
    $scope.excludeElementComparer = function (v1, v2) {
        if (v1.value == 'n/a' || v1.value === 'n/a')
            return -1;
        var res = v1.value.toString().localeCompare(v2.value.toString())
            //      console.log('v1:'+v1.value+' ,'+'v2:'+v2.value+' res-->'+res);
        return res;
    }
    $scope.buttonName = "Choose";
    $scope.editable = false;
    /*
    $scope.$watch('$scope.vm.optionSize', function () {
       $('#' + vm.uniqueId + ' select').attr("size", vm.optionSize);
    });            
    
    $scope.$watch('result',function(){
        console.log($scope.result); 
     });     
    
    $(document).ready(function () {
            console.log("ready!");        
        });
    */
}

myApp.filter('trim', function () {
    return function (input, param) {
        if (!input)
            return;
        if (input.length > param)
            return input.substring(0, param) + "...";

        return input;
    };
});

myApp.controller("mainPage", function ($scope) {
    $scope.result1 = '1-2 microgram(s)';
    $scope.isEditable = true;
});

myApp.directive("optionSelect", function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            optionsUrl: '=',
            result: '=?model',
            uniqueId: '@?',
            header: '@?',
            buttonName: '@?',
            editable: '@?'
        },
        controller: optionsController,
        controllerAs: 'vm',
        link: function link(scope, element, attrs, controller, transcludeFn) {

            if (attrs.hasOwnProperty('selectFirst')) {
                scope.selectFirst = true;
            } else {
                scope.selectFirst = false;
            }

        },
        templateUrl: '/templates/optionSelectTemplate.html'
    }
});