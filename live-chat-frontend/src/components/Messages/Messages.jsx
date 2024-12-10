/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import Message from "../Message/Message";
import "./Messages.css";

export default function Messages({ messages, username }) {
  const [processedMessages, setProcessedMessages] = useState([]);
  const [userColors, setUserColors] = useState(new Map());;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const processedMessages = processMessages(messages);
    processedMessages.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    setProcessedMessages(processedMessages);
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [processedMessages]);

  /**
   * Returns a color for a given username.
   * Generates a new random color if the username doesn't have one.
   *
   * @param {string} username - The username to get the color for.
   * @returns {string} - The color in hexadecimal format.
   */
  const getRandomColor = (username) => {
    if (!userColors.has(username)) {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      userColors.set(username, color);
      setUserColors(new Map(userColors));
    }
    return userColors.get(username);
  };

  /**
   * Adds sender information and a random color to each message.
   *
   * @param {Array} messageList - The list of messages to process.
   * @returns {Array} The processed list of messages.
   */
  function processMessages(messageList) {
    return messageList.map((item) => {
      if (item.username === username) {
        return {
          ...item,
          senderIsMe: true,
          color: getRandomColor(item.username),
        };
      } else {
        return {
          ...item,
          senderIsMe: false,
          color: getRandomColor(item.username),
        };
      }
    });
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="messages-container">
      {processedMessages &&
        processedMessages.map((message, index) => (
          <Message key={message._id || index} message={message} />
        ))}
      <div ref={messagesEndRef} />
    </section>
  );
}
