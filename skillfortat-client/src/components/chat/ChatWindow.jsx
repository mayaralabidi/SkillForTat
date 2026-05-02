import { useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ title, messages, currentUserId, onSend }) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!body.trim()) {
      return;
    }

    setSending(true);
    try {
      await onSend(body);
      setBody("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="panel chat-panel">
      <div className="chat-header">
        <div>
          <p className="eyebrow">Conversation</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="chat-thread">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
      </div>

      <form className="chat-compose" onSubmit={handleSubmit}>
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="button button-primary"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}
