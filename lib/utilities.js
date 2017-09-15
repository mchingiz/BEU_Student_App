const timestamp = function(timeOffset = 0){
    var dt = new Date( new Date().getTime()+timeOffset*3600*1000 );

    return (dt.getMonth() + 1) + "/" +
        dt.getDate() + "/" +
        dt.getFullYear() + " " +
        dt.getHours() + ":" +
        dt.getMinutes() + ":" +
        dt.getSeconds();
};

module.exports = {
    timestamp: timestamp
};