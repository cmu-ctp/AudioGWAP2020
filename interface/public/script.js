
$(".checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
});

$(".parent").click(function () {
    let subClass = ".sub-" + this.id
    $(subClass).prop('checked', this.checked);
    globalCheck();
})

function uncheck(data, categoryName) {
    var allSubChecked = true;
    var noneSubChecked = true;
    $(".sub-"+categoryName).each(function () {
        if(!this.checked) {
            allSubChecked = false;
        } else {
            noneSubChecked = false;
        }
    })
    if(allSubChecked) {
        $("#"+categoryName)[0].checked = true;
        $("#"+categoryName)[0].indeterminate = false;
    } else if (noneSubChecked) {
        $("#"+categoryName)[0].checked = false;
        $("#"+categoryName)[0].indeterminate = false;
    } else {
        $("#"+categoryName)[0].indeterminate = true;
    }
    globalCheck();
}

function globalCheck () {
    var allChecked = true;
    var noneChecked = true;
    $('td input:checkbox').each(function () {
        if(!this.checked) {
            allChecked = false
        } else {
            noneChecked = false;
        }
    })
    if(allChecked) {
        $(".checkAll")[0].checked = true;
        $(".checkAll")[0].indeterminate = false;
    } else if (noneChecked) {
        $(".checkAll")[0].checked = false;
        $(".checkAll")[0].indeterminate = false;
    } else {
        $(".checkAll")[0].indeterminate = true;
    }
}
