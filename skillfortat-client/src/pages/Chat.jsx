import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ChatWindow from "../components/chat/ChatWindow";
import useAuthStore from "../store/authStore";
import useMatchStore from "../store/matchStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function Chat() {
  const { matchId } = useParams();
  const socketRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const matches = useMatchStore((state) => state.matches);
  const messages = useMatchStore(
    (state) => state.messagesByMatch[matchId] || [],
  );
  const fetchMatches = useMatchStore((state) => state.fetchMatches);
  const fetchMessages = useMatchStore((state) => state.fetchMessages);
  const appendMessage = useMatchStore((state) => state.appendMessage);

  const match = useMemo(
    () => matches.find((item) => item.id === matchId),
    [matches, matchId],
  );

  useEffect(() => {
    fetchMatches();
    fetchMessages(matchId);
  }, [fetchMessages, fetchMatches, matchId]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("join_match", { matchId });
    socket.on("message:new", (message) => {
      if (message.matchId === matchId) {
        appendMessage(matchId, message);
      }
    });

    return () => {
      socket.emit("leave_match", { matchId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appendMessage, matchId]);

  const handleSend = async (body) => {
    await new Promise((resolve) => {
      socketRef.current?.emit(
        "send_message",
        { matchId, senderId: user?.id, body },
        () => {
          resolve();
        },
      );
    });
  };

  if (!match) {
    return (
      <div className="page-stack narrow">
        <section className="panel">
          <h1>Chat not loaded</h1>
          <p className="muted">
            Open a match from the matches page to start chatting.
          </p>
        </section>
      </div>
    );
  }

  const title = `${match.offer_a_username} · ${match.offer_b_username}`;

  return (
    <div className="page-stack">
      <ChatWindow
        title={title}
        messages={messages}
        currentUserId={user?.id}
        onSend={handleSend}
      />
    </div>
  );
}
