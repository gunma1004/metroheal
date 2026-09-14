"use client";

import { useMemo } from "react";
import Link from "next/link";

interface ShopItem {
  id: number | string;
  name: string;
  desc: string;
  phone: string;
  price: string;
  image: string;
}

interface ClientTextMixerProps {
  region: string;
  district: string;
  shops?: ShopItem[];
}

// 🌟 구 페이지 전용: 스팸 키워드 배제 클린 웰니스 패턴 10종
const WELLNESS_PATTERNS = [
  "프리미엄 웰니스 마사지 & 바디케어 안내",
  "체계적인 힐링 테라피 & 맞춤 릴렉스 프로그램",
  "스웨디시 & 아로마 힐링 바디 테라피",
  "정통 타이마사지 & 전신 컨디셔닝 케어",
  "1:1 프라이빗 웰니스 가이드 & 정찰제 요금 안내",
  "지친 일상을 위한 감성 힐링 스웨디시 케어",
  "에센셜 오일 테라피 & 릴렉스 바디 순환",
  "베테랑 테라피스트의 정성스러운 웰니스 프로그램",
  "투명한 정찰제 안심 힐링 마사지 가이드",
  "쾌적한 휴식을 돕는 바디 밸런스 리셋 테라피"
];

// 기본 제휴점 데이터
const defaultShops: ShopItem[] = [
  { id: 1, name: "🔥 한국미녀테라피", desc: "굳은 근육을 부드럽게 이완하는 건식 타이 & 딥 릴렉스 전문 센터", phone: "0507-1280-3299", price: "110,000원부터~", image: "/shop1.jpg" },
  { id: 2, name: "✨ 오늘밤테라피", desc: "천연 에센셜 오일과 정교한 핸드 테크닉의 프리미엄 아로마 바디 순환 케어", phone: "0507-1280-3191", price: "60,000원부터~", image: "/shop2.jpg" },
  { id: 3, name: "💎 주주홈타이", desc: "타이와 아로마를 결합한 VIP 시그니처 힐링 프로그램", phone: "0507-1280-3180", price: "60,000원부터~", image: "/shop3.jpg" },
  { id: 4, name: "🌟 한국골든테라피", desc: "정직한 정찰제 운영과 편안한 힐링을 약속하는 감성 스웨디시", phone: "0507-1280-3361", price: "60,000원부터~", image: "/shop4.jpg" },
  { id: 5, name: "👑 퀸즈홈테라피", desc: "전문 테라피스트들의 1:1 맞춤형 VIP 피로회복 웰니스 케어", phone: "0507-1280-3222", price: "60,000원부터~", image: "/shop5.jpg" }
];

export default function ClientTextMixer({ region, district, shops = defaultShops }: ClientTextMixerProps) {
  const locationText = `${district}`.trim();

  // 깜빡임(FOUC) 없이 구 명칭 기반 고유 텍스트 생성
  const introText = useMemo(() => {
    if (!locationText) return WELLNESS_PATTERNS[0];
    const index =
      Math.abs(
        locationText
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % WELLNESS_PATTERNS.length;
    return `${locationText} ${WELLNESS_PATTERNS[index]}`;
  }, [locationText]);

  return (
    <div className="space-y-8">
      {/* 1. 구 단위 클린 키워드 배너 */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center shadow-inner">
        <p className="text-xs md:text-sm font-black text-amber-300 tracking-wide">
          ✨ {introText}
        </p>
      </div>

      {/* 2. 샵 카드 리스트 (클릭 시 /region/district/shop/id 로 이동) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-amber-400 tracking-wider uppercase">
            🏆 {locationText} 추천 제휴점 안내
          </h2>
          <span className="text-[11px] text-gray-500">표준 정찰제 제휴 센터</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-gradient-to-br from-[#161619] to-[#101013] border border-amber-500/25 hover:border-amber-400 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative"
            >
              {/* 🌟 핵심: /region/district/shop/[shopId] 이동 투명 오버레이 링크 */}
              <Link
                href={`/${region}/${encodeURIComponent(district)}/shop/${shop.id}`}
                className="absolute inset-0 z-10"
                aria-label={`${shop.name} 상세 코스 및 요금 보기`}
              />

              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                  {shop.name}
                </h3>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                  {shop.desc}
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">{shop.price}</span>
                  
                  {/* 전화 버튼 (z-20 설정으로 카드 링크와 분리) */}
                  <a
                    href={`tel:${shop.phone.replace(/-/g, "")}`}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow transition-all relative z-20"
                  >
                    전화연결
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}