// Sets up global variables that will be used by the input fields
var trainName = "";
var destination = "";
var startTime = "";
var frequency = "";

// ----------------------------------------------------------
// Configures and initializes firebase, and also declares the database variable
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
// ----------------------------------------------------------

// A click event that takes the user inputs and pushes them to the database
$("#add-train").on("click", function(event) {
    event.preventDefault();
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

// Variable containing the current time. This is used to calculate next arrival time and time until next arrival
var currentTime = moment();
                     
function tableMaker() {
    database.ref().on("child_added", function(childSnapshot) {
        

        var frequency = childSnapshot.val().frequency;

        var startTimeConverted = moment((childSnapshot.val().startTime), "HH:mm").subtract(1, "years");

        var timeDifference;
        var remainder;
        var minTillTrain;
        var nextTrain;
        
        function timeUpdate() { 
            timeDifference = moment().diff(moment(startTimeConverted), "minutes");
            remainder = timeDifference % childSnapshot.val().frequency;
            minTillTrain = frequency - remainder;
            nextTrain = moment().add(minTillTrain, "minutes");
        }

        timeUpdate();
        

        var newRow = $("<tr>");
        var tableName = $("<td>");
                tableName.text(childSnapshot.val().trainName);

            var tableDestination = $("<td>");
                tableDestination.text(childSnapshot.val().destination);
        
            var tableFrequency = $("<td>");
                tableFrequency.text(childSnapshot.val().frequency);

            
            var tableNextArrival = $("<td>");
                tableNextArrival.addClass("next-arrival");
                tableNextArrival.text(moment(nextTrain).format("hh:mm"));
                
            var tableMinutesAway = $("<td>");
                tableMinutesAway.addClass("minutes-till-train");
                tableMinutesAway.text(minTillTrain);

            // var removeButton = $("<button>");
            //     removeButton.addClass("removeTrain");
            //     removeButton.text("Remove");
                
            setInterval(function() {
                timeUpdate();
                tableMinutesAway.text(minTillTrain);
                tableNextArrival.text(moment(nextTrain).format("hh:mm"));
            }, 1000 * 60);

            newRow.append(tableName);
            newRow.append(tableDestination);
            newRow.append(tableFrequency);
            newRow.append(tableNextArrival);
            newRow.append(tableMinutesAway);
            // newRow.append(removeButton);
            $("#train-schedule").append(newRow);
    })
}

tableMaker();

