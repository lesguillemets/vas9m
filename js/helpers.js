const STORAGE = sessionStorage;
function toTwoDigits(n) {
    // n : integer, returnd 01..99
    const s = String(n).padStart(2, '0');
    return s;
}
function datetime_format(d) {
    // hhmmss
    const timestr = [
        toTwoDigits(d.getHours()),
        toTwoDigits(d.getMinutes()),
        toTwoDigits(d.getSeconds())
    ].join('');
    // 2024-09-23-103312
    const formatted = [
        d.getFullYear(),
        toTwoDigits(d.getMonth() + 1),
        toTwoDigits(d.getDate()),
        timestr
    ].join('-');
    return formatted;
}
