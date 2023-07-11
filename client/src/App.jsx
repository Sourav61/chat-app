import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'

let socket;
const CONNECTION_PORT = 'localhost:3001/'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [room, setRoom] = useState("")
  const [userName, setUserName] = useState("")

  const [messageInput, setMessageInput] = useState("")
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    socket = io(CONNECTION_PORT, { transports: ['websocket'] })
  }, [CONNECTION_PORT])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data])
    })
  }, [])


  const connectToRoom = () => {
    setLoggedIn(true)
    socket.emit('join_room', room)
  }

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: messageInput
      }
    }

    await socket.emit("send_message", messageContent)
    setMessageList([...messageList, messageContent.content])
    setMessageInput("")
  }

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="login">
          <div className="inputs">
            <input
              type="text"
              placeholder='Name...'
              className='loginName'
              onChange={(e) => (setUserName(e?.target?.value))}
            />
            <input
              type="text"
              placeholder='Room...'
              className='loginRoom'
              onChange={(e) => (setRoom(e?.target?.value))}
            />
          </div>
          <button className="enterRoom" onClick={() => connectToRoom()}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, key) => {
              return (
                <div className="messageContainer" key={key} id={val?.author == userName ? "You" : "Other"}>
                  <div className="messageItem">
                    {val.author}: {val.message}
                  </div>
                  {/* <h1>
                    {val?.author}
                  </h1> */}
                </div>
              )
            })}
          </div>
          <div className="messageInputs">
            <input type="text" placeholder='Message...' className="inputMsg"
              onChange={(e) => {
                setMessageInput(e?.target?.value)
              }} value={messageInput} />
            <button onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
