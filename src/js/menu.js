function buildMainMenu(div) {
    $(div).empty()
    var titles = getMajorTitles()
    for(i = 0; i < titles.length; i++) {
        var majorElem = $("<span>").text(titles[i])
                                .attr("idx", i)
                                .attr("onclick", "buildMinorMenu(" + i + ", '" + div + "')")
        $(div).append(majorElem)
        $(div).append("<br>")
    }
} 

function buildMinorMenu(major, div) {
    $(div).empty()
    var titles = getMinorTitles(major)
    for(i = 0; i < titles.length; i++) {
        var minorElem = $("<span>").text(titles[i])
                                .attr("idx", i)
                                .attr("onclick", "showContent(" + major + ", " + i + ", '" + div + "')")
        $(div).append(minorElem)
        $(div).append("<br>")
    }
}


function showContent(major, minor, div) {
    $(div).empty()
    var elem = createSection(major, minor)
    $(div).append(elem)

}