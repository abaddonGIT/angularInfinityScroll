var app = angular.module('app', ['infScroll']);


app.controller("baseController", ['$scope', '$infScroll','$http','$rootScope', function($scope, $infScroll, $http, $rootScope) {
        //Инициализация скрола
        var scroll = $infScroll.init({
            url: "http://totpp.demosite.pro/slu/test.html",
            limit: 50,
            gifPath: "../loading.gif",
            alias: "items",
            heightWatch: 500,
            userControll: false,
            locScope: $scope,
            method: 'post'
        });

        //$scope.scrollStart = true;

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
            test2: "like"
        };



        scroll.bind("beforeScroll", function (e, ob) {
            //console.log(ob);
        });

        scroll.bind("userDataScrollControl", function (e, ob) {
            console.log("asasfasf");
        });

        scroll.bind("afterScroll", function (e, ob, data, status, accept){
            $scope.accept = accept;
        });

        scroll.bind("after:deadline", function () {
            console.log("big");
        });

        scroll.bind("prev:deadline", function () {
            console.log("small");
        });
}]);
