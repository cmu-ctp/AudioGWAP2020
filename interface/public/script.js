$(function () {
    setNavigation();
});

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);

    $(".nav-items li a").click(function() {
        $(".nav li").removeClass("active");
        $(this).parent().addClass("active");
    });

}