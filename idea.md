Milestone 1: UI for Joining Room

     Landing page with:

        Create Room button → generates a unique room code (e.g., 6H8KZ)

        Join Room form → input for room code

     Basic validations (e.g., empty room code, invalid format)


Milestone 3: Room Logic (Socket.io)

     On "create", backend stores/acknowledges room code

     On "join", client emits room code to backend

     Backend adds user socket to the correct room using socket.join(roomCode)

     If room doesn't exist, send error


Milestone 4: Basic Chat

     Text input + Send button

     Display chat history in room

     Users in the same room see each other’s messages in real-time

     Show sender name (can be asked before joining)


Milestone 5: Chat Interface Enhancements

     Auto-scroll to latest message

     Differentiate messages by sender

     Timestamp for each message

     Show room code somewhere on screen


Milestone 6: Extra Goodies

    Typing indicator (user is typing...)

    Sound notification on new message

    Temporary display names (on join)

    Light/dark mode toggle

    Emoji picker

