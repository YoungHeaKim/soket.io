// 메시지를 DOM에 표시하기 위한 함수
function appendText(messageListEl, text) {
  const messageEl = document.createElement('p')
  messageEl.textContent = text
  messageEl.classList.add('message')
  messageEl.classList.add('new') // 낙관적 업데이트를 하고 있다.
  messageListEl.insertBefore(messageEl, messageListEl.firstChild)
  return messageEl
}

// 메시지 양식
function formatMessage({username, message}) {
  return `${username}: ${message}`
}

document.addEventListener('DOMContentLoaded', e => {
  let username;

  // 사용할 엘리먼트 가져오기
  const formEl = document.querySelector('#chat-form')
  const messageListEl = document.querySelector('#messages')
  const roomId = formEl.dataset.room

  // socket.io 연결 수립하고 room 설정, username 설정
  socket = io('/chat')

  socket.emit('join', {id: roomId}, data => {
    username = data.username;
  })

  // form 전송 이벤트 핸들러
  formEl.addEventListener('submit', e => {
    e.preventDefault()
    // chat.pug에서 input#message.form-control(type="text", required)부분에 들어오는 값을 바로 불러온다.
    const message = formEl.elements.message.value
    const messageEl = appendText(messageListEl, formatMessage({username, message}))
    socket.emit('new chat', {message}, data => {
      //메세지 전송이 잘 되었다는 표시를 해주면 됨(자기만 new가 지워진다.)
      messageEl.classList.remove('new')
    })
    // form에 있는 값을 초기화 시킨다.
    formEl.reset()
  })


  // (chat) 채팅 메시지가 올 때마다 출력
  socket.on('chat', data => {
    const messageEl = appendText(messageListEl, formatMessage(data))
    // 상대편의 체팅에서도 스르륵 나타나는 효과를 준다.
    setTimeout(() => {
      messageEl.classList.remove('new')
    })
  })

  // (user connected) 새 사용자가 접속한 사실을 출력
  socket.on('user connected', data => {
    appendText(messageListEl, `${data.username} 님이 접속하셨습니다.`)
  })

  // (user disconnected) 사용자의 연결이 끊어졌다는 사실을 출력
  socket.on('user disconnected', data => {
    appendText(messageListEl, `${data.username} 님의 접속이 끊기셨습니다.`)
  })

})
