"use strict"

module.exports = async (context, callback) => {
    var request = require('sync-request');

    const apiKey = process.env.owkey
    const city = "Calgary"

    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey;

    var weather = request('GET', url);
    
    var r = {}

    r = JSON.parse(weather.getBody('utf8'));

    var desc=r.weather[0].description

    return {desc}
    
}
