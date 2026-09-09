import { Metadata } from "next";
import Link from "next/link";
import ClientTextMixer from "./ClientTextMixer";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
  }>;
  searchParams: Promise<{
    dong?: string;
  }>;
}

// -------------------------------------------------------------
// 🎯 샵 페이지와 겹치지 않는 40가지 클린 웰니스 SEO 패턴
// -------------------------------------------------------------
const SEO_PATTERNS = [
  /* 0 */ {
    title: (r: string) => `${r} 바디 테라피 & 프라이빗 힐링 케어 추천 - 메트로힐`,
    desc: (r: string) => `${r} 엄선된 전문 테라피 샵 정보. 편안한 휴식을 선사하는 맞춤 바디케어 코스와 이용 요금을 메트로힐에서 확인하세요.`
  },
  /* 1 */ {
    title: (r: string) => `${r} 스웨디시 테라피 & 감성 바디 릴렉스 가이드 | 메트로힐`,
    desc: (r: string) => `부드러운 압과 섬세한 터치로 전신 긴장을 이완시키는 ${r} 스웨디시 전문 샵 코스별 상세 비교 안내.`
  },
  /* 2 */ {
    title: (r: string) => `${r} 아로마 오일 테라피 힐링 추천 코스 - 메트로힐`,
    desc: (r: string) => `천연 에센셜 아로마 오일로 누적된 일상 피로와 스트레스를 편안하게 비워내는 ${r} 테라피 샵 모음.`
  },
  /* 3 */ {
    title: (r: string) => `${r} 정통 타이 릴렉싱 바디케어 프로그램 안내 | 메트로힐`,
    desc: (r: string) => `체계적인 전신 스트레칭과 지압으로 굳은 근육을 시원하게 풀어주는 ${r} 타이 테라피 제휴 정보.`
  },
  /* 4 */ {
    title: (r: string) => `${r} 프라이빗 웰니스 홈 테라피 큐레이션 - 메트로힐`,
    desc: (r: string) => `원하는 공간에서 편안하게 누리는 1:1 맞춤형 바디 트리트먼트. ${r} 프리미엄 힐링 가이드.`
  },
  /* 5 */ {
    title: (r: string) => `${r} 딥티슈 집중 릴렉스 케어 정보 - 메트로힐`,
    desc: (r: string) => `뭉친 어깨와 목, 허리의 속근육 피로를 섬세하게 풀어주는 ${r} 집중 바디 테라피 프로그램.`
  },
  /* 6 */ {
    title: (r: string) => `${r} 림프 순환 케어 & 에스테틱 바디 솔루션 | 메트로힐`,
    desc: (r: string) => `몸의 순환을 원활하게 돕고 붓기 완화에 집중한 ${r} 림프 테라피 코스 및 정찰제 안내.`
  },
  /* 7 */ {
    title: (r: string) => `${r} 24시 실시간 힐링 바디케어 제휴 샵 안내 - 메트로힐`,
    desc: (r: string) => `밤낮 구분 없이 지친 하루의 피로를 풀어주는 ${r} 안심 테라피 샵 정보 및 실시간 예약 안내.`
  },
  /* 8 */ {
    title: (r: string) => `${r} 릴렉스 바디 밸런스 트리트먼트 가이드 | 메트로힐`,
    desc: (r: string) => `틀어진 신체 밸런스를 차분히 정돈하고 활력을 충전해 드리는 ${r} 전문 테라피스트 케어.`
  },
  /* 9 */ {
    title: (r: string) => `${r} VIP 프리미엄 바디 힐링 솔루션 - 메트로힐`,
    desc: (r: string) => `고품격 프라이빗 룸과 프리미엄 오일 케어로 완성하는 ${r} 최상급 바디 테라피 추천 정보.`
  },
  /* 10 */ {
    title: (r: string) => `${r} 건식 바디 스트레칭 & 포인트 릴렉스 | 메트로힐`,
    desc: (r: string) => `오일 없이 산뜻하게 전신 근육의 긴장을 해소하는 ${r} 건식 테라피 프로그램 코스 안내.`
  },
  /* 11 */ {
    title: (r: string) => `${r} 힐링 에스테틱 & 스킨 바디케어 정보 - 메트로힐`,
    desc: (r: string) => `피부 결 정돈과 뭉친 전신 피로를 동시에 케어하는 ${r} 복합 바디 웰니스 프로그램.`
  },
  /* 12 */ {
    title: (r: string) => `${r} 직장인 맞춤 피로회복 힐링 코스 | 메트로힐`,
    desc: (r: string) => `컴퓨터와 스마트폰 사용으로 지친 현대인을 위한 ${r} 승모근·목 집중 테라피 솔루션.`
  },
  /* 13 */ {
    title: (r: string) => `${r} 프라이빗 힐링 라운지 테라피 추천 - 메트로힐`,
    desc: (r: string) => `안락하고 쾌적한 환경에서 온전한 휴식을 선사하는 ${r} 대표 테라피 샵 정보.`
  },
  /* 14 */ {
    title: (r: string) => `${r} 로미로미 감성 힐링 트리트먼트 | 메트로힐`,
    desc: (r: string) => `물 흐르듯 부드러운 리듬감의 하와이안 감성 테라피, ${r} 로미로미 코스 및 요금 비교.`
  },
  /* 15 */ {
    title: (r: string) => `${r} 전신 순환 아로마 테라피 프로그램 - 메트로힐`,
    desc: (r: string) => `향기로운 식물성 오일 블렌딩으로 심신 안정을 돕는 ${r} 힐링 케어 가이드.`
  },
  /* 16 */ {
    title: (r: string) => `${r} 심야 힐링 나이트 바디케어 가이드 | 메트로힐`,
    desc: (r: string) => `숙면을 취하지 못하는 분들을 위한 ${r} 편안한 심야 릴렉싱 프로그램 정보.`
  },
  /* 17 */ {
    title: (r: string) => `${r} 스웨디시 & 딥 릴렉스 집중 코스 - 메트로힐`,
    desc: (r: string) => `체계적인 테라피스트 교육을 마친 전문 매니저의 ${r} 맞춤형 힐링 바디케어 서비스.`
  },
  /* 18 */ {
    title: (r: string) => `${r} 활력 충전 바디 리프레시 프로그램 | 메트로힐`,
    desc: (r: string) => `무거운 몸을 가볍고 개운하게 리셋하는 ${r} 에너지 충전 테라피 추천 가이드.`
  },
  /* 19 */ {
    title: (r: string) => `${r} 내 주변 웰니스 테라피 샵 위치 안내 - 메트로힐`,
    desc: (r: string) => `${r}에서 가장 가까운 검증된 힐링 바디 릴렉스 제휴 업체를 손쉽게 찾아보세요.`
  },
  /* 20 */ {
    title: (r: string) => `${r} 소프트 릴렉싱 바디 트리트먼트 | 메트로힐`,
    desc: (r: string) => `강한 자극 없이 섬세하고 포근하게 전신을 감싸주는 ${r} 소프트 테라피 프로그램.`
  },
  /* 21 */ {
    title: (r: string) => `${r} 천연 에센셜 오일 바디케어 추천 - 메트로힐`,
    desc: (r: string) => `순도 높은 오일 테라피로 피부와 근육을 동시에 보듬는 ${r} 프리미엄 케어.`
  },
  /* 22 */ {
    title: (r: string) => `${r} 호텔식 럭셔리 힐링 바디 테라피 | 메트로힐`,
    desc: (r: string) => `고급스러운 프라이빗 케어를 합리적인 가격대로 즐기는 ${r} 웰니스 추천 샵.`
  },
  /* 23 */ {
    title: (r: string) => `${r} 1:1 전담 테라피스트 맞춤 힐링 - 메트로힐`,
    desc: (r: string) => `고객 컨디션에 따른 부위별 집중 관리, ${r} 맞춤 테라피 코스 안내.`
  },
  /* 24 */ {
    title: (r: string) => `${r} 쾌적한 힐링 스페이스 바디케어 가이드 | 메트로힐`,
    desc: (r: string) => `철저한 위생 및 방역 수칙을 준수하는 ${r} 안심 힐링 테라피 플랫폼.`
  },
  /* 25 */ {
    title: (r: string) => `${r} 데일리 힐링 바디 릴렉스 프로그램 - 메트로힐`,
    desc: (r: string) => `매일 받아도 부담 없는 가벼운 릴렉싱 코스, ${r} 테라피 샵 상세 가격 안내.`
  },
  /* 26 */ {
    title: (r: string) => `${r} 전신 밸런스 회복 힐링 트리트먼트 | 메트로힐`,
    desc: (r: string) => `지친 심신에 활력을 불어넣는 ${r} 전신 스트레칭 및 이완 케어 정보.`
  },
  /* 27 */ {
    title: (r: string) => `${r} 프리미엄 스웨디시 & 아로마 복합 코스 - 메트로힐`,
    desc: (r: string) => `건식의 시원함과 아로마의 부드러움을 한 번에 경험하는 ${r} 인기 복합 프로그램.`
  },
  /* 28 */ {
    title: (r: string) => `${r} 힐링 홈스파 감성 바디케어 | 메트로힐`,
    desc: (r: string) => `도심 속 나만의 작은 휴식처, ${r} 프라이빗 힐링 테라피 샵 모음.`
  },
  /* 29 */ {
    title: (r: string) => `${r} 스트레스 완화 힐링 테라피 코스 - 메트로힐`,
    desc: (r: string) => `복잡한 일상에서 벗어나 온전한 휴식을 누리는 ${r} 추천 바디케어 프로그램.`
  },
  /* 30 */ {
    title: (r: string) => `${r} 딥 릴렉싱 테라피 & 전신 순환 가이드 | 메트로힐`,
    desc: (r: string) => `깊은 이완 상태로 유도하여 숙면과 피로 회복을 돕는 ${r} 힐링 케어 정보.`
  },
  /* 31 */ {
    title: (r: string) => `${r} 타이 & 스웨디시 추천 제휴 샵 - 메트로힐`,
    desc: (r: string) => `${r} 지역 검증된 제휴 업체의 실제 후기와 코스별 요금을 투명하게 확인하세요.`
  },
  /* 32 */ {
    title: (r: string) => `${r} 감성 힐링 릴렉스 바디 테라피 | 메트로힐`,
    desc: (r: string) => `마음까지 편안해지는 섬세한 터치와 쾌적한 공간, ${r} 인기 테라피 샵 안내.`
  },
  /* 33 */ {
    title: (r: string) => `${r} 피로회복 집중 바디 트리트먼트 - 메트로힐`,
    desc: (r: string) => `목, 등, 허리 등 결림 부위를 꼼꼼히 이완시키는 ${r} 전문 관리 프로그램.`
  },
  /* 34 */ {
    title: (r: string) => `${r} 온열 힐링 아로마 케어 가이드 | 메트로힐`,
    desc: (r: string) => `따뜻한 온기와 천연 오일이 어우러져 피로를 녹여주는 ${r} 힐링 테라피.`
  },
  /* 35 */ {
    title: (r: string) => `${r} 웰빙 바디 리프레시 큐레이션 - 메트로힐`,
    desc: (r: string) => `건강하고 활력 넘치는 일상을 위한 ${r} 지역 웰니스 테라피 가이드.`
  },
  /* 36 */ {
    title: (r: string) => `${r} 프라이빗 1인 룸 힐링 바디케어 | 메트로힐`,
    desc: (r: string) => `타인의 시선 없이 독립된 공간에서 누리는 ${r} 프라이빗 바디 테라피 정보.`
  },
  /* 37 */ {
    title: (r: string) => `${r} 럭셔리 감성 스웨디시 케어 안내 - 메트로힐`,
    desc: (r: string) => `최고급 오일과 정성 가득한 관리사의 손길, ${r} 추천 스웨디시 프로그램.`
  },
  /* 38 */ {
    title: (r: string) => `${r} 근육 이완 맞춤 바디 솔루션 | 메트로힐`,
    desc: (r: string) => `운동 후 뭉친 근육이나 만성 피로를 시원하게 리셋하는 ${r} 전문 바디 테라피.`
  },
  /* 39 */ {
    title: (r: string) => `${r} 전신 활력 충전 힐링케어 안내 - 메트로힐`,
    desc: (r: string) => `${r} 전지역 엄선된 제휴 네트워크! 지금 바로 내 주변 추천 힐링 샵을 만나보세요.`
  }
];

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams.dong ? decodeURIComponent(resolvedSearchParams.dong) : "";
  const districtName = decodeURIComponent(district);
  const regionName = region === "seoul" ? "서울" : region === "incheon" ? "인천" : "경기";

  const locationKeyword = `${regionName} ${districtName} ${dongName}`.trim();
  const simpleLocation = dongName ? `${districtName} ${dongName}` : districtName;

  // 지역명 해시 연산 -> 40가지 패턴 중 1개 일관 배분
  const charSum = (locationKeyword + dongName + districtName)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = Math.abs(charSum) % 40;

  const pattern = SEO_PATTERNS[variantIndex] || SEO_PATTERNS[0];
  const finalTitle = pattern.title(simpleLocation);
  const finalDescription = pattern.desc(locationKeyword);

  const canonicalUrl = `https://metroheal.netlify.app/${region}/${encodeURIComponent(districtName)}${
    dongName ? `?dong=${encodeURIComponent(dongName)}` : ""
  }`;

  return {
    title: {
      absolute: finalTitle, // 템플릿 중복 없이 패턴 타이틀 그대로 출력
    },
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `${simpleLocation} 테라피`,
      `${simpleLocation} 스웨디시`,
      `${simpleLocation} 아로마 케어`,
      `${simpleLocation} 바디케어`,
      `${locationKeyword} 힐링샵`,
      `${locationKeyword} 웰니스`,
      "메트로힐"
    ],
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: "메트로힐",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function RegionalDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedSearchParams.dong ? decodeURIComponent(resolvedSearchParams.dong) : "";
  const districtName = decodeURIComponent(district);
  const regionName = region === "seoul" ? "서울특별시" : region === "incheon" ? "인천광역시" : "경기도";

  const fullTitle = dongName 
    ? `${regionName} ${districtName} (${dongName})` 
    : `${regionName} ${districtName}`;

  const simpleLocation = dongName ? `${districtName} ${dongName}` : districtName;

  // 메인 제휴 5개 샵 연동 (지역 파라미터 전달)
  const localShops = [
    {
      id: 1,
      name: `한국미녀테라피 (${simpleLocation})`,
      desc: "지친 일상에 맞춤형 활력 충전! 전문 테라피스트의 정성 어린 감성 바디 테라피",
      phone: "0507-1280-3299",
      price: "90,000원부터~",
      image: "/shop1.jpg"
    },
    {
      id: 2,
      name: `오늘밤테라피 (${simpleLocation})`,
      desc: "최고급 천연 아로마 오일을 활용한 전신 이완 및 림프 순환 케어 전문 프로그램",
      phone: "0507-1280-3191",
      price: "60,000원부터~",
      image: "/shop2.jpg"
    },
    {
      id: 3,
      name: `주주홈타이 (${simpleLocation})`,
      desc: "재방문율 높은 안심 케어! 철저한 위생 관리와 품격 있는 정통 타이 & 릴렉싱",
      phone: "0507-1280-3180",
      price: "60,000원부터~",
      image: "/shop3.jpg"
    },
    {
      id: 4,
      name: `한국골든테라피 (${simpleLocation})`,
      desc: "전문 힐러진의 맞춤형 바디 관리, 시간대별 편안한 VIP 피로회복 솔루션",
      phone: "0507-1280-3361",
      price: "60,000원부터~",
      image: "/shop4.jpg"
    },
    {
      id: 5,
      name: `퀸즈홈테라피 (${simpleLocation})`,
      desc: "수도권 전지역 엄선된 파트너! 정직한 안내와 함께하는 프라이빗 힐링 테라피",
      phone: "0507-1280-3222",
      price: "60,000원부터~",
      image: "/shop5.jpg"
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${fullTitle} 힐링 바디 테라피 제휴 안내 - 메트로힐`,
    "description": `${fullTitle} 지역 아로마 테라피, 타이, 스웨디시 힐링 케어 제휴업체 정보 안내`,
    "url": `https://metroheal.netlify.app/${region}/${encodeURIComponent(districtName)}`,
    "telephone": "0507-1280-3344",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": districtName,
      "addressRegion": regionName,
      "addressCountry": "KR"
    }
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-10">
        
        {/* 상단 지역 대표 배너 (클린 카피) */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionName.toUpperCase()} · LOCAL WELLNESS GUIDE
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {fullTitle} 힐링 바디 테라피 안내
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {fullTitle} 고객님을 위한 프리미엄 바디 웰니스 가이드입니다. 검증된 타이·아로마·스웨디시 제휴 샵 코스와 상세 프로그램 정보를 확인해 보세요.
            </p>
          </div>
        </section>

        {/* 클라이언트 사이드 키워드 인젝션 영역 */}
        <ClientTextMixer locationText={fullTitle} />

        {/* 제휴업체 5개 카드리스트 */}
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">RECOMMENDED PARTNERS</p>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              {fullTitle} 추천 제휴 샵 (5곳)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localShops.map((lShop) => (
              <div key={lShop.id} className="bg-[#111114] border border-amber-500/20 hover:border-amber-500/60 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative">
                
                {/* 🌟 샵 상세페이지 접속 시 해당 지역명을 넘겨주어 샵 타이틀이 동적 매칭되도록 연동 */}
                <Link 
                  href={`/shop/${lShop.id}?region=${encodeURIComponent(simpleLocation)}`} 
                  className="absolute inset-0 z-10" 
                  aria-label={`${lShop.name} 상세페이지 보기`} 
                />

                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400/60 font-black text-xl border border-white/10 group-hover:scale-105 transition-transform flex-shrink-0">
                  Care
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {lShop.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                    {lShop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">{lShop.price}</span>
                    <a 
                      href={`tel:${lShop.phone}`} 
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow transition-all transform active:scale-95 relative z-20"
                    >
                      전화연결
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 건강 웰니스 칼럼 섹션 */}
        <section className="bg-[#0e0e12] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>🌿</span> {fullTitle} 일상 피로회복 & 릴렉싱 웰니스 팁
          </h3>
          <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
            <p>
              현대 직장인들이 장시간 앉아서 근무하거나 전자기기를 지속적으로 이용할 경우, 목 주변 근육과 어깨 승모근이 경직되어 만성 피로와 결림을 유발하기 쉽습니다. 규칙적인 전신 스트레칭과 맞춤형 바디 테라피는 체내 순환을 촉진하고 심신 안정에 도움을 줍니다.
            </p>
            <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="font-bold text-white text-xs">💡 나에게 맞는 테라피 프로그램 선택 가이드</h4>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400">
                <li><strong className="text-gray-200">정통 타이 테라피:</strong> 견갑골과 하체의 경직된 부위를 시원하게 풀어주는 스트레칭 중심의 케어.</li>
                <li><strong className="text-gray-200">천연 아로마 케어:</strong> 은은한 에센셜 오일의 부드러운 압을 이용해 림프 순환과 심신 이완을 돕는 코스.</li>
                <li><strong className="text-gray-200">감성 스웨디시 케어:</strong> 부드러운 오일 터칭으로 깊은 안정감과 활력을 충전해 주는 인기 프로그램.</li>
              </ul>
            </div>
            <p className="text-gray-500 text-[11px]">
              * 본 콘텐츠는 {fullTitle} 지역 고객 여러분의 건강한 휴식과 올바른 웰니스 정보 제공을 목적으로 작성되었습니다.
            </p>
          </div>
        </section>

        {/* 이용 가이드 4단계 */}
        <section className="bg-[#0f0f13] p-6 md:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">SERVICE PROCESS</span>
            <h3 className="text-xl font-black text-white mt-1">{fullTitle} 안심 이용 순서</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 1</span>
              <h4 className="font-bold text-white mt-1">지역 확인</h4>
              <p className="text-xs text-gray-400 mt-1">{fullTitle} 제휴 샵 목록을 확인합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 2</span>
              <h4 className="font-bold text-white mt-1">코스 비교</h4>
              <p className="text-xs text-gray-400 mt-1">타이, 아로마, 스웨디시 프로그램을 비교합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 3</span>
              <h4 className="font-bold text-white mt-1">직접 소통</h4>
              <p className="text-xs text-gray-400 mt-1">전화 버튼을 통해 샵과 직접 일정을 상담합니다.</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-amber-400 font-bold">STEP 4</span>
              <h4 className="font-bold text-white mt-1">맞춤 힐링</h4>
              <p className="text-xs text-gray-400 mt-1">전문 힐러의 정성 어린 케어를 경험합니다.</p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 (FAQ) */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">FAQ</span>
            <h3 className="text-xl font-black text-white mt-1">{fullTitle} 자주 묻는 질문</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> {fullTitle} 제휴 샵 예약은 어떻게 하나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 원하시는 샵 카드의 전화연결 버튼을 누르시면 해당 업체 매니저와 직접 프로그램 및 시간을 조율하실 수 있습니다.
              </p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <div className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <span className="text-amber-400">Q.</span> 메트로힐 플랫폼 이용 시 별도 수수료가 있나요?
              </div>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                <span className="text-amber-400 font-bold">A.</span> 메트로힐은 순수 정보 안내 플랫폼으로 이용자에게 어떠한 중개 수수료도 부과하지 않습니다.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* 푸터 영역 */}
      <footer className="bg-[#040406] border-t border-white/10 py-10 text-center text-gray-500 text-xs mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div>
            <a 
              href="tel:0507-1280-3344" 
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-4 py-2 rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all text-xs shadow-md"
            >
              <span>🤝</span> 메트로힐 제휴 문의 (0507-1280-3344)
            </a>
          </div>

          <p className="text-gray-400 font-medium">메트로힐은 쾌적하고 건전한 프리미엄 바디 웰니스 제휴 정보를 제공합니다.</p>
          <p className="text-[11px] text-gray-600">COPYRIGHT &copy; METROHEAL ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}