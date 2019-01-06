var trainName = "";
var destination = "";
var startTime = "";
var frequency = "";

$("#add-train").on("click", function(event) {
    event.preventdefault();

    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    startTime = $("#start-time").val().trim();
    frequency = $("#frequency").val().trim();

})