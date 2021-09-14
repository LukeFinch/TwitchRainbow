const tmi = require('tmi.js');
require('dotenv').config()
const incr = process.env.INCREMENT

console.log(process.env)

// Define configuration options
const opts = {
  options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
  identity: {
    username: process.env.USERNAME,
    password: process.env.AUTH
  },
  channels: [
    '#'+process.env.CHANNEL
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();


// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {

  if (context.username == opts.identity.username) {
    let h = HexToHSL(context.color).h
    console.log(h)
    changeColor(h)

  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function changeColor(hue){
  hue += incr
  hex = HSLToHex(hue,100,50)
  console.log(hex)
  client.say(opts.channels[0], `/color ${hex}`).then(function(data) {
    console.log(data)
}).catch(function(err) {
    //
});
}




function HSLToHex(hue,s,l) {
  h = hue % 360
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

function HexToHSL(hex){

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
    
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
    
        s = s*100;
        s = Math.round(s);
        l = l*100;
        l = Math.round(l);
    return {'h': Math.round(h*360), 's':s, 'l':l }
}