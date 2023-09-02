
module.exports = {

    getActualTimeStampHHMMSS: function () {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}-${minutes}-${seconds}`;
    },

    getActualTimeStampYYYYMMDDhhmmss: function () {
        const now = new Date();
        const year = now.getFullYear().toString().padStart(4, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}-` + this.getActualTimeStampHHMMSS();
    }

}