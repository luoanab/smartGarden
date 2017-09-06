var operationState,
    thresholds,
    sensorValues;

$(document).ready(function() {
    if(window.location.href.indexOf("settings") > -1) {
        return;
    } else if (window.location.href.indexOf("threshold") === -1) { //is on index
        getOperation();
        getSensorsData();
    }
    
    getAllThresholds();
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
        thresholds = response.data;
        
        if($('form.threshold').length) {
            populateThreshold($('#1'), thresholds["1"]);
            populateThreshold($('#2'), thresholds["2"]);
            populateThreshold($('#3'), thresholds["3"]);
        } else {
            //var selectedTh = $();
            populateThreshold(parent, thresholds["1"]);
        }
        
    });
}

function populateThreshold(form, data) {
    if (!data) { return; }
    form.find('.light-upper-value').val(data.lightUpperValue);
    form.find('.light-lower-value').val(data.lightLowerValue);
    form.find('.moisture-upper-value').val(data.moistureUpperValue);
    form.find('.moisture-lower-value').val(data.moistureLowerValue);
    form.find('.temp-upper-value').val(data.tempUpperValue);
    form.find('.temp-lower-value').val(data.tempLowerValue);
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

function handleAutomaticModeChange() {
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

function handleThresholdSumbit(e) {
    e.preventDefault();
    e.stopPropagation();

    var form = $(this).parent("form");

    $.ajax({
        url: "thresholds/"+form.attr("id"),
        method: "PUT",
        data: {
            lightUpperValue:form.find(".light-upper-value").val(),
            lightLowerValue: form.find(".light-lower-value").val(),
            tempUpperValue: form.find(".temp-upper-value").val(),
            tempLowerValue: form.find(".temp-lower-value").val(),
            moistureUpperValue: form.find(".moisture-upper-value").val(),
            moistureLowerValue: form.find(".moisture-lower-value").val(),
        }
    }).done(function(){
        //
    }).fail(function(){
        // display error here
    });
}

function bindEvents() {
    $('#automatic-mode').change(handleAutomaticModeChange);
    $('.threshold-submit').click(handleThresholdSumbit);
}