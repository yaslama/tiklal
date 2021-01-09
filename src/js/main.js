var currentMajor = null
var currentMinor = null


buildMainMenu("#main")
// $("#main").append(elem)

$("#main").scroll(function() {
    console.log($("#main").scrollTop() + $("#main").height() + "       " + $("#main").height())

    if($("#main").scrollTop() + $("#main").height() > $("#main").height() - 100) {
        alert("near bottom!");
    }
 });