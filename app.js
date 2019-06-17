const c=console.log,
 express=require('express'),
 app=express(),
 http=require('http').createServer(app),
 io=require('socket.io')(http),
 publicDir=express.static(`${__dirname}/public`)

 app
 .set('port', process.env.PORT ||3000)
 .use(publicDir)
 .get('/', (req,res)=>res.sendFile(`${publicDir}/index.html`))

 http.listen(app.get('port'), ()=>c(`Starting Chat on port ${app.get('port')}`))
 let connections=0

 io.on('connection', socket=>{
  //Show alert new user
  socket.broadcast.emit('newuser', {message: 'new user connected'})
  connections++
  //Show number of active connections
  socket.emit('newconnection', {connections})
  socket.broadcast.emit('newconnection', {connections})
  //Show typing...
  socket.on('typing', message=>socket.broadcast.emit('showtyping', {message}))
  //Cancel typing
  socket.on('notyping', ()=>socket.broadcast.emit('shownothing', {message:null}))
  //Emit new message
  socket.on('newmessage', message=>io.emit('usermessage', message))
  //Disconnect and decrese a connection
  socket.on('disconnect', ()=>{
   let message='An user left chat'
   connections--
   socket.broadcast.emit('byebye', {message})
   socket.broadcast.emit('newconnection', {connections})
   c(message, connections)
  })
 })