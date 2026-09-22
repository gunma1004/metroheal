import { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
    dong: string;
  }>;
}

// 🛠️ 안전한 URL 디코더
function safeDecode(str: string): string {
  if (!str) return "";
  try {
    return decodeURIComponent(decodeURIComponent(str)).trim();
  } catch {
    try {
      return decodeURIComponent(str).trim();
    } catch {
      return str.trim();
    }
  }
}

// -------------------------------------------------------------
// 🎯 1,000가지 고유 SEO 패턴 생성 로직
// -------------------------------------------------------------
const titleTemplates = [
  (dong: string) => `${dong} 지역 맞춤형 스웨디시 마사지 안내 - 메트로힐`,
  (dong: string) => `${dong} 전문 아로마 오일 마사지 제휴샵 코스 총정리`,
  (dong: string) => `${dong} 프라이빗 힐링 바디케어 타이 마사지 추천`,
  (dong: string) => `${dong} 림프 순환 케어 프로그램 마사지 가이드 | 메트로힐`,
  (dong: string) => `${dong} 딥티슈 피로회복 바디 테라피 마사지 정보`,
  (dong: string) => `${dong} 프리미엄 감성 웰니스 마사지 예약 안내`,
  (dong: string) => `${dong} 정찰제 스파 바디케어 스웨디시 마사지 샵`,
  (dong: string) => `${dong} 일상 피로 해소를 위한 전문 아로마 마사지`,
  (dong: string) => `${dong} 1:1 맞춤형 힐링 타이 마사지 프로그램 안내`,
  (dong: string) => `${dong} 쾌적한 실내 릴렉스 테라피 바디 마사지 코스`,
  (dong: string) => `${dong} 힐링 에스테틱 스킨 바디 마사지 정보 - 메트로힐`,
  (dong: string) => `${dong} 전신 스트레칭 건식 바디 마사지 코스`,
  (dong: string) => `${dong} VIP 럭셔리 스파 힐링 마사지 제휴 가이드`,
  (dong: string) => `${dong} 스트레스 완화 부드러운 전신 마사지 테라피`,
  (dong: string) => `${dong} 체형 밸런스 회복 맞춤 바디 마사지 추천`,
  (dong: string) => `${dong} 직장인 피로 릴렉싱 전용 마사지 샵 리스트`,
  (dong: string) => `${dong} 심신 안정을 위한 로미로미 감성 마사지`,
  (dong: string) => `${dong} 온열 스톤 테라피 힐링 마사지 프로그램`,
  (dong: string) => `${dong} 깊은 휴식 수면 유도 릴렉싱 마사지 가이드`,
  (dong: string) => `${dong} 커플 스파 및 프라이빗 룸 힐링 마사지`,
  (dong: string) => `${dong} 안심 위생 관리 전문 웰니스 마사지 샵`,
  (dong: string) => `${dong} 뭉친 근육 이완 전용 스포츠 바디 마사지`,
  (dong: string) => `${dong} 천연 에센셜 오일 블렌딩 바디 마사지`,
  (dong: string) => `${dong} 데일리 케어 부담 없는 정찰제 마사지 코스`,
  (dong: string) => `${dong} 신체 순환 촉진 전문 테라피 마사지 제휴점`,
  (dong: string) => `${dong} 부드러운 압력 소프트 힐링 바디 마사지`,
  (dong: string) => `${dong} 나만을 위한 1인실 스웨디시 마사지 예약`,
  (dong: string) => `${dong} 활력 충전 리프레시 에너지 바디 마사지`,
  (dong: string) => `${dong} 하체 집중 붓기 완화 풋 앤 바디 마사지`,
  (dong: string) => `${dong} 프리미엄 테라피스트 전담 힐링 마사지 코스`,
  (dong: string) => `${dong} 아로마틱 감성 스파 릴렉싱 마사지 정보`,
  (dong: string) => `${dong} 일상의 활력을 되찾는 정통 타이 마사지`,
  (dong: string) => `${dong} 근육 피로를 녹이는 시그니처 딥 마사지`,
  (dong: string) => `${dong} 웰빙 건강 관리 스페셜 바디케어 마사지`,
  (dong: string) => `${dong} 철저한 프라이빗 보장 고급 에스테틱 마사지`,
  (dong: string) => `${dong} 마음까지 치유하는 스페셜 힐링 마사지 샵`,
  (dong: string) => `${dong} 섬세한 케어의 명품 스웨디시 마사지 가이드`,
  (dong: string) => `${dong} 전신 이완 스트레칭 중심 건식 타이 마사지`,
  (dong: string) => `${dong} 몸과 마음의 조화 밸런스 바디 마사지 추천`,
  (dong: string) => `${dong} 고객 만족도 1위 릴렉싱 웰니스 마사지 코스`
];

const descTemplates = [
  (loc: string, full: string) => `${full} 지역에서 편안하게 이용할 수 있는 전문 출장마사지 제휴업체 정보와 상세한 프로그램 안내를 확인해보세요.`,
  (loc: string, full: string) => `${full} 인근에서 차별화된 힐링 코스를 찾고 계신다면 메트로힐이 엄선한 신뢰도 높은 출장마사지 제휴 요금표를 만나보세요.`,
  (loc: string, full: string) => `${full} 맞춤형 바디케어 안내입니다. 일상의 피로를 말끔히 풀어주는 출장마사지 프로그램을 비교해보세요.`,
  (loc: string, full: string) => `${full} 전 지역에서 신속하게 이용 가능한 정찰제 출장마사지 정보를 빠르고 정확하게 안내해 드립니다.`,
  (loc: string, full: string) => `${full} 최고의 휴식을 선사하는 전문 테라피스트들의 맞춤형 출장마사지 코스. 지금 바로 메트로힐에서 제휴 혜택을 확인하세요.`,
  (loc: string, full: string) => `${full}에서 지친 몸과 마음을 정화해 주는 출장마사지 및 아로마 테라피 프로그램 정보를 한눈에 살펴보세요.`,
  (loc: string, full: string) => `${full} 프리미엄 웰니스 출장마사지 전문 제휴점 안내입니다. 투명하고 합리적인 가격으로 편안한 힐링을 경험해 보세요.`,
  (loc: string, full: string) => `${full} 지역 주민들을 위한 출장마사지 코스 총정리. 세심하고 시원한 테라피로 피로를 날려버리세요.`,
  (loc: string, full: string) => `${full}에서 경험하는 품격 있는 출장마사지 서비스 정보. 안심하고 이용할 수 있는 제휴처를 모았습니다.`,
  (loc: string, full: string) => `${full} 인근 출장마사지 추천 업소 안내. 엄선된 힐러들의 전문적인 바디 케어 프로그램과 이용 요금을 확인해보세요.`,
  (loc: string, full: string) => `${full} 전용 맞춤 출장마사지 가이드. 편안한 공간에서 즐기는 힐링 테라피 정보를 지금 바로 비교해 보세요.`,
  (loc: string, full: string) => `${full} 지역의 실시간 인기 출장마사지 제휴점 안내. 지친 일상에 활력을 불어넣어 줄 프리미엄 코스를 만나보세요.`,
  (loc: string, full: string) => `${full}에서 만나볼 수 있는 1:1 맞춤형 출장마사지 프로그램. 투명한 후불제 시스템으로 안전하게 이용하실 수 있습니다.`,
  (loc: string, full: string) => `${full} 출장마사지 전문 제휴 플랫폼 메트로힐입니다. 엄선된 힐링 프로그램과 상세한 가격 정보를 확인해 보세요.`,
  (loc: string, full: string) => `${full} 인근에서 가장 만족도 높은 출장마사지 정보와 체계적인 바디 케어 코스 안내를 제공해 드립니다.`,
  (loc: string, full: string) => `${full} 웰니스 힐링 출장마사지 안내. 일상의 스트레스를 편안하게 해소해 주는 전문 테라피 서비스를 확인해보세요.`,
  (loc: string, full: string) => `${full} 지역 맞춤형 출장마사지 및 아로마 프로그램 정보. 품격 있는 휴식을 위한 필수 코스를 만나보세요.`,
  (loc: string, full: string) => `${full} 전문 출장마사지 제휴점들의 실시간 요금 및 코스 안내. 나에게 알맞은 힐링 프로그램을 선택해 보세요.`,
  (loc: string, full: string) => `${full}에서 편안하게 이용 가능한 출장마사지 테라피 정보. 철저하게 관리되는 제휴 업소들만 모아두었습니다.`,
  (loc: string, full: string) => `${full} 인근 출장마사지 추천 안내. 몸과 마음의 피로를 부드럽게 감싸주는 힐링 케어를 지금 경험해 보세요.`,
  (loc: string, full: string) => `${full} 지역의 고품격 출장마사지 프로그램 안내. 일상 속 피로를 시원하게 날려버릴 전문 테라피를 만나보세요.`,
  (loc: string, full: string) => `${full} 맞춤형 힐링 출장마사지 가이드. 투명한 정보와 실속 있는 제휴 혜택을 메트로힐에서 확인해 보세요.`,
  (loc: string, full: string) => `${full} 인근에서 검증된 출장마사지 제휴점 정보. 편안한 분위기 속에서 즐기는 프리미엄 바디 케어 안내입니다.`,
  (loc: string, full: string) => `${full} 전용 출장마사지 코스 소개. 지친 하루의 끝을 포근하게 채워줄 힐링 테라피를 확인해보세요.`,
  (loc: string, full: string) => `${full} 전문 관리사들의 손길로 완성되는 출장마사지 프로그램 정보. 신뢰할 수 있는 제휴 업소를 비교해 보세요.`
];

const SEO_PATTERNS = Array.from({ length: 1000 }, (_, i) => {
  const titleFunc = titleTemplates[i % 40];
  const descFunc = descTemplates[Math.floor(i / 40) % 25];
  return { title: titleFunc, desc: descFunc };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const region = safeDecode(resolvedParams.region);
  const district = safeDecode(resolvedParams.district);
  const dong = safeDecode(resolvedParams.dong);

  const regionName = region === "seoul" ? "서울" : region === "incheon" ? "인천" : "경기";

  const locationKeyword = `${regionName} ${district} ${dong}`.trim();
  const simpleLocation = `${district} ${dong}`.trim();

  const charSum = (locationKeyword + region)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = Math.abs(charSum) % 1000;

  const pattern = SEO_PATTERNS[variantIndex];
  const finalTitle = pattern.title(simpleLocation);
  const finalDescription = pattern.desc(simpleLocation, locationKeyword);

  const canonicalUrl = `https://metroheal.netlify.app/massage/${region}/${encodeURIComponent(district)}/${encodeURIComponent(dong)}`;

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical: canonicalUrl },
    keywords: [
      `${simpleLocation} 마사지`,
      `${simpleLocation} 출장마사지`,
      `${simpleLocation} 스웨디시`,
      `${simpleLocation} 아로마테라피`,
      `${locationKeyword} 힐링샵`,
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

export default async function RegionalDongPage({ params }: PageProps) {
  const resolvedParams = await params;
  const region = safeDecode(resolvedParams.region);
  const district = safeDecode(resolvedParams.district);
  const dong = safeDecode(resolvedParams.dong);

  const regionName = region === "seoul" ? "서울특별시" : region === "incheon" ? "인천광역시" : "경기도";
  const fullTitle = `${regionName} ${district} ${dong}`;

  const localShops = [
    { id: 1, slug: "miin-therapy", name: `✨ ${dong} 한국미녀테라피`, desc: "수도권 전지역 신속 매칭, 정성 가득한 프리미엄 감성 바디 테라피 & 1:1 맞춤 케어", phone: "0507-1280-3299", price: "90,000원부터~", image: "/shop1.jpg" },
    { id: 2, slug: "night-therapy", name: `🌙 ${dong} 오늘밤테라피`, desc: "최고급 천연 아로마 오일 블렌딩, 지친 일상을 깨우는 고품격 프라이빗 힐링 바디 테라피 전문", phone: "0507-1280-3191", price: "60,000원부터~", image: "/shop2.jpg" },
    { id: 3, slug: "juju-therapy", name: `💎 ${dong} 주주홈타이`, desc: "재방문율 1위, 철저한 위생 관리와 숙련된 테라피스트의 정통 바디 릴렉싱 프로그램", phone: "0507-1280-3180", price: "60,000원부터~", image: "/shop3.jpg" },
    { id: 4, slug: "golden-therapy", name: `🔥 ${dong} 한국골든테라피`, desc: "전문 테라피스트의 VIP 집중 피로회복 솔루션, 수도권 어디서나 편안하게 만나는 맞춤 힐링", phone: "0507-1280-3361", price: "60,000원부터~", image: "/shop4.jpg" },
    { id: 5, slug: "queens-home-therapy", name: `👑 ${dong} 퀸즈홈테라피`, desc: "수도권 전역 빠른 안내, 검증된 전문 매니저의 힐링 테라피 & 프리미엄 바디 밸런스 프로그램", phone: "0507-1280-3222", price: "60,000원부터~", image: "/shop5.jpg" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${fullTitle} 힐링 바디 테라피 제휴 안내 - 메트로힐`,
    "description": `${fullTitle} 지역 아로마 테라피, 타이, 스웨디시 제휴업체 정보 안내`,
    "url": `https://metroheal.netlify.app/massage/${region}/${encodeURIComponent(district)}/${encodeURIComponent(dong)}`,
    "telephone": "0507-1280-3344",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": dong,
      "addressRegion": regionName,
      "addressCountry": "KR"
    }
  };

  return (
    <div className="bg-[#070709] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-10">
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/35 shadow-[0_0_40px_rgba(245,158,11,0.12)] bg-[#141418]">
          <div className="p-6 md:p-10 space-y-2">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1 block">
              {regionName.toUpperCase()} · LOCAL WELLNESS GUIDE
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {fullTitle} 바디 테라피 안내
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {fullTitle} 고객님을 위한 프리미엄 바디 웰니스 가이드입니다. 검증된 타이·아로마·스웨디시 제휴 샵 코스와 편안한 휴식 정보를 확인해 보세요.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">RECOMMENDED PARTNERS</p>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              {fullTitle} 추천 제휴업체 (총 5곳)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localShops.map((lShop) => (
              <div key={lShop.id} className="bg-[#111114] border border-amber-500/20 hover:border-amber-400 rounded-2xl p-4 flex gap-4 items-center shadow-md transition-all group relative">
                <Link href={`/massage/${region}/${encodeURIComponent(district)}/${encodeURIComponent(dong)}/shop/${lShop.slug}`} className="absolute inset-0 z-10" aria-label={`${lShop.name} 상세페이지 보기`} />
                <img src={lShop.image} alt={lShop.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {lShop.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {lShop.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{lShop.price}</span>
                    <a href={`tel:${lShop.phone.replace(/-/g, "")}`} className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow transition-all transform active:scale-95 relative z-20 flex items-center gap-1">
                      <span>📞</span> 전화예약
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-2">
          <Link href={`/massage/${region}/${encodeURIComponent(district)}`} className="text-xs text-gray-400 hover:text-amber-400 transition-colors font-semibold">
            ← {district} 목록으로 돌아가기
          </Link>
        </div>
      </main>

      <footer className="bg-[#040406] border-t border-white/10 py-10 text-center text-gray-500 text-xs mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div>
            <a href="tel:0507-1280-3344" className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-4 py-2 rounded-xl border border-amber-500/30 transition-all text-xs shadow-md">
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