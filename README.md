angularInfinityScroll
=====================

Подгрузка контента при прокрутке страницы на angularjs.


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
                <pre>scroll.init({Тут натсройка модуля});</pre>
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
</pre>
    </li>
</ol>

