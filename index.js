var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var he = require('he')
connectedusers = {}

banned = ['79.95.239.217', '50.196.188.89']

// TrollBox Client
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html')
})
app.get('/figlet.js', function(req, res){
  res.sendFile(__dirname + '/ClientThings/figlet.js')
})
app.get('/he.js', function(req, res){
  res.sendFile(__dirname + '/ClientThings/he.js')
})
app.get('/suncalc.js', function(req, res){
  res.sendFile(__dirname + '/ClientThings/suncalc.js')
})
app.get('/zalgo.js', function(req, res){
  res.sendFile(__dirname + '/ClientThings/zalgo.js')
})
app.get('/c/libs/jquery.min.js', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/libs/jquery.min.js')
})
app.get('/sys/hotfix.css', function(req, res){
  res.sendFile(__dirname + '/ClientThings/sys/hotfix.css')
})
app.get('/trollbox/trollbox.css', function(req, res){
  res.sendFile(__dirname + '/ClientThings/trollbox.css')
})
app.get('/c/sys42.js', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys42.js')
})
app.get('/c/sys/skins/w93.css', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/skins/w93.css')
})
app.get('/c/sys42.css', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys42.css')
})
app.get('/fonts/3D-ASCII.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/3D-ASCII.flf')
})
app.get('/fonts/ANSI Shadow.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/ANSI Shadow.flf')
})
app.get('/fonts/Bloody.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/Bloody.flf')
})
app.get('/fonts/Calvin S.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/Calvin S.flf')
})
app.get('/fonts/Delta Corps Priest 1.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/Delta Corps Priest 1.flf')
})
app.get('/fonts/Electronic.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/Electronic.flf')
})
app.get('/fonts/Grafitti.flf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/fonts/Grafitti.flf')
})
app.get('/c/sys/fonts/px_sans_nouveaux/px_sans_nouveaux.ttf', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/fonts/px_sans_nouveaux.ttf')
})
app.get('/c/sys/fonts/px_sans_nouveaux/px_sans_nouveaux.woff', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/fonts/px_sans_nouveaux.woff')
})
app.get('/c/sys/fonts/tomo/tomo.woff2', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/fonts/tomo.woff2')
})
app.get('/c/sys/cursors/default.cur', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/cursors/default.cur')
})
app.get('/c/sys/cursors/pointer.cur', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/cursors/pointer.cur')
})
app.get('/c/sys/cursors/text.cur', function(req, res){
  res.sendFile(__dirname + '/ClientThings/c/sys/cursors/text.cur')
})
app.get('/code.js', function(req, res){
  res.sendFile(__dirname + '/code.js')
})
app.get('/socket.io/socket.io.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/socket.io/lib/client.js')
})
app.get('/socket.io/socket.io.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/socket.io/lib/client.js')
})
// End

// reload the trollbox to use the code again
function toBase64(txt) {
  return Buffer.from(txt).toString('base64')
}
function genHomes(ip) {
  home = ip.split('.')
  home2 = home[0].charAt(home[0].length - 1)+home[1].charAt(home[1].length - 1)+home[2].charAt(home[2].length - 1)+home[3].charAt(home[3].length - 1)
  return toBase64(home2)
}

io.on("connection", function (client) {
  // io.sockets[client.id]
  console.log(client.id)
  var userip = client.handshake.headers['x-forwarded-for'].split(',')[0];
  client.on('user joined', function( user, color, pass, style) {
    if (banned.includes(userip)) {client.emit('message', {msg: 'You Are a Banned', nick: 'SYSTEM', home: 'local', color: 'lime'})} else {
      console.log('User: ' + user + ' From: ' + userip)
    // Sends Socket To all Users
    client.broadcast.emit('user joined', {nick: user, home: genHomes(userip), color: color})
    // Register The Connection In The Server
    connectedusers[client.id] = {nick: he.encode(user), home: genHomes(userip), color: color, style: ''}
    // Register Message Send
    client.on('message', function(msg) {
      console.log(msg)

      client.broadcast.emit('message', {date: Date.now(),   nick: user, color: color, style: '', home: genHomes(userip), msg: msg})
      client.emit('message', {date: Date.now(),   nick: user, color: color, style: '', home: genHomes(userip), msg: msg})
    
      
    })}
    client.on('disconnect', function(){
    // Remove User Register
    delete connectedusers[client.id]
    // Emit The Event To Everyone
    client.broadcast.emit('user left', {home: genHomes(userip), nick: user})
    // Update User List
    // client.emit('update users', connectedusers)
    client.broadcast.emit('update users', connectedusers)
    client.emit('update users', connectedusers)
  })
    // Update User List
    client.broadcast.emit('update users', connectedusers)
    client.emit('update users', connectedusers)
  })
  /* client.on('user left', function(nick) {
    // Remove User Register
    delete connectedusers[client.id]
    // Emit The Event To Everyone
    socket.emit('user left', {home: genHomes(userip), nick: nick})
    // Update User List
    client.emit('update users', connectedusers)
  }) */
  
    // connectedusers[connectedusers.length] = {nick: user, home: home}
  })
  
  /* official generation:
  color: "The color"
date: 0000000000000
home: "The home"
msg: "The message"
nick: "nick"
style: "leave blank"
  */
  /* Our generation:
  color: "color"
home: "4 digit home"
msg: "message"
nick: "the nick"
style: "leave blank, not needed"
time: 0
  */

http.listen(3000, function(){
console.log('listening on port 3000');
});