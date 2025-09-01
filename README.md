# Realm Chat 💬⚡

**Realm Chat** is an open-source, real-time encrypted chat application where users can create private **realms** (chat rooms) and communicate securely. Built with modern web technologies, it features end-to-end encryption, real-time messaging, and a clean, responsive interface.

## ✨ Features

- **🔐 End-to-End Encryption** - Messages are encrypted using AES-256 encryption with realm-specific keys
- **🏰 Create Realms** - Generate unique 6-character realm codes for private chat rooms
- **👥 Join Realms** - Enter realm codes to join existing conversations
- **⚡ Real-time Messaging** - Instant message delivery powered by Socket.IO
- **📱 Responsive Design** - Modern UI built with Tailwind CSS and Radix UI components
- **🔄 Auto-cleanup** - Inactive realms are automatically removed after 10 hours
- **📋 Copy to Clipboard** - Easy realm code sharing with one-click copying
- **🎨 Dark/Light Theme** - Built-in theme switching with next-themes
- **📊 User Count** - Real-time participant tracking in each realm

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks and concurrent features
- **Vite 7** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Socket.IO Client** - Real-time communication
- **CryptoJS** - Client-side encryption/decryption
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **next-themes** - Theme management

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Socket.IO 4** - Real-time bidirectional communication
- **HTTP Server** - Native Node.js HTTP server

### Development Tools
- **ESLint 9** - Code linting and formatting
- **Nodemon** - Development server with auto-restart
- **TypeScript Config** - Type checking support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/realm-chat.git
   cd realm-chat
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the client directory:
   ```env
   VITE_LOCAL_SOCKET_URL=http://localhost:8080
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev  # Development mode with auto-restart
   # or
   npm start    # Production mode
   ```
   
   The server will run on `http://localhost:8080`

2. **Start the frontend client**
   ```bash
   cd client
   npm run dev
   ```
   
   The client will run on `http://localhost:5173`

3. **Open your browser**
   
   Navigate to `http://localhost:5173` to use the application

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Serve the built files**
   ```bash
   npm run preview
   ```

## 🔐 Security Features

### Encryption Implementation
- **AES-256 Encryption** - Military-grade encryption algorithm
- **Realm-specific Keys** - Each realm uses a unique encryption key
- **Client-side Encryption** - Messages are encrypted before transmission
- **Secure Key Derivation** - Keys are derived from realm codes

### Message Security
- Messages are encrypted on the client before sending to the server
- Server cannot read message contents (only encrypted data)
- Decryption happens only on authorized client devices
- Each realm maintains its own encryption context

## 📡 API & Socket Events

### Client to Server Events
- `create-realm` - Create a new chat realm
- `join-realm` - Join an existing realm with code
- `send-message` - Send an encrypted message to a realm
- `disconnect` - Handle client disconnection

### Server to Client Events
- `realm-created` - Confirm realm creation with code
- `realm-joined` - Confirm successful realm join
- `user-joined` - Notify when new user joins
- `user-left` - Notify when user leaves
- `new-message` - Deliver new encrypted messages
- `error` - Handle error conditions

## 🏗️ Architecture

### Frontend Architecture
- **Component-based Structure** - Modular React components
- **Custom Hooks** - Reusable logic (textarea resize, etc.)
- **State Management** - React useState for local state
- **Effect Management** - Proper cleanup and lifecycle management

### Backend Architecture
- **Event-driven Communication** - Socket.IO event handling
- **In-memory Storage** - Real-time realm and message storage
- **Auto-cleanup System** - Automatic removal of inactive realms
- **CORS Configuration** - Secure cross-origin communication

### Data Flow
1. User creates/joins a realm
2. Client establishes Socket.IO connection
3. Messages are encrypted client-side
4. Encrypted data transmitted via WebSocket
5. Server broadcasts to all realm participants
6. Clients decrypt and display messages

## 🔧 Configuration

### Server Configuration
- **Port**: Configurable via `PORT` environment variable (default: 8080)
- **CORS**: Configured for development and production origins
- **Auto-cleanup**: Inactive realms removed after 10 hours

### Client Configuration
- **Socket URL**: Environment-based configuration
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS with custom component library

### Environment Variables
```env
# Production
VITE_LOCAL_SOCKET_URL=https://your-backend-url.com

# Development
VITE_LOCAL_SOCKET_URL=http://localhost:8080
```

## 🧪 Development

### Available Scripts

#### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Server
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```
## 🤝 Contributing

We welcome contributions to Realm Chat! Here's how you can help:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all linting checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2024 Swaroop Acharya**

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/realm-chat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/realm-chat/discussions)

---

**⚡ Build your own encrypted realms and chat securely!**

*Made with ❤️ by Swaroop Acharya*
