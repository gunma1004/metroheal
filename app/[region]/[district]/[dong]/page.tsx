"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
    dong: string;
  }>;
}

// 🌐 영문 시/도 코드를 한글명으로 변환
function getRegionFullName(region: string): string {
  switch (region?.toLowerCase()) {
    case "seoul": return "서울특별시";
    case "gyeonggi": return "경기도";
    case "incheon": return "인천광역시";
    default: return region || "";
  }
}

function getRegionShortName(region: string): string {
  switch (region?.toLowerCase()) {
    case "seoul": return "서울";
    case "gyeonggi": return "경기";
    case "incheon": return "인천";
    default: return region || "";
  }
}

// 🛠️ 이중 디코딩 방어 함수 (한글 깨짐 및 404 방지)
function safeDecode(str: string): string {
  if (!str) return "";
  let decoded = str;
  try {
    decoded = decodeURIComponent(decodeURIComponent(str));
  } catch {
    try {
      decoded = decodeURIComponent(str);
    } catch {
      decoded = str;
    }
  }
  return decoded.trim();
}

// 🌟 1,000개 이상의 다채로운 조합을 만들기 위한 SEO 패턴 풀 (순차적 순환 구조)
const TITLE_PREFIXES = [
  "프리미엄 웰니스 마사지", "정통 스웨디시 마사지", "아로마 힐링 마사지", 
  "딥티슈 바디 마사지", "릴렉싱 건식 마사지", "맞춤형 바디케어 마사지", 
  "피로회복 전문 마사지", "프라이빗 힐링 마사지", "오일 순환 케어 마사지"
];

const DESC_MODIFIERS = [
  "지친 일상을 위한 특별한 방문 테라피", "전문가의 섬세한 손길이 닿는 홈케어", 
  "나만의 공간에서 누리는 완벽한 휴식", "쌓인 피로를 말끔히 풀어주는 전문 케어", 
  "일상에 활력을 불어넣는 프라이빗 힐링", "엄선된 제휴 샵의 고품격 바디 프로그램"
];

const DESC_TARGETS = [
  "직장인 맞춤형 힐링 코스", "1:1 집중 피로회복 솔루션", "지친 근육 이완 프로그램", 
  "전신 밸런스 웰니스 케어", "편안한 숙면 유도 테라피"
];

export default function DongDetailPage({ params }: PageProps) {
  // Next.js App Router 비동기 params 처리
  const [resolvedParams, setResolvedParams] = useState<{ region: string; district: string; dong: string } | null>(null);
  
  // 샵 리스트 상태 (새로고침 시 순서 섞임)
  const [shops, setShops] = useState([
    {
      id: 1,
      name: "한국미녀테라피",
      desc: "지친 일상에 맞춤형 활력 충전! 전문 테라피스트의 정성 어린 감성 바디 테라피",
      phone: "0507-1280-3299",
      price: "110,000원부터~",
      image: "/shop1.jpg"
    },
    {
      id: 2,
      name: "오늘밤테라피",
      desc: "최고급 천연 아로마 오일을 활용한 전신 이완 및 림프 순환 케어 전문 프로그램",
      phone: "0507-1280-3191",
      price: "60,000원부터~",
      image: "/shop2.jpg"
    },
    {
      id: 3,
      name: "주주홈타이",
      desc: "재방문율 높은 안심 케어! 철저한 위생 관리와 품격 있는 정통 타이 & 릴렉싱",
      phone: "0507-1280-3180",
      price: "60,000원부터~",
      image: "/shop3.jpg"
    },
    {
      id: 4,
      name: "한국골든테라피",
      desc: "전문 힐러진의 맞춤형 바디 관리, 시간대별 편안한 VIP 피로회복 솔루션",
      phone: "0507-1280-3361",
      price: "60,000원부터~",
      image: "/shop4.jpg"
    },
    {
      id: 5,
      name: "퀸즈홈테라피",
      desc: "수도권 전지역 엄선된 파트너! 정직한 안내와 함께하는 프라이빗 힐링 테라피",
      phone: "0507-1280-3222",
      price: "60,000원부터~",
      image: "/shop5.jpg"
    }
  ]);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));

    // 페이지 진입/새로고침 시 Fisher-Yates Shuffle 알고리즘으로 샵 순서 랜덤 변경
    setShops((prevShops) => {
      const shuffled = [...prevShops];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, [params]);

  if (!resolvedParams) {
    return <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center">로딩 중...</div>;
  }

  const { region, district, dong } = resolvedParams;
  const regionFullName = getRegionFullName(region);
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const fullLocation = `${regionFullName} ${districtName} ${dongName}`;
  const shortLocation = `${districtName} ${dongName}`;

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-24">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3.5 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                메트로힐
              </span>
              <span className="text-[9px] text-gray-400 tracking-tighter">METRO HEAL DONG GUIDE</span>
            </div>
          </Link>
          <Link 
            href={`/${region}/${encodeURIComponent(districtName)}`}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
          >
            ← {districtName} 전체보기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* 타이틀 배너 */}
        <section className="bg-[#141418] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-lg">
          <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
            {districtName} · {dongName} WELLNESS DIRECTORY
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            📍 {shortLocation} 마사지 안내
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-2">
            {fullLocation} 고객님을 위한 힐링 바디케어 디렉토리입니다. 정직한 정찰제 요금표와 코스를 확인하세요.
          </p>
        </section>

        {/* 🌟 샵 리스트 (새로고침 시 순서 랜덤 변경, 누르면 /region/district/dong/shop/id 로 이동) */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-amber-400 tracking-wider uppercase">
            🏆 {shortLocation} 추천 제휴점
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops.map((shop) => (
              <div 
                key={shop.id} 
                className="bg-[#111114] border border-amber-500/20 hover:border-amber-500/60 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative"
              >
                {/* 🌟 동 기준 샵 상세 링크 */}
                <Link 
                  href={`/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}/shop/${shop.id}`}
                  className="absolute inset-0 z-10" 
                  aria-label={`${shop.name} (${dongName}) 코스 및 상세정보 보기`} 
                />

                <img 
                  src={shop.image} 
                  alt={`${shop.name} ${dongName}`} 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 flex-shrink-0" 
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {shop.name} <span className="text-xs font-normal text-gray-400">({dongName})</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                    {shop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">{shop.price}</span>
                    <a 
                      href={`tel:${shop.phone.replace(/-/g, "")}`} 
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow relative z-20"
                    >
                      전화연결
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}