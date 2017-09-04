$(document).ready(function(){
    console.log("yo");
    var operationState;
    
    $.ajax({
        url: "sensors/operation"
    }).done(function(response){
        operationState = response;
        if (operationState === "manual") {
            $('#automatic-mode').bootstrapToggle('off');
        } else {
            $('#automatic-mode').bootstrapToggle('on');
        }
    });
})

function bindEvents() {
    $('#automatic-mode').change(function() {
        $.ajax({
            url: "/operation",
            method: "POST",
            data: {
                mode: $('#automatic-mode').prop("checked")
            }
        });
    });
}