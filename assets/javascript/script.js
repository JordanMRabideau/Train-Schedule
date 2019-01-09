var trainName = "";
var destination = "";
var startTime = "";
var frequency = "";

var config = {
    apiKey: "AIzaSyBXe5dqRPad77fTdLsNFpA1FBr4zU9gcDE",
    authDomain: "train-scheduler-72153.firebaseapp.com",
    databaseURL: "https://train-scheduler-72153.firebaseio.com",
    projectId: "train-scheduler-72153",
    storageBucket: "train-scheduler-72153.appspot.com",
    messagingSenderId: "107760706366"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#add-train").on("click", function(event) {
    event.preventDefault();
    console.log("hello")
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    startTime = $("#start-time").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency
    })

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-time").val("");
    $("#frequency").val("");
})

var currentTime = moment();
console.log("Current time: " + moment(currentTime).format("hh:mm"));

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val())
    var startTimeConverted = moment((childSnapshot.val().startTime), "HH:mm").subtract(1, "years");
    console.log("Start time: " + startTimeConverted);

    var timeDifference = moment().diff(moment(startTimeConverted), "minutes");
    console.log("Difference in time: " + timeDifference);

    var remainder = timeDifference % childSnapshot.val().frequency;
    console.log("Remainder: " + remainder);

    var minTillTrain = childSnapshot.val().frequency - remainder;
    console.log("Minutes till next train: " + minTillTrain);

    var nextTrain = moment().add(minTillTrain, "minutes");
    console.log("Next train will arrive at: " + moment(nextTrain).format("hh:mm"));
    
    var newRow = $("<tr>");
       var tableName = $("<td>");
            tableName.text(childSnapshot.val().trainName);

        var tableDestination = $("<td>");
            tableDestination.text(childSnapshot.val().destination);
    
        var tableFrequency = $("<td>");
            tableFrequency.text(childSnapshot.val().frequency);
    
        var tableNextArrival = $("<td>");
            tableNextArrival.text(moment(nextTrain).format("hh:mm"));

        var tableMinutesAway = $("<td>");
            tableMinutesAway.text(minTillTrain);

        newRow.append(tableName);
        newRow.append(tableDestination);
        newRow.append(tableFrequency);
        newRow.append(tableNextArrival);
        newRow.append(tableMinutesAway);
        $("#train-schedule").append(newRow);
})