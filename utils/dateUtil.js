// Date Utils
const getBusinessDayAround = (date) => {
    let businessDay = new Date(date);
    while (true) {
        if (isWeekend(businessDay)) {
            businessDay = getOneDayAgo(businessDay)
        } else {
            break;
        }
    }
    return businessDay;
}

const getOneYearLater = (date) => {
    const oneYearLater = new Date(date);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    return oneYearLater;
}

const getOneYearAgo = (date) => {
    const oneYearAgo = new Date(date);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return oneYearAgo;
}

const getOneDayLater = (date) => {
    const oneDayLater = new Date(date);
    oneDayLater.setDate(oneDayLater.getDate() + 1);
    return oneDayLater;
}

const getOneDayAgo = (date) => {
    const oneDayAgo = new Date(date);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return oneDayAgo;
}

const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
}

const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}

const dateToSimpleString = (date) => {
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('');
};

module.exports = {
    getBusinessDayAround, getOneYearLater, getOneYearAgo, getOneDayLater, getOneDayAgo, isWeekend, isSameDate,
    dateToSimpleString
};