export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`message-bubble ${isOwn ? "own" : "other"}`}>
      <div className="message-meta">
        <strong>{message.senderUsername}</strong>
        <span>{new Date(message.sentAt).toLocaleString()}</span>
      </div>
      <p>{message.body}</p>
    </div>
  );
}
