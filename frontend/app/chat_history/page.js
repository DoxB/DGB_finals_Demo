"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter(); // useRouter 초기화

  return (
    <div className={styles.homeContainer}>
      <div className={styles.card} onClick={() => router.push('/chat_dandy')}>
        <img src="dandy.png" alt="dandy" />
        <h3>상해보험 상담중 . . .</h3>
      </div>
      <div className={styles.card} onClick={() => router.push('/chat_ddockdy')}>
        <img src="ddockdy.png" alt="ddockdy" />
        <h3>생명보험 상담중 . . .</h3>
      </div>
      <div className={styles.card} onClick={() => router.push('/chat_woudy')}>
        <img src="woudy.png" alt="woudy" />
        <div className={styles.text}>
          <h3>암보험 상담중 . . .</h3>
        </div>
      </div>
      <img className={styles.staticImage} src="/dgb_3d.png" alt="Static Icon"/>
    </div>
  );
}
