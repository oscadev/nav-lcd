# nav-lcd

Instructions (software setup):

Add your navidrome login info in the .env file.
The code assumes you are using pin 4 for the star/unstar button
The code assumes you are using a 20x4 I2C display

Instructions (hardware):

Using an arduino uno with usb connected to the computer running the node app.
Using a generic 20x4 LCD with the backpack (a5, a4, grd, 5v pins in arduino)
Using a Sanwa arcade button connected directly to digital pin 4 and the other grd pin on the Arduino.

This should get you up and running. If you need to make some tweaks (changing the subsonic api version, changing the pins used on the arduino etc), you can start in the config file, but the defaults there should work.
