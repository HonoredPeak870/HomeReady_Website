import React from "react";
import { askHomeBuyingAssistant } from "../services/aiService";

export default function ChatBot({ plan }) {
  const [messages, setMessages] = React.useState([
    { role: "assistant", text: "I can recommend a buying plan, explain your readiness score, compare houses, define DTI or PMI, and show which change would make buying safer." },
  ]);
  const [question, setQuestion] = React.useState("");

  async function sendMessage(event, prompt = question) {
    event?.preventDefault();
    if (!prompt.trim()) return;
    const userMessage = { role: "user", text: prompt.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    const answer = await askHomeBuyingAssistant(userMessage.text, plan);
    setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
  }

  return (
    <section className="card chat-card">
      <span className="eyebrow">AI guide</span>
      <h2>Plan Assistant</h2>
      <div className="quick-prompts">
        {["Recommend a plan", "What is DTI?", "What is PMI?", "Which house is safest?", "How do I improve?", "What can I ask you?"].map((prompt) => (
          <button type="button" key={prompt} onClick={() => sendMessage(null, prompt)}>{prompt}</button>
        ))}
      </div>
      <div className="chat-log">
        {messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage(event);
            }
          }}
          placeholder="Ask if the payment is too much, what to improve, or why a house is risky."
          rows="3"
        />
        <button type="submit">Ask</button>
      </form>
    </section>
  );
}
