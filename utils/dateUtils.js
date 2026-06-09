const MONTHS = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12'
};

function formatDateToYYYYMMDD(dateString) {
    const [day, month, year] = dateString.trim().split(' ');
    return `${year}-${MONTHS[month]}-${day.padStart(2, '0')}`;
}

function formatDateToMMYYYY(dateString) {
    const [month, year] = dateString.trim().split(' ');
    return `${MONTHS[month]}-${year}`;
}

function formatDateToMonthYear(dateString) {
    const MONTHS_REVERSED = Object.entries(MONTHS).reduce((acc, [name, num]) => {
        acc[num] = name;
        return acc;
    }, {});
    
    const [year, month, date] = dateString.split('-');
    return `${MONTHS_REVERSED[month]} ${year}`;
}
module.exports = { formatDateToYYYYMMDD, formatDateToMMYYYY, formatDateToMonthYear };

