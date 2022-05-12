import React, { useState, useEffect } from 'react'
import './App.css'
import io from 'socket.io-client'

// connect socket
const socket = io.connect('https://tyreecks-chatapp.herokuapp.com')

function App() {

  // state for app

  // room
  const [room, setRoom] = useState('')

  // join room 
  const joinRoom = async (e) => {
    e.preventDefault()

    // join room 
    await socket.emit('join_room', room)

    // scroll to chat window
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
    
  }

  // name
  const [name, setName] = useState('')

  // messages
  const [messages, setMessages] = useState([])

  // message to send
  const [message, setMessage] = useState('')

  // message styles
  const yourMessage = 'p-1 bg-primary text-white rounded-3 mx-3 mt-3'
  const theirMessage = 'p-1 bg-info rounded-3 mx-3'

  // send message
  const sendMessage = async (e) => {
    e.preventDefault()
    const data = {
      message,
      name,
      room
    }
    // send data to back
    await socket.emit('message', data)
    // update messages array
    setMessages([...messages, data])
    setMessage('')
  }

  // listen for messages
  useEffect(() => {
      // recieved message event from backend
      socket.on('recieve_message', (data) => {
        // update messages array
        setMessages([...messages, data])
      })
  }, [messages] )


  return (
    <div className="App">
      <div style={{height: '100vh'}} className='d-flex justify-content-center align-items-center'>
        <div style={{height: '300px', width: '250px'}}className='d-flex flex-column justify-content-around align-items-center'>
            <h1>Join A Room</h1>
            <form style={{height: '50%'}}className='d-flex flex-column justify-content-around'>
                <input 
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  className='p-1 bg-secondary bg-opacity-25 border-0 rounded-3'
                  placeholder='Room Name'
                />
                <input
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className='p-1 bg-secondary bg-opacity-25 border-0 rounded-3'
                  placeholder='Your Name'
                />
                <button
                  className='p-2 bg-primary rounded-3 text-white border-0'
                  onClick={joinRoom}
                >Join!</button>
            </form>
        </div>
      </div>
      <div style={{height: '100vh'}} className='d-flex justify-content-center align-items-center'>
        <div style={{width: '350px'}}>
          <div style={{height: '550px'}}className='border border-5 border-secondary rounded overflow-auto d-flex flex-column'>
            {
              messages.map((message, idx) => {
            
                return(
                  <div className={message.name === name ? 'align-self-end' : 'align-self-start'} key={idx}>
                    <div className={message.name === name ? yourMessage : theirMessage}>
                      <h4>{message.message}</h4>
                    </div>
                    <p className='mx-3'>{message.name}</p>
                  </div>
                )
              })
            }
          </div>
          <div>
          <form className='d-flex'>
                <input 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{width: '100%'}}
                  className='p-1 bg-secondary bg-opacity-25 border-0 rounded-3'
                  placeholder='Type Your Message'
                />
                <button
                  className='p-2 bg-danger rounded-3 text-white border-0'
                  onClick={sendMessage}
                >Send!</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
