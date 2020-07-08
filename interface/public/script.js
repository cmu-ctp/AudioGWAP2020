
$(".checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
});

function check(categoryName) {
    var allChecked = true;
    if($("#"+categoryName)[0].checked){
        $(".sub-"+categoryName).prop("checked", true);
    } else {
        $(".sub-"+categoryName).prop("checked", false);
        $(".checkAll")[0].checked = false;
    }
    $('td input:checkbox').each(function () {
        if(!this.checked) {
            allChecked = false
        }
    })
    if(allChecked) {
        $(".checkAll")[0].checked = true;
    }

}
function uncheck(data, categoryName) {
    var allSubChecked = true;
    var allChecked = true;
    $(".sub-"+categoryName).each(function () {
        if(!this.checked) {
            $("#"+categoryName)[0].checked = false;
            $(".checkAll")[0].checked = false;
            allSubChecked = false;
        }
    })
    if(allSubChecked) {
        $("#"+categoryName)[0].checked = true;
    }
    $('td input:checkbox').each(function () {
        if(!this.checked) {
            allChecked = false
        }
    })
    if(allChecked) {
        $(".checkAll")[0].checked = true;
    }
}
