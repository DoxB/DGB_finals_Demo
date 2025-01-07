"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function MyInsurance() {
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const insuranceList = [
    { id: 1, name: "당당한 인생 종신보험", startDate: "2022-01-15", monthlyFee: "163,000원" },
    { id: 2, name: "IM프리미엄 건강보험", startDate: "2021-06-10", monthlyFee: "163,000원" },
    { id: 3, name: "든든한 인생 치매보험", startDate: "2023-03-25", monthlyFee: "163,000원" },
  ];

  const handleCardClick = (insurance) => {
    setSelectedInsurance(insurance); // 선택한 보험 정보 설정
  };

  const closeModal = () => {
    setSelectedInsurance(null); // 모달 닫기
  };

  return (
    <div className={styles.container}>
      {insuranceList.map((insurance) => (
        <div
          key={insurance.id}
          className={styles.card}
          onClick={() => handleCardClick(insurance)}
        >
          <div className={styles.left}>
            <h3>{insurance.name}</h3>
          </div>
          <div className={styles.right}>
            <p>{insurance.startDate}</p>
            <p>월 납입금: {insurance.monthlyFee}</p>
          </div>
        </div>
      ))}

      {selectedInsurance && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedInsurance.name}</h2>
            <p>시작 날짜: {selectedInsurance.startDate}</p>
            <p>월 납입금: {selectedInsurance.monthlyFee}</p>
            <button onClick={closeModal} className={styles.closeButton}>
              닫기
            </button>
          </div>
        </div>
      )}
      <img className={styles.staticImage} src="/dgb_3d.png" alt="Static Icon"/>
    </div>
  );
}
