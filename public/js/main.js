var operationState,
    thresholds,
    sensorValues;

$(document).ready(function() {
    if(window.location.href.indexOf("settings") > -1) {
        return;
    } else if (window.location.href.indexOf("threshold") === -1) { //is on index
        getAllThresholds();
        getSensorsData();
        getOperation();
        $('.dropdown-toggle.thresholds').dropdown();
    } else {
        getAllThresholds();
    }
    
    bindEvents();
})

function getSensorsData() {
    $.ajax({
        url: "sensors"
    }).done(function(response){
        //sensorValues = response.data;
        var temp = response.temperature_c;
        var lum = response.luminosity;
        var hum = response.moisture;
        $(".temp .sensor_value").text(temp);
        $(".light .sensor_value").text(lum);
        $(".moisture .sensor_value").text(hum);
    });
}

function getAllThresholds() {
    $.ajax({
        url: "thresholds/all"
    }).done(function(response){
        thresholds = response.data;
        
        if($('form.threshold').length) {
            populateForm($('#1'), thresholds["1"]);
            populateForm($('#2'), thresholds["2"]);
            populateForm($('#3'), thresholds["3"]);
        } else {
            //var selectedTh = $();
            populateThreshold(thresholds["1"]);
            setColors(1);
        }
    });
}

function setColors(index) {
    var th = thresholds["1"];
    
    if (th.tempLowerValue > sensorValues.luminosity || sensorValues.luminosity > th.tempUpperValue) {
        $(".temp").removeClass("green").addClass("red");    
    } else {
        $(".temp").removeClass("red").addClass("green"); 
    }
}

function populateForm(form, data) {
    if (!data) { return; }
    form.find('.light-upper-value').val(data.lightUpperValue);
    form.find('.light-lower-value').val(data.lightLowerValue);
    form.find('.moisture-upper-value').val(data.moistureUpperValue);
    form.find('.moisture-lower-value').val(data.moistureLowerValue);
    form.find('.temp-upper-value').val(data.tempUpperValue);
    form.find('.temp-lower-value').val(data.tempLowerValue);
}

function populateThreshold(data) {
    if (!data) { return; }
    $('.light-upper-value').text(data.lightUpperValue);
    $('.light-lower-value').text(data.lightLowerValue);
    $('.moisture-upper-value').text(data.moistureUpperValue);
    $('.moisture-lower-value').text(data.moistureLowerValue);
    $('.temp-upper-value').text(data.tempUpperValue);
    $('.temp-lower-value').text(data.tempLowerValue);
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

function handleSetHeat() {
    var heat = $(".heat-on");
    var state = heat.hasClass("off") ? true : false;
//    if(heat.hasClass("off")) {
    $.ajax({
        url: "sensors/heat",
        method: "PUT",
        data: {
            state: state
        }
    }).done(function(){
        //
    }).fail(function(){
        // display error here
    });
    heat.toggleClass("off");
}

function handleSetLight() {
    var heat = $(".light-on");
    var state = heat.hasClass("off") ? true : false;
//    if(heat.hasClass("off")) {
    $.ajax({
        url: "sensors/light",
        method: "PUT",
        data: {
            state: state
        }
    }).done(function(){
        //
    }).fail(function(){
        // display error here
    });
    heat.toggleClass("off");
}

function handleSetWater() {
    var heat = $(".water-on");
    var state = heat.hasClass("off") ? true : false;
//    if(heat.hasClass("off")) {
    $.ajax({
        url: "sensors/water",
        method: "PUT",
        data: {
            state: state
        }
    }).done(function(){
        //
    }).fail(function(){
        // display error here
    });
    heat.toggleClass("off");
}

function handleDropdownChange() {
    console.log("here???");
}

function bindEvents() {
    $('#automatic-mode').change(handleAutomaticModeChange);
    $('.threshold-submit').click(handleThresholdSumbit);
    $(".heat-on").click(handleSetHeat);
    $(".light-on").click(handleSetLight);
    $(".water-on").click(handleSetWater);
    
    //$('.dropdown-toggle.thresholds').on('hidden.bs.dropdown', handleDropdownChange);
    setInterval(function(){
        getSensorsData();
    }, 10000);
    
}