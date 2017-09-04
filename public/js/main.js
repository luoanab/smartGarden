$(document).ready(function(){
    console.log("yo");
    var operationState;
    
    $.ajax({
        url: "sensors/operation"
    }).done(function(response){
        operationState = response.data.operation_mode;
        if (operationState === "MANUAL") {
            $('#automatic-mode').bootstrapToggle('off');
        } else {
            $('#automatic-mode').bootstrapToggle('on');
        }
    });
    
    bindEvents();
})

function bindEvents() {
    $('#automatic-mode').change(function() {
        $.ajax({
            url: "sensors/operation",
            method: "PUT",
            data: {
                mode: $('#automatic-mode').prop("checked") ? "AUTO" : "MANUAL"
            }
        });
    });
}