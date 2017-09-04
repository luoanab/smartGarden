$(document).ready(function(){
    console.log("yo");
    var operationState,
        thresholds,
        sensorValues;
    
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
    
    $.ajax({
        url: "thresholds/all"
    }).done(function(response){
        thresholds = response.data.operation_mode;
    });
    
    $.ajax({
        url: "sensors"
    }).done(function(response){
        sensorValues = response.data;
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
        }).done(function(){
            //
        }).fail(function(){
            //
        });
    });
     
    $('.threshold-submit').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        
        var form = $(this).parent("form");
        
        $.ajax({
            url: "thresholds/"+form.attr("id"),
            method: "PUT",
            data: {
                lightUpperValue:form.find(".light-upper-value").val(),
                lightLowerValue: form.find(".light-upper-value").val(),
                tempUpperValue: form.find(".temp-upper-value").val(),
                tempLowerValue: form.find(".temp-upper-value").val(),
                moistureUpperValue: form.find(".moisture-upper-value").val(),
                moistureLowerValue: form.find(".moisture-upper-value").val(),
            }
        }).done(function(){
            //
        }).fail(function(){
            //
        });
    })
}