"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown"; // react-markdown 추가
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
    setMessages([{ sender: "bot", text: "안녕하세요! IM케어 AI보험설계사 똑디입니다. 생명보험 무엇이 궁금하신가요?" }]);
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

  const handleSend = async () => {
    if (!input.trim()) return; // 빈 입력 방지

    const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL;
    const ddockdyEnd = process.env.NEXT_PUBLIC_DDOCKDY_END;
    const ddockdyPort = process.env.NEXT_PUBLIC_DDOCKDY_PORT;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]); // 사용자 메시지 추가
    setInput(""); // 입력창 초기화
    setIsLoading(true); // 로딩 상태 활성화

    try {
      // POST 요청
      const response = await fetch(`${chatUrl}:${ddockdyPort}/${ddockdyEnd}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }), // 사용자 메시지 전송
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      const data = await response.json(); // 서버 응답 JSON 파싱
      const botResponse = data.result; // 응답에서 'answer' 필드 추출

      // 봇 응답 추가
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };


  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("음성 인식이 지원되지 않는 브라우저입니다.");
      return;
    }

    const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL;
    const ddockdyEnd = process.env.NEXT_PUBLIC_DDOCKDY_END;
    const ddockdyPort = process.env.NEXT_PUBLIC_DDOCKDY_PORT;

    setIsVoiceListening(true); // 음성 인식 상태 활성화

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ko-KR"; // 한국어 설정
    recognition.start(); // 음성 인식 시작



    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript; // 음성 결과 텍스트 추출

      // 음성 인식 결과를 사용자 메시지로 추가
      setMessages((prev) => [...prev, { sender: "user", text: transcript }]);
      setIsLoading(true); // 로딩 상태 활성화

      try {
        // POST 요청
        const response = await fetch(`${chatUrl}:${ddockdyPort}/${ddockdyEnd}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: transcript }), // 음성 메시지 전송
        });

        if (!response.ok) {
          throw new Error("서버 응답 오류");
        }

        const data = await response.json(); // 서버 응답 JSON 파싱
        const botResponse = data.result; // 응답에서 'answer' 필드 추출

        // 봇 응답 추가
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse },
        ]);
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." },
        ]);
      } finally {
        setIsLoading(false); // 로딩 상태 비활성화
      }
    };

    recognition.onend = () => {
      setIsVoiceListening(false); // 음성 인식 종료
    };

    recognition.onerror = (error) => {
      console.error("음성 인식 오류:", error);
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
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown> // 마크다운 적용
            ) : (
              msg.text
            )}
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
