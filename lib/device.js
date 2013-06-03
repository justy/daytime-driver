var stream = require('stream')
  , util = require('util')
, cronJob = require('cron').CronJob
,querystring = require('querystring')
,request = require('request');
 
// Give our device a stream interface
util.inherits(Device,stream);
 
// Export it
module.exports=Device;
 
/**
 * Creates a new Device Object
 *
 *
 * @fires data - Emit this when you wish to send data to the Ninja Platform
 */
function Device() {
 
  var self = this;
 
  // This device will emit data
  this.readable = true;
  // This device can be actuated
  this.writeable = true;
 
  this.G = "daynight"; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 244; // 244 is a Ninja Blocks state device
 
    var sunset;
    var sunrise;
 
 
    var latitude = 0;       // Replace with your latitude
    var longitude = 0;     // Replace with your longitude
    var key = 'YOUR_API_KEY';
    var post_domain = 'biio-geoastroapi.p.mashape.com';
    var post_path = 'sun_info';
    var post_port = 433;
 
    var today = new Date();
    var post_data = querystring.stringify({
                                          'day' : today.getDate(),
                                          'lat' : latitude,
                                          'lng' : longtitude,
                                          'month' : (today.getMonth()+1),
                                          'year' : today.getFullYear()
                                          });
    request(
            {method: 'GET',
            url: 'https://'+post_domain+'/'+post_path+'?'+post_data,
            headers : { 'X-Mashape-Authorization':key}
            }
            , function(error,response,body){
            console.log(body);
 
            var result = JSON.parse(body);
 
            sunrise = new Date(today.getFullYear(),today.getMonth(),today.getDate(),result.sunrise.substring(0,2),result.sunrise.substring(3,5));
            sunset  = new Date(today.getFullYear(),today.getMonth(),today.getDate(),result.sunset.substring(0,2),result.sunset.substring(3,5));
 
            console.log('Sunrise is at :'+sunrise+' Sunset is at :'+sunset);
 
 
            if (today>sunrise && today<sunset)
            {
            self.emit('data','day');
            console.log('it is currently '+today+' and it is day time');
            }
            else
            {
            self.emit('data','night');
            console.log('it is currently '+today+' and it is night time');
            }
 
            });
 
 
 
    var jobSetSunset = new cronJob({cronTime: '0 1 0 * * *',
                                   onTick: function(){
                                   //runs once a day at 1 minute past midnight
                                   sunset = new Date(2013,1,1,0,0,0,0);
                                   sunrise = new Date(2013,1,1,0,0,0,0);
 
                                   var today = new Date();
 
                                   var post_data = querystring.stringify({
                                                                         'day' : today.getDate(),
                                                                         'lat' : latitude,
                                                                         'lng' : longtitude,
                                                                         'month' : (today.getMonth()+1),
                                                                         'year' : today.getFullYear()
                                                                         });
 
 
                                   request(
                                           {method: 'GET',
                                           url: 'https://'+post_domain+'/'+post_path+'?'+post_data,
                                           headers : { 'X-Mashape-Authorization':key}
                                           }
                                           , function(error,response,body){
                                           //console.log(body);
 
                                           var result = JSON.parse(body);
 
                                           sunrise = new Date(today.getFullYear(),today.getMonth(),today.getDate(),result.sunrise.substring(0,2),result.sunrise.substring(3,5));
                                           sunset  = new Date(today.getFullYear(),today.getMonth(),today.getDate(),result.sunset.substring(0,2),result.sunset.substring(3,5));
 
                                           console.log('Sunrise is at :'+sunrise+' Sunset is at :'+sunset);
                                           });
 
 
                                   },
                                   start:true});
 
 
 
    var job = new cronJob({cronTime: '0 * * * * *', 
                          onTick: function() {
                          //runs every minute
                          var currentDate = new Date();
                          var hours = currentDate.getHours();
                          var minutes = currentDate.getMinutes();
                          if (hours == sunset.getHours() && minutes == sunset.getMinutes())
                          {
                          self.emit('data','night');
 
                          console.log('night');
                          }
                          if (hours == sunrise.getHours() && minutes == sunrise.getMinutes())
                          {
                          self.emit('data','day');
                          console.log('day');
                          }
 
            },
            start:true
            });
 
 
};
 
/**
 * Called whenever there is data from the Ninja Platform
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Device.prototype.write = function(data) {
 
  // I'm being actuated with data!
  console.log(data);
};