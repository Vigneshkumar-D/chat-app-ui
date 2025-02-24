// // Frontend WebSocket Integration with STOMP

// // Import STOMP from SockJS
// const socket = new SockJS('http://localhost:8080/ws');
// const stompClient = Stomp.over(socket);

// // Connect and Subscribe to Topics
// stompClient.connect({}, (frame) => {
//   console.log('Connected: ' + frame);
  
//   // Subscribe to Public Chat
//   stompClient.subscribe('/topic/public', (message) => {
//     console.log('Public Message:', JSON.parse(message.body));
//   });
  
//   // Subscribe to Private Messages
//   stompClient.subscribe('/user/queue/reply', (message) => {
//     console.log('Private Message:', JSON.parse(message.body));
//   });
// });

// // Send Public Message
// function sendPublicMessage(content) {
//   stompClient.send('/app/chat.sendMessage', {}, JSON.stringify({
//     content: content,
//   }));
// }

// // Send Private Message
// function sendPrivateMessage(content, recipient) {
//   stompClient.send('/app/chat.privateMessage', {}, JSON.stringify({
//     content: content,
//     recipient: recipient,
//   }));
// }
