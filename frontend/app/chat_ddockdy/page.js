"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태
  const [isTTSActive, setIsTTSActive] = useState(false); // TTS 활성화 상태
  const [isVoiceListening, setIsVoiceListening] = useState(false); // 음성인식 상태
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // 첫 로딩 시 인사말 추가
    setMessages([{ sender: "bot", text: "안녕하세요! IM케어 AI보험설계사 똑디입니다. 생명보험 무엇이 알고 싶으신가요??" }]);
  }, []);

  useEffect(() => {
    // 메시지가 추가될 때 스크롤을 맨 아래로 이동
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // TTS 활성화 시 봇 응답을 읽어줌
    if (isTTSActive && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.sender === "bot") {
        speak(latestMessage.text);
      }
    }
  }, [messages, isTTSActive]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR"; // 한국어 설정
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = () => {
    if (!input.trim()) return; // 빈 입력 방지

    setMessages((prev) => [...prev, { sender: "user", text: input }]); // 사용자 메시지 추가
    setInput(""); // 입력창 초기화
    setIsLoading(true); // 로딩 상태 활성화

    // 봇 응답 예제
    setTimeout(() => {
      const botResponse = "이건 예제 응답입니다.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botResponse },
      ]);
      setIsLoading(false); // 로딩 상태 비활성화
    }, 2000);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("음성 인식이 지원되지 않는 브라우저입니다.");
      return;
    }

    setIsVoiceListening(true); // 음성 인식 상태 활성화
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // 음성 인식 결과를 바로 메시지로 추가
      setMessages((prev) => [...prev, { sender: "user", text: transcript }]);

      // 봇 응답 예제
      setIsLoading(true); // 로딩 상태 활성화
      setTimeout(() => {
        const botResponse = "이건 음성 인식 응답입니다.";
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse },
        ]);
        setIsLoading(false); // 로딩 상태 비활성화
      }, 2000);
    };

    recognition.onend = () => {
      setIsVoiceListening(false); // 음성 인식 종료
    };

    recognition.onerror = () => {
      alert("음성 인식 중 오류가 발생했습니다.");
      setIsVoiceListening(false); // 음성 인식 종료
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTTS = () => {
    setIsTTSActive((prev) => !prev); // TTS 상태 토글
  };

  return (
    <div className={styles.chatContainer}>
      {isVoiceListening && (
        <div className={styles.voiceAnimation}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.bar}></div>
          ))}
        </div>
      )}
      <div className={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className={styles.loadingMessage}>
            <span>...</span>
          </div>
        )}
      </div>
      <div className={styles.buttonRow}>
        <button
          onClick={handleVoiceInput}
          className={styles.voiceButton}
          aria-label="음성인식"
        >
          🎤 음성인식
        </button>
        <button onClick={toggleTTS} className={styles.ttsButton}>
          {isTTSActive ? "🔊 TTS 끄기" : "🔇 TTS 켜기"}
        </button>
      </div>
      <div className={styles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="메시지를 입력하세요..."
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
}
