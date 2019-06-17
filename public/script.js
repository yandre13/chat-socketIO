;
((d,io)=>{

 const chatForm=d.getElementById('chat-form'),
  chatMessage=d.getElementById('chat-message'),
  chat=d.getElementById('chat'),
  typing=d.getElementById('typing'),
  online=d.getElementById('online')
 let time,
  message='someone is typing...'
  //Event for typing
  chatMessage.addEventListener('keyup', ()=>{
   io.emit('typing', message)
   clearTimeout(time)
   time = setTimeout(()=>{
    typing.textContent=null
    io.emit('notyping', message)
   },1000)
  })
  //Event for new message
  chatForm.addEventListener('submit', e=>{
   e.preventDefault()
   io.emit('newmessage', chatMessage.value)
   chatMessage.value=null
   return false
  })
  //Show alert new connection
  io.on('newuser', newUser=>alert(newUser.message))
  //Show connections
  io.on('newconnection', newConnection=>online.textContent=newConnection.connections)
  //Show typing
  io.on('showtyping', message=>typing.textContent=message.message)
  //Cancel typing
  io.on('shownothing', data=>typing.textContent=data.message)
  //Insert new message
  io.on('usermessage', message=>chat.insertAdjacentHTML('beforeend', `<li>${message}</li>`))
  //Alert for bye
  io.on('byebye', byeBye=>alert(byeBye.message))
})(document,io())
;