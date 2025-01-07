"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter(); // useRouter 초기화

  return (
    <div className={styles.homeContainer}>
      <div className={styles.card} onClick={() => router.push('/chat_home')}>
        <h2>보험설계</h2>
        <p>맞춤형 보험을 설계해 보세요.</p>
      </div>
      <div className={styles.card} onClick={() => router.push('/my_insurance')}>
        <h2>나의 보험관리</h2>
        <p>내 보험 현황을 관리해 보세요.</p>
      </div>
      <img className={styles.staticImage} src="/dgb_3d.png" alt="Static Icon"/>
    </div>
  );
}
