// controls checkAll checkboxes
$(".checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
    $('input:checkbox').not(this).prop('indeterminate', false);
    this.checked ? $(".download").show() : $(".download").hide()
});

// controls parent category checkboxes in dataset landing page
$(".parent").click(function () {
    let subClass = ".sub-" + this.id
    $(subClass).prop('checked', this.checked);
    globalCheck();
})

// called by each subcategory checkbox on dataset landing page, updates parent checkbox
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

// updates checkAll textbox, and also controls if download button is visible
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

    noneChecked ? $(".download").hide() : $(".download").show()
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// creates curl string for download use
function getCurl() {
    let curlString = 'curl -d "';
    $("td.sub-input input:checked").each(function () {
        curlString += 'd[]=' + encodeURIComponent(this.value) + '&';
    })
    curlString = curlString.slice(0, -1);
    curlString += '" -X POST -JO localhost:5000/d/'
    $(".curl-link-box").attr('value', curlString);
}