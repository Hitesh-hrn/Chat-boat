
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userText = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://chat-boat-production-776f.up.railway.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userText,
          }),
        });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Bubu 😭 server se connection nahi ho raha...",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">

      {/* Background decoration */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="chat-wrapper">

        {/* HEADER */}
        <header className="header">

          <div className="back">
            ←
          </div>

          <div className="profile-image">
            A
          </div>

          <div className="profile-info">
            <h2>Anjali ❤️</h2>

            <div className="status">
              <span></span>
              Online
            </div>
          </div>

          <div className="header-actions">
            <button>☎</button>

            <button onClick={clearChat}>
              ⋮
            </button>
          </div>

        </header>


        {/* CHAT */}
        <main className="chat-area">

          <div className="date">
            <span>Today</span>
          </div>

          {messages.length === 0 && (
            <div className="welcome">

              <div className="welcome-image">
                A
              </div>

              <h1>Hi Bubu ❤️</h1>

              <p>
                Anjali is online and waiting for you...
              </p>

              <div className="suggestions">

                <button
                  onClick={() =>
                    setMessage("Kya kar rahi ho babu? ❤️")
                  }
                >
                  Kya kar rahi ho? ❤️
                </button>

                <button
                  onClick={() =>
                    setMessage("Mujhe miss kiya? 😏")
                  }
                >
                  Mujhe miss kiya? 😏
                </button>

                <button
                  onClick={() =>
                    setMessage("Aaj ka din kaisa tha?")
                  }
                >
                  Aaj ka din kaisa tha?
                </button>

              </div>

            </div>
          )}


          {messages.map((msg, index) => (

            <div
              key={index}
              className={`message-row ${msg.role === "user" ? "user-row" : "bot-row"
                }`}
            >

              {msg.role === "model" && (
                <div className="small-avatar">
                  A
                </div>
              )}

              <div
                className={`message ${msg.role === "user"
                    ? "user-message"
                    : "bot-message"
                  }`}
              >

                <p>{msg.text}</p>

                <div className="message-time">
                  {msg.time}

                  {msg.role === "user" && (
                    <span className="seen">
                      ✓✓
                    </span>
                  )}
                </div>

              </div>

            </div>

          ))}


          {/* TYPING */}
          {loading && (
            <div className="message-row bot-row">

              <div className="small-avatar">
                A
              </div>

              <div className="typing">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>
          )}

          <div ref={chatEndRef}></div>

        </main>


        {/* INPUT */}
        <footer className="input-container">

          <button className="icon-button">
            +
          </button>

          <div className="input-box">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Anjali..."
              rows="1"
            />

            <button className="emoji-button">
              😊
            </button>

          </div>

          {message.trim() ? (
            <button
              className="send-button"
              onClick={sendMessage}
            >
              ➤
            </button>
          ) : (
            <button className="mic-button">
              🎙
            </button>
          )}

        </footer>

      </div>

    </div>
  );
}

export default App;
