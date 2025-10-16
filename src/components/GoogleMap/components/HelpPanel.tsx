import { useState } from 'react';
import * as styles from './HelpPanel.css';

export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.toggleIcon}>{isOpen ? '▼' : '▲'}</span>
        <span className={styles.toggleText}>
          {isOpen ? '도움말 닫기' : '💡 도움말 보기'}
        </span>
      </button>

      {isOpen && (
        <div className={styles.content}>
          <h3 className={styles.title}>💡 사용 가능한 기능</h3>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>⌨️ 단축키</h4>
            <ul className={styles.list}>
              <li>
                <kbd className={styles.kbd}>Ctrl</kbd> 누르고 있기 - 경로 추적
                모드
              </li>
              <li>
                <kbd className={styles.kbd}>Shift</kbd> 누르고 있기 - 그리기
                모드
              </li>
              <li>
                <kbd className={styles.kbd}>마우스 좌클릭</kbd> - 마커 생성 /
                선택
              </li>
              <li>
                <kbd className={styles.kbd}>마우스 우클릭</kbd> - 마커 삭제 /
                그리기 초기화
              </li>
              <li>
                <kbd className={styles.kbd}>드래그</kbd> - 비디오 추가 / 선
                그리기
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>🎯 마커 관리</h4>
            <ul className={styles.list}>
              <li>지도 클릭 → 마커 생성</li>
              <li>마커 클릭 → 마커 정보 보기</li>
              <li>마커 우클릭 → 마커 삭제</li>
              <li>마커에 비디오 드래그 → 비디오 연결</li>
              <li>지도에 비디오 드롭 → 해당 위치에 마커 생성</li>
              <li>마커 정보창 → 메모 추가/수정</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>🛣️ 경로 추적 모드</h4>
            <ul className={styles.list}>
              <li>
                <kbd className={styles.kbd}>Ctrl</kbd> 누르고 마커 클릭 → 경로에
                추가
              </li>
              <li>
                <kbd className={styles.kbd}>Ctrl</kbd> 떼기 → 자동으로 경로 저장
              </li>
              <li>추적 모드 버튼 → 수동으로 모드 전환</li>
              <li>경로 목록에서 수정 → 기존 경로 편집</li>
              <li>경로 목록에서 삭제 → 경로 제거</li>
              <li>취소 버튼 → 현재 연결 취소</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>✏️ 그리기 모드</h4>
            <ul className={styles.list}>
              <li>상단 그리기 버튼 → 그리기 모드 전환</li>
              <li>마우스 드래그 → 자유롭게 선 그리기</li>
              <li>지도 우클릭 → 현재 그리기 완료</li>
              <li>그리기 모드에서는 마커 생성 비활성화</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>🔍 기타 기능</h4>
            <ul className={styles.list}>
              <li>상단 검색창 → 장소 검색 및 이동</li>
              <li>지도 확대/축소 → 마우스 휠 또는 버튼</li>
              <li>지도 이동 → 마우스 드래그</li>
              <li>비디오 목록 → 비디오 선택 및 미리보기</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
