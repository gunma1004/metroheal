import { Metadata } from "next";
import Link from "next/link";
import ClientTextMixer from "./ClientTextMixer";

interface PageProps {
  params: Promise<{
    region: string;
    district: string;
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
// 🎯 1,000가지 고유 SEO 패턴 생성 로직 (구 단위 전용)
// -------------------------------------------------------------
// [규칙 1] Title (40개): '마사지' 포함 / '출장' 및 스팸 키워드 절대 배제
const titleTemplates = [
  (loc: string) => `${loc} 지역 맞춤형 스웨디시 마사지 안내`,
  (loc: string) => `${loc} 전문 아로마 오일 마사지 제휴샵 코스 총정리`,
  (loc: string) => `${loc} 프라이빗 힐링 바디케어 타이 마사지 추천`,
  (loc: string) => `${loc} 림프 순환 케어 프로그램 마사지 가이드 | 메트로힐`,
  (loc: string) => `${loc} 딥티슈 피로회복 바디 테라피 마사지 정보`,
  (loc: string) => `${loc} 프리미엄 감성 웰니스 마사지 예약 안내`,
  (loc: string) => `${loc} 정찰제 스파 바디케어 스웨디시 마사지 샵`,
  (loc: string) => `${loc} 일상 피로 해소를 위한 전문 아로마 마사지`,
  (loc: string) => `${loc} 1:1 맞춤형 힐링 타이 마사지 프로그램 안내`,
  (loc: string) => `${loc} 쾌적한 실내 릴렉스 테라피 바디 마사지 코스`,
  (loc: string) => `${loc} 힐링 에스테틱 스킨 바디 마사지 정보`,
  (loc: string) => `${loc} 전신 스트레칭 건식 바디 마사지 코스`,
  (loc: string) => `${loc} VIP 럭셔리 스파 힐링 마사지 제휴 가이드`,
  (loc: string) => `${loc} 스트레스 완화 부드러운 전신 마사지 테라피`,
  (loc: string) => `${loc} 체형 밸런스 회복 맞춤 바디 마사지 추천`,
  (loc: string) => `${loc} 직장인 피로 릴렉싱 전용 마사지 샵 리스트`,
  (loc: string) => `${loc} 심신 안정을 위한 로미로미 감성 마사지`,
  (loc: string) => `${loc} 온열 스톤 테라피 힐링 마사지 프로그램`,
  (loc: string) => `${loc} 깊은 휴식 수면 유도 릴렉싱 마사지 가이드`,
  (loc: string) => `${loc} 커플 스파 및 프라이빗 룸 힐링 마사지`,
  (loc: string) => `${loc} 안심 위생 관리 전문 웰니스 마사지 샵`,
  (loc: string) => `${loc} 뭉친 근육 이완 전용 스포츠 바디 마사지`,
  (loc: string) => `${loc} 천연 에센셜 오일 블렌딩 바디 마사지`,
  (loc: string) => `${loc} 데일리 케어 부담 없는 정찰제 마사지 코스`,
  (loc: string) => `${loc} 신체 순환 촉진 전문 테라피 마사지 제휴점`,
  (loc: string) => `${loc} 부드러운 압력 소프트 힐링 바디 마사지`,
  (loc: string) => `${loc} 나만을 위한 1인실 스웨디시 마사지 예약`,
  (loc: string) => `${loc} 활력 충전 리프레시 에너지 바디 마사지`,
  (loc: string) => `${loc} 하체 집중 붓기 완화 풋 앤 바디 마사지`,
  (loc: string) => `${loc} 프리미엄 테라피스트 전담 힐링 마사지 코스`,
  (loc: string) => `${loc} 아로마틱 감성 스파 릴렉싱 마사지 정보`,
  (loc: string) => `${loc} 일상의 활력을 되찾는 정통 타이 마사지`,
  (loc: string) => `${loc} 근육 피로를 녹이는 시그니처 딥 마사지`,
  (loc: string) => `${loc} 웰빙 건강 관리 스페셜 바디케어 마사지`,
  (loc: string) => `${loc} 철저한 프라이빗 보장 고급 에스테틱 마사지`,
  (loc: string) => `${loc} 마음까지 치유하는 스페셜 힐링 마사지 샵`,
  (loc: string) => `${loc} 섬세한 케어의 명품 스웨디시 마사지 가이드`,
  (loc: string) => `${loc} 전신 이완 스트레칭 중심 건식 타이 마사지`,
  (loc: string) => `${loc} 몸과 마음의 조화 밸런스 바디 마사지 추천`,
  (loc: string) => `${loc} 고객 만족도 1위 릴렉싱 웰니스 마사지 코스`
];

// [규칙 2] Description (25개): '출장마사지' 필수 포함 / 스팸 키워드 배제
const descTemplates = [
  (loc: string, full: string) => `${full} 어디서든 신속하게 이용 가능한 출장마사지 전문 제휴 샵 안내. 지친 일상에 편안한 휴식을 선사하는 ${loc} 웰니스 프로그램을 만나보세요.`,
  (loc: string, full: string) => `${full} 인근에서 차별화된 출장 방문 마사지 코스를 찾고 계신다면 메트로힐이 엄선한 ${loc} 힐링 테라피 요금표를 확인해 보세요.`,
  (loc: string, full: string) => `${full} 맞춤형 바디케어 안내. 신속한 방문 배차 시스템을 통해 ${loc} 지역에서 편리하게 즐기는 출장 스웨디시 마사지 정보.`,
  (loc: string, full: string) => `${full} 정찰제로 안심하고 부를 수 있는 출장마사지 서비스. ${loc} 고객님을 위한 프리미엄 힐링 코스 총정리.`,
  (loc: string, full: string) => `${full} 전문 테라피스트가 직접 찾아가는 출장 방문 홈케어 마사지. ${loc} 지역에서 경험하는 품격 있는 바디 릴렉스 가이드.`,
  (loc: string, full: string) => `${full} 지역 맞춤형 출장 아로마 마사지 테라피. 내 집에서 편안하게 누리는 ${loc} 최고의 휴식과 힐링을 지금 예약해 보세요.`,
  (loc: string, full: string) => `${full} 실시간 출장마사지 예약 가이드. ${loc} 인근의 검증된 제휴 매니저가 제공하는 체계적인 피로 회복 솔루션.`,
  (loc: string, full: string) => `${full} 쾌적하고 안전한 출장 홈케어 마사지 코스 안내입니다. ${loc} 지역의 만족도 높은 프라이빗 웰니스 제휴 샵을 비교해 보세요.`,
  (loc: string, full: string) => `${full} 바쁜 현대인을 위한 맞춤형 출장마사지. ${loc} 전 지역 어디서나 정성스러운 1:1 전담 바디 케어를 경험해 보세요.`,
  (loc: string, full: string) => `${full} 최상의 컨디션 회복을 돕는 프리미엄 출장 마사지. ${loc} 인근의 투명한 가격과 믿을 수 있는 힐러 정보를 제공합니다.`,
  (loc: string, full: string) => `${full} 내 공간에서 누리는 VIP 출장 방문 마사지. ${loc} 지역 주민들이 추천하는 시원한 타이 및 부드러운 스웨디시 프로그램.`,
  (loc: string, full: string) => `${full} 고품격 출장마사지 제휴 안내. ${loc} 주변의 철저한 위생과 친절한 마인드를 갖춘 테라피스트 코스를 확인하세요.`,
  (loc: string, full: string) => `${full} 지친 몸을 이완시켜 주는 출장 홈케어 마사지. ${loc} 지역에서 빠르고 편안하게 만나는 릴렉싱 바디 트리트먼트.`,
  (loc: string, full: string) => `${full} 언제든 편하게 확인하는 ${loc} 출장마사지 제휴점 리스트. 정직하고 합리적인 비용으로 힐링을 선물하세요.`,
  (loc: string, full: string) => `${full} 맞춤형 딥티슈 및 출장 아로마 마사지 정보. ${loc} 인근 샵들의 실제 이용 코스와 혜택을 메트로힐에서 큐레이션합니다.`,
  (loc: string, full: string) => `${full} 전신 순환을 돕는 고품격 출장마사지 테라피. ${loc} 지역 내 빠른 방문이 가능한 안심 제휴 업소를 총망라했습니다.`,
  (loc: string, full: string) => `${full} 편안한 휴식의 완성, 출장 방문 홈케어 마사지. ${loc}에서 엄선된 테라피스트들의 섬세한 힐링 케어를 만나보세요.`,
  (loc: string, full: string) => `${full} 투명한 정찰제로 운영되는 ${loc} 출장마사지 예약 안내. 피로에 지친 하루를 달래줄 전문 스웨디시 코스 추천.`,
  (loc: string, full: string) => `${full} 최고급 에센셜 오일을 활용한 출장 아로마 마사지. ${loc} 어디서나 프라이빗하게 누릴 수 있는 특별한 홈케어 서비스.`,
  (loc: string, full: string) => `${full} 전문적인 손길이 필요할 때, ${loc} 출장마사지 전문 제휴 샵을 찾아보세요. 안전하고 쾌적한 힐링 시간을 보장합니다.`,
  (loc: string, full: string) => `${full} 굳은 근육을 풀어주는 정통 출장 타이 마사지. ${loc} 지역 내 신뢰도 높은 업체들의 상세한 프로그램 요금표 제공.`,
  (loc: string, full: string) => `${full} 스트레스 없는 편안한 휴식을 위한 출장 홈케어 마사지. ${loc} 전용 맞춤형 바디 릴렉스 프로그램을 지금 바로 확인하세요.`,
  (loc: string, full: string) => `${full} 명품 스웨디시 출장마사지 안내. ${loc} 주변의 철저히 검증된 제휴점에서 제공하는 부드럽고 따뜻한 감성 테라피.`,
  (loc: string, full: string) => `${full} 메트로힐이 추천하는 ${loc} 베스트 출장 방문 마사지. 꼼꼼한 관리로 일상의 활력을 되찾아주는 특별한 바디 케어.`,
  (loc: string, full: string) => `${full} 고객 맞춤형 힐링 큐레이션! ${loc} 지역 안심 출장마사지 및 홈케어 제휴 정보를 한눈에 비교하고 선택해 보세요.`
];

// 40(Title) * 25(Desc) = 1000개의 고유 조합 배열 생성
const SEO_PATTERNS = Array.from({ length: 1000 }, (_, i) => {
  const titleFunc = titleTemplates[i % 40];
  const descFunc = descTemplates[Math.floor(i / 40) % 25];
  return { title: titleFunc, desc: descFunc };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { region, district } = resolvedParams;

  const districtName = safeDecode(district);
  const regionName = region === "seoul" ? "서울" : region === "incheon" ? "인천" : "경기";

  const locationKeyword = `${regionName} ${districtName}`.trim();

  // 구 단위 고유 해시값을 통해 0~999 중 1000개의 패턴을 균등 분배
  const charSum = (locationKeyword + region)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = Math.abs(charSum) % 1000;

  const pattern = SEO_PATTERNS[variantIndex];
  const finalTitle = pattern.title(districtName);
  const finalDescription = pattern.desc(districtName, locationKeyword);

  const canonicalUrl = `https://metroheal.netlify.app/massage/${region}/${encodeURIComponent(districtName)}`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `${districtName} 마사지`,
      `${districtName} 출장마사지`,
      `${districtName} 스웨디시`,
      `${districtName} 아로마테라피`,
      `${locationKeyword} 홈케어`,
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

export default async function RegionalDistrictPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { region, district } = resolvedParams;

  const districtName = safeDecode(district);
  const regionName = region === "seoul" ? "서울특별시" : region === "incheon" ? "인천광역시" : "경기도";
  const fullTitle = `${regionName} ${districtName}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${fullTitle} 힐링 바디 테라피 제휴 안내 - 메트로힐`,
    "description": `${fullTitle} 지역 아로마 테라피, 타이, 스웨디시 및 출장 마사지 제휴업체 정보 안내`,
    "url": `https://metroheal.netlify.app/massage/${region}/${encodeURIComponent(districtName)}`,
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
              {fullTitle} 바디 테라피 및 방문 마사지 안내
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
              {fullTitle} 고객님을 위한 프리미엄 바디 웰니스 가이드입니다. 검증된 타이·아로마·스웨디시 제휴 샵 코스와 편안한 홈케어 정보를 확인해 보세요.
            </p>
          </div>
        </section>

        {/* 구 단위 컴포넌트 호출 (dongName은 빈 값 전달) */}
        <ClientTextMixer region={region} district={districtName} dongName="" />

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