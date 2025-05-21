import moment from "moment"


export const getFormatTime = () => {
    let currentDate = moment().format("YYYY-MM-DD");
    let currentToDate = moment().format("YYYY-MM-DD");
    let currentTime = moment().format("HH:mm");
    let currentHour = currentTime.split(":")[0];
    let currentMin = Number(currentTime.split(":")[1]);
    // console.log("currentMin", currentHour, currentMin);
    currentTime = get15MinutesFormat(currentMin, currentHour);
    console.log("currentTime- ", currentTime);
    if ((currentHour == 23) && (currentMin > 30) || (currentHour == 0) && (currentMin <= 30)) {
        currentDate = moment().add(1, "days").format("YYYY-MM-DD");
    }
    if ((currentTime.split(":")[0] == 23 && currentTime.split(":")[1] > 30) || (currentTime.split(":")[0] == 0) && (currentTime.split(":")[1] <= 30) || (currentHour == 23) && (currentMin > 45)) {
        currentToDate = moment().add(1, "days").format("YYYY-MM-DD");
    }
    return {
        from: {
            date: currentDate,
            time: currentTime,
            formatted: moment(currentDate + " " + currentTime, "YYYY-MM-DD HH:mm").format("MMM,DD HH:mm")
        },
        to: {
            date: currentToDate,
            time: moment(currentTime, "HH:mm").add(1, "hour").format("HH:mm"),
            formatted: moment(currentToDate + " " + moment(currentTime, "HH:mm").add(1, "hour").format("HH:mm"), "YYYY-MM-DD HH:mm").format("MMM,DD HH:mm")
        },
    }
}


export const get15MinutesFormat = (currentMin, currentHour) => {
    // console.log("currentMin", currentMin);
    if (currentHour == 24) {
        return "00:30";
    }
    if (currentMin >= 0 && currentMin <= 15) {
        return currentHour + ":30";
    } else if (currentMin >= 15 && currentMin <= 30) {
        return currentHour + ":45";
    } else if ((currentMin >= 30 && currentMin <= 45) && (currentHour == 23)) {
        return "00:00";
    }
    else if (currentMin >= 30 && currentMin <= 45) {
        return String(Number(currentHour) + 1) + ":00";
    }
    else if ((currentMin >= 45 && currentMin <= 60) && currentHour == 23) {
        return "01:15";
    }
    else if (currentMin >= 45 && currentMin <= 60) {
        return String(Number(currentHour) + 1) + ":15";
        // return String(Number(currentHour) + 1) + ":00";
    }
}


export const return12HrFormat = (time) => {
    return time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";
}


export const getTimeDifference = (time1, time2) => {
    let time1_moment = moment(time1, "YYYY-MM-DD, HH:mm");
    let time2_moment = moment(time2, "YYYY-MM-DD, HH:mm");
    let t1Date = time1_moment.format("YYYY-MM-DD");
    let t2Date = time2_moment.format("YYYY-MM-DD");
    // console.log("time1", t1Date, "time2", t2Date);
    return diffYMDHMS(time1_moment, time2_moment);
    if (t1Date == t2Date) {
        let diff = time2_moment.diff(time1_moment);
        return diff;
    }
    let diff = time2_moment.diff(time1_moment, "days");
    return diff;
}


function diffYMDHMS(date1, date2) {


    let years = date1.diff(date2, 'year');
    date2.add(years, 'years');

    let months = date1.diff(date2, 'months');
    date2.add(months, 'months');

    let days = date1.diff(date2, 'days');
    date2.add(days, 'days');

    let hours = date1.diff(date2, 'hours');
    date2.add(hours, 'hours');

    let minutes = date1.diff(date2, 'minutes');
    date2.add(minutes, 'minutes');

    let seconds = date1.diff(date2, 'seconds');

    // console.log(years + ' years ' + months + ' months ' + days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds');

    return {
        years,
        months: months,
        days: String(days)?.replace && String(days)?.replace("-", ""),
        hours: String(hours)?.replace && String(hours)?.replace("-", ""),
        minutes: String(minutes).replace && String(minutes).replace("-", ""),
        seconds: String(seconds).replace("-", "")
    };
}