var operationState,
    thresholds,
    sensorValues;

$(document).ready(function() {
    getOperation();
    getAllThresholds();
    getSensorsData();
    bindEvents();
})

function getSensorsData() {
    $.ajax({
        url: "sensors"
    }).done(function(response){
        sensorValues = response.data;
    });
}

function getAllThresholds() {
    $.ajax({
        url: "thresholds/all"
    }).done(function(response){
        thresholds = response.data.operation_mode;
    });
}

function getOperation() {
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
}

function handleAutomaticModeChange(e) {
    $.ajax({
        url: "sensors/operation",
        method: "PUT",
        data: {
            mode: $('#automatic-mode').prop("checked") ? "AUTO" : "MANUAL"
        }
    }).done(function(){
        //
    }).fail(function(){
        // display error here
    });
}

function handleShresholdSumbit(e) {
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
        // display error here
    });
}

function bindEvents() {
    $('#automatic-mode').change(handleAutomaticModeChange(e));
    $('.threshold-submit').click(handleShresholdSumbit(e));
}