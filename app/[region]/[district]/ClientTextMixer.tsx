"use client";

import { useMemo } from "react";

// 샵 상세페이지 전용: 자연스러운 조합형 수식어 세트
const SHOP_PATTERNS = [
  "출장 힐링 테라피 & 1:1 맞춤 바디 케어 안내",
  "출장 아로마 케어 & 프라이빗 바디 릴렉스",
  "출장 타이 릴렉싱 전문 프로그램",
  "출장 스웨디시 감성 케어 & 딥 릴렉스",
  "출장 방문 힐링 솔루션 & 정찰제 코스 안내"
];

export default function ShopTextMixer({ locationText }: { locationText: string }) {
  // 깜빡임(FOUC) 및 불필요한 useEffect 없이 지역명 기반으로 고유 문구 즉시 산출
  const keywordText = useMemo(() => {
    if (!locationText) return SHOP_PATTERNS[0];
    const index =
      Math.abs(
        locationText
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % SHOP_PATTERNS.length;
    return `${locationText} ${SHOP_PATTERNS[index]}`;
  }, [locationText]);

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center">
      <p className="text-xs md:text-sm font-bold text-amber-300">
        ✨ {keywordText}
      </p>
    </div>
  );
}