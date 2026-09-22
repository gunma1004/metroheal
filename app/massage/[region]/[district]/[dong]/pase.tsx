import { Metadata } from "next";
import Link from "next/link";
import ClientTextMixer from "../ClientTextMixer"; // 경로에 맞게 조정해 주세요

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
    dong: string;
  }>;
  searchParams: Promise<{
    dong?: string;
  }>;
}

// 🛠️ 이중 URL 인코딩까지 안전하게 풀어내는 디코더
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

// -------------------------------------------------------------
// 🎯 1,000가지 고유 SEO 패턴 생성 로직 (동 단위 전용)
// -------------------------------------------------------------
// [규칙 1] Title (40개): '출장' 키워드 완전 배제 / 오직 '마사지' 키워드만 포함
const titleTemplates = [
  (dong: string, dist: string) => `${dong} 지역 맞춤형 스웨디시 마사지 안내 - 메트로힐`,
  (dong: string, dist: string) => `${dong} 전문 아로마 오일 마사지 제휴샵 코스 총정리`,
  (dong: string, dist: string) => `${dong} 프라이빗 힐링 바디케어 타이 마사지 추천`,
  (dong: string, dist: string) => `${dong} 림프 순환 케어 프로그램 마사지 가이드 | 메트로힐`,
  (dong: string, dist: string) => `${dong} 딥티슈 피로회복 바디 테라피 마사지 정보`,
  (dong: string, dist: string) => `${dong} 프리미엄 감성 웰니스 마사지 예약 안내`,
  (dong: string, dist: string) => `${dong} 정찰제 스파 바디케어 스웨디시 마사지 샵`,
  (dong: string, dist: string) => `${dong} 일상 피로 해소를 위한 전문 아로마 마사지`,
  (dong: string, dist: string) => `${dong} 1:1 맞춤형 힐링 타이 마사지 프로그램 안내`,
  (dong: string, dist: string) => `${dong} 쾌적한 실내 릴렉스 테라피 바디 마사지 코스`,
  (dong: string, dist: string) => `${dong} 힐링 에스테틱 스킨 바디 마사지 정보 - 메트로힐`,
  (dong: string, dist: string) => `${dong} 전신 스트레칭 건식 바디 마사지 코스`,
  (dong: string, dist: string) => `${dong} VIP 럭셔리 스파 힐링 마사지 제휴 가이드`,
  (dong: string, dist: string) => `${dong} 스트레스 완화 부드러운 전신 마사지 테라피`,
  (dong: string, dist: string) => `${dong} 체형 밸런스 회복 맞춤 바디 마사지 추천`,
  (dong: string, dist: string) => `${dong} 직장인 피로 릴렉싱 전용 마사지 샵 리스트`,
  (dong: string, dist: string) => `${dong} 심신 안정을 위한 로미로미 감성 마사지`,
  (dong: string, dist: string) => `${dong} 온열 스톤 테라피 힐링 마사지 프로그램`,
  (dong: string, dist: string) => `${dong} 깊은 휴식 수면 유도 릴렉싱 마사지 가이드`,
  (dong: string, dist: string) => `${dong} 커플 스파 및 프라이빗 룸 힐링 마사지`,
  (dong: string, dist: string) => `${dong} 안심 위생 관리 전문 웰니스 마사지 샵`,
  (dong: string, dist: string) => `${dong} 뭉친 근육 이완 전용 스포츠 바디 마사지`,
  (dong: string, dist: string) => `${dong} 천연 에센셜 오일 블렌딩 바디 마사지`,
  (dong: string, dist: string) => `${dong} 데일리 케어 부담 없는 정찰제 마사지 코스`,
  (dong: string, dist: string) => `${dong} 신체 순환 촉진 전문 테라피 마사지 제휴점`,
  (dong: string, dist: string) => `${dong} 부드러운 압력 소프트 힐링 바디 마사지`,
  (dong: string, dist: string) => `${dong} 나만을 위한 1인실 스웨디시 마사지 예약`,
  (dong: string, dist: string) => `${dong} 활력 충전 리프레시 에너지 바디 마사지`,
  (dong: string, dist: string) => `${dong} 하체 집중 붓기 완화 풋 앤 바디 마사지`,
  (dong: string, dist: string) => `${dong} 프리미엄 테라피스트 전담 힐링 마사지 코스`,
  (dong: string, dist: string) => `${dong} 아로마틱 감성 스파 릴렉싱 마사지 정보`,
  (dong: string, dist: string) => `${dong} 일상의 활력을 되찾는 정통 타이 마사지`,
  (dong: string, dist: string) => `${dong} 근육 피로를 녹이는 시그니처 딥 마사지`,
  (dong: string, dist: string) => `${dong} 웰빙 건강 관리 스페셜 바디케어 마사지`,
  (dong: string, dist: string) => `${dong} 철저한 프라이빗 보장 고급 에스테틱 마사지`,
  (dong: string, dist: string) => `${dong} 마음까지 치유하는 스페셜 힐링 마사지 샵`,
  (dong: string, dist: string) => `${dong} 섬세한 케어의 명품 스웨디시 마사지 가이드`,
  (dong: string, dist: string) => `${dong} 전신 이완 스트레칭 중심 건식 타이 마사지`,
  (dong: string, dist: string) => `${dong} 몸과 마음의 조화 밸런스 바디 마사지 추천`,
  (dong: string, dist: string) => `${dong} 고객 만족도 1위 릴렉싱 웰니스 마사지 코스`
];

// [규칙 2] Description (25개): '출장마사지' 키워드 필수 포함 / 스팸 키워드 배제
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

// 40(Title) * 25(Desc) = 1000개의 고유 조합 배열 생성
const SEO_PATTERNS = Array.from({ length: 1000 }, (_, i) => {
  const titleFunc = titleTemplates[i % 40];
  const descFunc = descTemplates[Math.floor(i / 40) % 25];
  return { title: titleFunc, desc: descFunc };
});

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedParams.dong 
    ? safeDecode(resolvedParams.dong) 
    : (resolvedSearchParams.dong ? safeDecode(resolvedSearchParams.dong) : "");

  const districtName = safeDecode(district);
  const regionName = region === "seoul" ? "서울" : region === "incheon" ? "인천" : "경기";

  const locationKeyword = `${regionName} ${districtName} ${dongName}`.trim();
  const simpleLocation = dongName ? `${districtName} ${dongName}` : districtName;

  // 1000개 패턴 중 고유 해시값을 통해 균등 분배
  const charSum = (locationKeyword + dongName + districtName + region)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = Math.abs(charSum) % 1000;

  const pattern = SEO_PATTERNS[variantIndex];
  const finalTitle = pattern.title(dongName || districtName, districtName);
  const finalDescription = pattern.desc(locationKeyword, dongName || districtName);

  const canonicalUrl = `https://metroheal.netlify.app/massage/${region}/${encodeURIComponent(districtName)}${
    dongName ? `/${encodeURIComponent(dongName)}` : ""
  }`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `${simpleLocation} 마사지`,
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

export default async function RegionalDongPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { region, district } = resolvedParams;
  const dongName = resolvedParams.dong 
    ? safeDecode(resolvedParams.dong) 
    : (resolvedSearchParams.dong ? safeDecode(resolvedSearchParams.dong) : "");

  const districtName = safeDecode(district);
  const regionName = region === "seoul" ? "서울특별시" : region === "incheon" ? "인천광역시" : "경기도";

  const fullTitle = dongName 
    ? `${regionName} ${districtName} ${dongName}` 
    : `${regionName} ${districtName}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${fullTitle} 힐링 바디 테라피 제휴 안내 - 메트로힐`,
    "description": `${fullTitle} 지역 아로마 테라피, 타이, 스웨디시 마사지 제휴업체 정보 안내`,
    "url": `https://metroheal.netlify.app/massage/${region}/${encodeURIComponent(districtName)}${dongName ? `/${encodeURIComponent(dongName)}` : ""}`,
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

        {/* 샵 리스트 컴포넌트 호출 */}
        <ClientTextMixer region={region} district={districtName} dongName={dongName} />

        <section className="bg-[#0e0e12] p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>🌿</span> {fullTitle} 일상 피로회복 & 릴렉싱 웰니스 팁
          </h3>
          <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
            <p>
              현대 직장인들이 장시간 앉아서 근무하거나 전자기기를 지속적으로 이용할 경우, 목 주변 근육과 어깨 승모근이 경직되어 만성 피로와 결림을 유발하기 쉽습니다. 규칙적인 전신 스트레칭과 맞춤형 바디 테라피는 체내 순환을 촉진하고 심신 안정에 도움을 줍니다.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-[#040406] border-t border-white/10 py-10 text-center text-gray-500 text-xs mt-auto">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div>
            <a 
              href="tel:0507-1280-3344" 
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold px-4 py-2 rounded-xl border border-amber-500/30 transition-all text-xs shadow-md"
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