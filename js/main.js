var app = angular.module('app', ['infScroll']);


app.controller("baseController", ['$scope', '$infScroll', function($scope, $infScroll) {
    //Инициализация скрола
    var scroll = $infScroll.init({
        url: "http://totpp.demosite.pro/slu/test.html",
        limit: 50,
        gifPath: "../loading.gif",
        alias: "items"
    });

    $scope.changeData = function () {
        scroll.data = {
            test: "new datas!"
        };
    };

    $scope.getMore = function () {
        scroll.getTheData();
    };

    $scope.resetScroll = function () {
        scroll.reset();
    }

    scroll.data = {
        test: "Hello Mickle!",
        test2: "like",
        action: {m: "test" ,p: "test2"},
    };

    scroll.bind("beforeScroll", function (e, ob) {
        //console.log(ob);
    });

    scroll.bind("afterScroll", function (e, ob, data, status, accept){
        $scope.accept = accept;
    }); 
}]);
