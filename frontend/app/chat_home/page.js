"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter(); // useRouter 초기화

  return (
    <div className={styles.homeContainer}>
      <div className={styles.card} onClick={() => router.push('/chat_dandy')}>
        <img src="dandy.png" alt="dandy" />
        <h2>단디</h2>
        <p>MZ 세대에 맞춤형 보험을 추천해드려요.</p>
      </div>
      <div className={styles.card} onClick={() => router.push('/chat_ddockdy')}>
        <img src="ddockdy.png" alt="ddockdy" />
        <h2>똑디</h2>
        <p>생명보험이 궁금하시다면? 맡겨만주세요~</p>
      </div>
      <div className={styles.card} onClick={() => router.push('/chat_woudy')}>
        <img src="woudy.png" alt="woudy" />
        <div className={styles.text}>
          <h2>우디</h2>
          <p>암보험 상담은 여기!</p>
        </div>
      </div>
      <div className={styles.card} onClick={() => router.push('/chat_history')}>
        <img src="dgb_3.png" alt="dgb_3" />
        <h2>이전 상담내역</h2>
      </div>
      <img className={styles.staticImage} src="/dgb_3d.png" alt="Static Icon"/>
    </div>
  );
}
