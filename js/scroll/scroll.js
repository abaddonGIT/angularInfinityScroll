/**
 * Created by netBeans.
 * User: abaddon
 * Date: 12.04.14
 * Time: 13:10
 * Description: Бесконечный скролл
 */
var scroll = angular.module("infScroll", []);
/*
* Инициализация прокрутки
*/
scroll.directive("scrollInit", [function ($infScroll) {
    return {
        link: function (scope, elem, attr) {
            //Запускаем
            scope.$emit("start:scroll", scope);
        }
    };
}]);
/*
* Показывает preloder
*/
scroll.directive("scrollLoader", [function () {
    return {
        replace: true,
        template: "<div class='loader' ng-show='showLoader' style='background: url({{gifPath}}) 50% 50% no-repeat'></div>",
        link: function (scope, elem, attr) {
            scope.$emit("loading:scroll", scope);
        }
    };
}]);
/*
* Интерпритирует теги и выражение angular-ра
*/
scroll.directive("scrollParse", ['$sce', '$compile', function ($sce, $compile) {
    return {
        compile: function compile(tElement, tAttrs, transclude) {
            return {
              pre: function preLink(scope, elem, attr) {
                    var html = scope.$eval(attr.scrollParse);
                    elem.append('<div>' + html + '</div>');           
              },
              post: function postLink(scope, elem, attr) {
                    var html = elem.contents();
                    $compile(html)(scope);
              }
            };
        }
    };
}]);
//интерпритирует html- теги
scroll.filter("html", ['$sce', function ($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    };
}]);
/*
* Конструктор нашей функции
*/
scroll.factory("$infScroll", ['$rootScope', '$window', '$document', '$http', function ($rootScope, $window, $document, $http) {
    var W = angular.element($window),
        scrollTop = 0,
        offset = 0,
        accept = true,
        dH = $document[0].documentElement.clientHeight,//Высота видимой части
        wH = 0;

    var Scroll = function (options) {
        if (!(this instanceof Scroll)) {
            return new Scroll(options);
        }
        //Настройки
        angular.extend(this, {
            external: true,
            url: null,
            gifPath: null,
            indentToScroll: 200,
            limit: 5,
            offset: 0,
            scope: $rootScope,
            timestamp: Date.now(),
            method: "post",
            headers: null,
            alias: 'results',
            responseType: "json"
        }, options);

        limit = this.limit;
        //Инициализация скролла
        this.scope.$on("start:scroll", function (e, scope) {
            this.locScope = scope;
            this.locScope[this.alias] = [];

            this.regScrollEvent();
        }.bind(this));
        //Прелодер
        this.scope.$on("loading:scroll", function (e, scope) {
            scope.gifPath = this.gifPath;
        }.bind(this));
    };
    
    Scroll.prototype = {
        bind: function (event, handler) {
            var name = event + ":" + this.timestamp;
            this.scope.$on(name, handler.bind(this));
        },
        trigger: function (event) {
            arguments[0] = event + ":" + this.timestamp;
            this.scope.$broadcast.apply(this.scope, arguments);
        },
        //Преобразует объект, массив или массив объектов в строку для запроса
        toParam: function (data, prefix) {
            var requestString = [], value = null, i = 0, prefix = prefix || 0;
           // requestString.push('limit=' + limit + '&offset=' + offset);
            if (angular.isArray(data)) {//если массив
                var ln = data.length;
                do {
                    value = data[i];
                    if (typeof(value) === "string") {
                        requestString.push('param_' + prefix + '=' + encodeURIComponent(value));
                    } else {
                        requestString.push(this.toParam(value, prefix));
                    }
                    i++;
                    prefix++;
                } while (i < ln);
            } else {//если объект
                for (var j in data) {
                    value = data[j];
                    if (typeof(value) === "string") {
                        requestString.push(j + '=' + encodeURIComponent(value));
                    } else {
                        requestString.push(this.toParam(value, prefix));
                    }
                    i++;
                }
            }
            return requestString.join("&");
        },
        regScrollEvent: function () {
            if (this.external) {//Относительно окна
                W.bind('scroll', function (e) {
                    scrollTop = $window.pageYOffset || $document[0].documentElement.scrollTop;
                    wH = Math.max($document[0].documentElement.scrollHeight, dH);//Длина с учетом подгруженных элементов

                    if (scrollTop + this.indentToScroll >= wH - dH && accept) {
                        //Новая порция
                        this.getTheData();
                    }

                }.bind(this));
            } else {//Относительно блока

            }
            this.getTheData();
        },
        prepareResult: function (data) {
            if (data instanceof Array) {
                var ln = data.length, i = 0;
                do {
                    this.locScope[this.alias].push(data[i]);
                    i++;
                } while (i < ln);
                if (ln < this.limit) {
                    accept = false;
                }
            } else {
                this.locScope[this.alias].push(data);
                if (data.length < this.limit) {
                    accept = false;
                }
            }
        },
        /*
        * Делает запрос на получение очередной порции данных
        */
        getTheData: function () {
            accept = false;
            var scope = this.locScope;
            //Показываем preloder
            scope.showLoader = true;
            this.trigger("beforeScroll", this);
            $http({
                method: this.method,
                url: this.url,
                data: this.data,
                headers: this.headers || {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
                responseType: this.responseType,
                transformRequest: function (data) {
                    return 'limit=' + limit + '&offset=' + offset + '&' + this.toParam(data);
                }.bind(this)
            }).success(function (data, status) {
                accept = true;//Разрешаем скролл
                this.prepareResult(data);
                scope.showLoader = false;
                offset += this.limit;
                this.trigger("afterScroll", this, data, status);
            }.bind(this)).error(function (data, status) {
                this.trigger("scrollError", data, status);
            });
        },
        reset: function () {
            offset = 0;
            this.locScope[this.alias] = [];
            this.getTheData();
        },
        //Дополнительные данные для запроса
        data: {}
    };

    return {
        init: function (options) {
            return Scroll(options);
        },
        reset: this.reset 
    } 
}]);