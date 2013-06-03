#driver-daytime

## A wrapper around @andynix's daytime driver.

### Installation

You'll need an account with www.mashape.com (The API used in this Driver is free if you don't make more than 1000 queries a month.  This Driver makes one query a day.)

1. Clone this repo
2. cd into the repo's directory and do ```npm install```
3. Register to use the GeoAstroApi
4. Replace the API key found in the code with your mashape.com API key
5. Restart your client

### Usage

A new State widget will appear on your dashboard.  There will be no states within it initially, but as soon as either daytime or nighttime occur, you'll see those events represented as States within the widget.  At this point, save them as Sensors.

Now you can use these sensors in your Rules- for example 'When Nighttime, actuate outside light'.

