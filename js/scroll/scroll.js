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
            scope.$emit("start:scroll", scope, elem);
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
    var content = null;
    return {
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, elem, attr) {
                    var html = scope.$eval(attr.scrollParse);
                    content = angular.element('<div></div>').append(html).contents();
                },
                post: function postLink(scope, elem, attr) {
                    elem.append(content);
                    $compile(content)(scope);
                }
            };
        }
    };
}]);
//интерпритирует html- теги
scroll.filter("html", ['$sce', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    };
}]);
/*
* Кэширование шаблона
 */
scroll.factory("tempCache", ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory("tempCache", {});
}]);
/*
 * Конструктор нашей функции
 */
scroll.factory("$infScroll", ['$rootScope', '$window', '$document', '$http', '$compile', 'tempCache', function ($rootScope, $window, $document, $http, $compile, tempCache) {
    var W = angular.element($window),
        scrollTop = 0,
        offset = 0,
        accept = true,
        dH = 0,
        wH = 0;

    var Scroll = function (options) {
        if (!(this instanceof Scroll)) {
            return new Scroll(options);
        }
        //Настройки
        angular.extend(this, {
            external: true,
            button: false,
            url: null,
            gifPath: null,
            indentToScroll: 200,
            template: null,
            limit: 5,
            offset: 0,
            scope: $rootScope,
            timestamp: Date.now(),
            method: "post",
            headers: null,
            alias: 'results',
            responseType: "json",
            heightWatch: null
        }, options);

        limit = this.limit;
        //Инициализация скролла
        this.scope.$on("start:scroll", function (e, scope, elem) {
            this.locScope = scope;
            this.elem = elem;
            this.locScope[this.alias] = [];

            if (!this.template) {
                if (!this.button) {
                    this.regScrollEvent();
                } else {
                    this.getTheData();
                }
            } else {
                this.loadTemplate(function () {
                    if (!this.button) {
                        this.regScrollEvent();
                    } else {
                        this.getTheData();
                    }
                }.bind(this));
            }
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
        /*
         * Подгружает шаблон
         */
        loadTemplate: function (callback) {
            var temp = tempCache.get(this.template), content = null;
            if (!temp) {
                $http.post(this.template).success(function (template, status) {
                        this.elem.append(template);
                        content = this.elem.contents();
                        $compile(content)(this.locScope);
                        tempCache.put(this.template, content);
                        callback();
                    }.bind(this)).error(function (data, status) {
                    this.trigger("scrollError", data, status);
                });
            } else {
                $compile(temp)(this.locScope);
                callback();
            }
        },
        //Преобразует объект, массив или массив объектов в строку для запроса
        toParam: function (data, prefix) {
            var requestString = [], value = null, i = 0, prefix = prefix || 0;
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
            var win = null, doc = null, big = false, small = true;
            if (this.external) {
                win = W;
                doc = $document[0].documentElement;
                dH = doc.clientHeight;
            } else {
                dH = this.elem[0].clientHeight;
                win = this.elem;
                doc = this.elem[0];
            }
            win.unbind('scroll');
            win.bind('scroll', function (e) {
                scrollTop = win[0].pageYOffset || doc.scrollTop;
                wH = Math.max(doc.scrollHeight, dH);//Длина с учетом подгруженных элементов

                if (scrollTop + this.indentToScroll >= wH - dH && accept) {
                    //Новая порция
                    this.getTheData();
                }

                if (this.heightWatch) {
                    if (scrollTop > this.heightWatch && !big) {
                        this.trigger('after:deadline');
                        big = true;
                        small = false;
                    }

                    if (scrollTop < this.heightWatch && !small) {
                        this.trigger('prev:deadline');
                        big = false;
                        small = true;
                    }
                }

            }.bind(this));
            this.getTheData();
        },
        prepareResult: function (data) {
            switch (this.responseType) {
                case 'json':
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
                    break;
                case 'html':
                    var content = angular.element('<div></div>').append(data).contents();
                    this.elem.append(content)
                    $compile(content)(this.locScope);
                    break;
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
                    this.trigger("afterScroll", this, data, status, accept);
                }.bind(this)).error(function (data, status) {
                this.trigger("scrollError", data, status);
            });
        },
        reset: function () {
            switch (this.responseType) {
                case 'json':
                    this.locScope[this.alias] = [];
                    break;
                case 'html':
                    this.elem.html('');
                    break;
            }
            offset = 0;
            this.getTheData();
        },
        //Дополнительные данные для запроса
        data: {}
    };

    return {
        init: function (options) {
            return Scroll(options);
        },
        scroll: accept,
        reset: this.reset,
        getTheData: this.getTheData
    }
}]);