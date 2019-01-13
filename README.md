# Train-Schedule

#Purpose
This is a simple train scheduling app that allows the user to input a train name, destination, frequency, and start time. This information is then pushed to a firebase database. The entries in said database are used to populate the train schedule table.

Moment.js is used to calculate each train's next arrival time based on its frequency, start time, and the current time. The next arrival time and minutes till arrival are updated every minute so that they are always accurate.