exports.recurringIntervalDates = (
  startDate,
  endDate,
  interval,
  days,
  count
) => {
  // initialize date variable with start date
  var date = new Date(startDate);
  var endDate = new Date(endDate);
  var newDate;
  endDate.setSeconds(endDate.getSeconds() + 10);
  date.setSeconds(date.getSeconds() - 10);
  var sDate = new Date(startDate);

  // create array to hold result dates
  var dates = [];
  let startDays = [];
  let startDateDays = [];
  var startDates = [];
  // check if days exist, if so assign start date for each day
  if (days) {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    // push index of days array to startDays
    days.forEach(e => startDays.push(weekday.indexOf(e)));
    // get the index of the startDate day
    var submittedStartDay = date.getDay();

    // calculate each startDate based on days array and push to startDate array
    startDays.forEach(function(e) {
      var dayNumber = 6 - submittedStartDay + e;
      var date2 = new Date(startDate);

      var day = date2.setDate(date.getDate() + dayNumber);
      day = new Date(day);
      startDateDays.push(day);
    });
    if (interval !== 30) {
      // loop through startDateDays add the interval of days and push that to the array if it is on or before the end date
      startDateDays.forEach(function(e) {
        var h = new Date(e);
        while (e < endDate) {
          h.setDate(e.getDate() + interval);
          if (e < endDate) {
            dates.push(e);
          }
          e = new Date(h);
        }
      });
    } else if (interval == 30) {
      var firstDayOfStartMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );
      const startDayOfMonth = sDate.getUTCDate();
      const startWeekdayDayOfMonth = sDate.toLocaleDateString('en-us', {
        weekday: 'long'
      });
      //get the number week that each availability day will apply to in a month
      var numberWeek;
      if (startDayOfMonth < 7) {
        numberWeek = 1;
      } else if (startDayOfMonth < 14) {
        numberWeek = 8;
      } else if (startDayOfMonth < 21) {
        numberWeek = 15;
      } else {
        numberWeek = 22;
      }
      // get the week of start date for the start date month

      var h = sDate.setDate(sDate.getDate(numberWeek));
      h = new Date(h);

      function convertDateToUTC(date) {
        return new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          date.getUTCSeconds()
        );
      }
      var i = convertDateToUTC(h);
      if (h < endDate) {
        var d = h.getDate();
        h.setDate(d);
        h = new Date(h);
        h = convertDateToUTC(h);
        startDays.forEach(function(e) {
          var dayNum = h.getDay();
          var dayNumber = 6 - dayNum + e;
          if (dayNum > e) {
            dayNumber = dayNumber + 1;
          } else if (dayNum => dayNumber) {
            dayNumber = dayNumber - 6;
          }
          var dayOfMonth = new Date(h);
          dayOfMonth = dayOfMonth.setDate(dayOfMonth.getDate() + dayNumber);
          if (dayOfMonth < endDate && dayOfMonth > sDate) {
            dates.push(new Date(dayOfMonth));
          }
        });
      }
      console.log('startDays', startDays);
      // loop to push each month of days to the date array
      while (i < endDate) {
        var d = i.getDate();
        i.setMonth(i.getMonth() + count);
        if (i.getDate() != d) {
          i.setDate(d);
        }
        i = new Date(i);
        console.log(i);
        // i = convertDateToUTC(i);

        startDays.forEach(function(e) {
          // var trueE = e;
          // if (h.getDay() > 2 && h.getDay() !== e) {
          //   e = e + 1;
          // } else if (e == i.getDay() - 1) {
          //   e = 5;
          // }
          var dayNum = i.getDay();
          console.log('dayNumber', dayNum, e);

          var dayNumber = 6 - dayNum + e;
          if (dayNum > e) {
            dayNumber = dayNumber + 1;
          } else if (dayNum => dayNumber) {
            dayNumber = dayNumber - 6;
          }
          console.log('dayNumber', dayNumber);

          var dayOfMonth = new Date(i);
          console.log('dayOfMonth.getDate()', dayOfMonth.getDate());
          dayOfMonth = dayOfMonth.setDate(dayOfMonth.getDate() + dayNumber);
          console.log('dayOfMonth', new Date(dayOfMonth));

          if (dayOfMonth < endDate) {
            dates.push(new Date(dayOfMonth));
          }
        });
      }

      //push the day for that week that are in the days array into dates array
    } else {
      dates.push(startDate);
      // check for dates in range
      while ((newDate = addDays(date, interval)) < endDate) {
        // add new date to array
        dates.push(newDate);
      }
    }
  }
  // console.log(dates);
  return dates;
};

exports.addDays = (date, days) => {
  var newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

exports.getTime = (date, hours, minutes) => {
  new Date(date);
  date.setHours(parseInt(hours), parseInt(minutes), 0);
  return date;
};

exports.getFullDate = (date, hours, minutes) => {
  new Date(date);
  date.setHours(parseInt(hours), parseInt(minutes), 0);
  date.toLocaleString();
  return date;
};

exports.getDate = (date, hours, minutes) => {
  new Date(date);
  date.setHours(parseInt(hours), parseInt(minutes), 0);
  date.toLocaleDateString();

  return date;
};
