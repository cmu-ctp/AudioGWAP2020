
$(".checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
});

$(".parent").click(function () {
    let subClass = ".sub-" + this.id
    $(subClass).prop('checked', this.checked);
})

function uncheck(data, categoryName) {
    var allSubChecked = true;
    var noneChecked = true;
    var allChecked = true;
    $(".sub-"+categoryName).each(function () {
        if(!this.checked) {
            allSubChecked = false;
        } else {
            noneChecked = false;
        }
    })
    if(allSubChecked) {
        $("#"+categoryName)[0].checked = true;
        $("#"+categoryName)[0].indeterminate = false;
    } else if (noneChecked) {
        $("#"+categoryName)[0].checked = false;
        $("#"+categoryName)[0].indeterminate = false;
    } else {
        $("#"+categoryName)[0].indeterminate = true;
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
