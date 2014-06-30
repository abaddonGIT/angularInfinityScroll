angularInfinityScroll
=====================

Директива реализует бесконечную подгрузку контента на angularjs.

<h2>Как использовать?</h2>
<ol>
    <li>
        Подключение:
        <pre>var app = angular.module("app", ['infScroll']);</pre>
    </li>
    <li>Настройка:
        <pre>app.controller("baseController", ['$scope', '$infScroll', function($scope, $infScroll) {
    //Конфигурация
    var scroll = $infScroll.init({...});
}]);</pre>
    <h3>Параметры:</h3>
        <ul>
            <li><b>url</b> - адрес для запроса контента</li>
            <li><b>limit</b> - лимит</li>
            <li><b>gifPath</b> - путь до картинки прелодера</li>
            <li><b>alias</b> - Если вывод подгруженного контента выводится при помощи дерективы ng-repat, то тут указывается имя объекта в котором будут храниться полученные данные.(по умолчанию items)</li>
            <li><b>heightWatch</b> - тут можно задать высоту, по прошествии которой будет возбуждаться событие в котором можно будет реализовать какое-либо действие.</li>
            <li><b>external</b> - определяет относительно чего будет отслеживаться прокрутка (true - относительно окна, false - относительно какого-либо блока на котором будет вызвана директива. По умолчанию true)</li>
            <li><b>indentToScroll</b> - отступ снизу, с которого будет запускать подгрузка. Ро умолчанию 200px</li>
            <li><b>template</b> - адрес файла с шаблоном для результата.</li>
            <li><b>method</b> - метод запроса контента (GET или POST. По умолчанию POST)</li>
            <li><b>headers</b> - кастомный заголовок для запроса контента. 
                По умолчанию <pre>{'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}</pre>
            </li>
            <li><b>button</b> - если стоит в true, то подгрузка контента осуществляется при помощи кнопки, а не по достижению конца страницы. По умолчанию false</li>
            <li>
                <b>responseType</b> - тип вывода полученных данных (json или html)
            </li>
            <li>
                <b>userControll</b> - если стоит true, то пользователь сам будет управлять выводом через событие <b>userDataScrollControl</b>, в котором доступен результат запроса
            </li>
            <li>
                <b>locScope</b> - текущий scope
            </li>
            <li>
                <b>pushState</b> - Усли true, то параметры, которые передаются в запрос будут прописываться в строке браузера и разбираться из неё для формирования запроса
            </li>
        </ul>
    </li>
    <li>
        Директивы:
        <ul>
            <li><b>scrollInit</b> - Инициализация модуля.
                <pre>
&lt;div data-scroll-init>
    &lt;ul>
        &lt;li ng-repeat="item in items track by $index">
            <b>{{item.pagetitle}}</b>
            <b>{{item.id}}</b>
        &lt;/li>
    &lt;/ul>
&lt;/div>
</pre>
            </li>
            <li><b>scrollParse</b> - если сервер отдает html в котором присутствуют какие-либо теги angularjs, то при помощи этой директивы они будут выполнены.
                <pre>&lt;span data-scroll-parse="item.introtext"></span></li>
            </li>
            <li>
                <b>scrollLoader - директива выводит прелодер при загрузке очередной порции контента</b>
                <pre>&lt;div data-scroll-loader>&lt;/div></pre>
            </li>
        </ul>
    </li>
    <li>
        Методы:
        <ul>
            <li>
                <b>init</b> - инициализирует модуль
                <pre>scroll.init({Тут настройка модуля});</pre>
            </li>
            <li>
                <b>reset</b> - сбрасывает текущее положение прокрутки
                <pre>scroll.reset();</pre>
            </li>
            <li>
                <b>getTheData</b> - запрашивает очередную порцию данных
                <pre>scroll.getTheData();</pre>
            </li>
        </ul>
        Передать дополнительные параметры к запросу можно при помощи переменной data:
        <pre>
$scope.changeData = function () {
    scroll.data = {
        test: "new datas!"
    };
};
</pre>
    </li>
    <li>
        События:
        <pre>
//Перед запросом
scroll.bind("beforeScroll", function (e, ob) {
    console.log(ob);
});
//После запроса
scroll.bind("afterScroll", function (e, ob, data, status, accept){
    console.log(ob);
});
//После прохождения высоты указанной в параметре heightWatch
scroll.bind("after:deadline", function () {
    console.log("big");
});
//После возвращения
scroll.bind("prev:deadline", function () {
    console.log("small");
});
//При пользовательском управлении выводом
scroll.bind("userDataScrollControl", function (e, data, status) {
    console.log(data);
});
</pre>
    </li>
</ol>
<hr />
angularInfinityScroll
=====================

Infinity scrolling on angularjs.

<h2>How to use it?</h2>
<ol>
    <li>
        Installation:
        <pre>var app = angular.module("app", ['infScroll']);</pre>
    </li>
    <li>Configuration:
        <pre>app.controller("baseController", ['$scope', '$infScroll', function($scope, $infScroll) {
    var scroll = $infScroll.init({...});
}]);</pre>
    <h3>Parameters:</h3>
        <ul>
            <li><b>url</b> - url to request</li>
            <li><b>limit</b></li>
            <li><b>gifPath</b> - Preloader image path</li>
            <li><b>alias</b> - Alias ​​variable to save results (by default "items")</li>
            <li><b>heightWatch</b></li>
            <li><b>external</b> - true - concerning window, false - concerning block on which you invoke directive. (by default true)</li>
            <li><b>indentToScroll</b> - margin bottom, upon reaching starting uploade new content. Ро умолчанию 200px</li>
            <li><b>template</b> - template url.</li>
            <li><b>method</b> - request method (GET or POST. by default POST)</li>
            <li><b>headers</b> - custom request header.
                by default <pre>{'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}</pre>
            </li>
            <li><b>button</b> - if this is true, then download new content by clicking on the button. by default false</li>
            <li>
                <b>responseType</b> - response data type (json или html)
            </li>
            <li>
                <b>userControll</b> - if is true, then the user himself performs the processing of data obtained in the event <b>userDataScrollControl</b>
            </li>
            <li>
                <b>locScope</b> - base scope
            </li>
            <li>
                <b>pushState</b> - data from the parameter "data" will be stored in url
            </li>
        </ul>
    </li>
    <li>
        Directives:
        <ul>
            <li><b>scrollInit</b> - Module Initialization.
                <pre>
&lt;div data-scroll-init>
    &lt;ul>
        &lt;li ng-repeat="item in items track by $index">
            <b>{{item.pagetitle}}</b>
            <b>{{item.id}}</b>
        &lt;/li>
    &lt;/ul>
&lt;/div>
</pre>
            </li>
            <li><b>scrollParse</b> - directive which interprets angular tags, if they are present in the query result
                <pre>&lt;span data-scroll-parse="item.introtext"></span></li>
            </li>
            <li>
                <b>scrollLoader - show preloader image</b>
                <pre>&lt;div data-scroll-loader>&lt;/div></pre>
            </li>
        </ul>
    </li>
    <li>
        Методы:
        <ul>
            <li>
                <b>init</b> - initializes the module
                <pre>scroll.init({module options});</pre>
            </li>
            <li>
                <b>reset</b> - reset module status
                <pre>scroll.reset();</pre>
            </li>
            <li>
                <b>getTheData</b> - Request a new piece of data
                <pre>scroll.getTheData();</pre>
            </li>
        </ul>
        Example transmitting additional data to the request
        <pre>
$scope.changeData = function () {
    scroll.data = {
        test: "new datas!"
    };
};
</pre>
    </li>
    <li>
        Events:
        <pre>
//Before request
scroll.bind("beforeScroll", function (e, ob) {
    console.log(ob);
});
//After request
scroll.bind("afterScroll", function (e, ob, data, status, accept){
    console.log(ob);
});
//After passage heightWatch
scroll.bind("after:deadline", function () {
    console.log("big");
});
//After returning heightWatch
scroll.bind("prev:deadline", function () {
    console.log("small");
});
//User output controll
scroll.bind("userDataScrollControl", function (e, data, status) {
    console.log(data);
});
</pre>
    </li>
</ol>

