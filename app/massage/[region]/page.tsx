import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    region?: string;
    city?: string;
    district?: string;
    id?: string;
    shopId?: string;
  }>;
}

// 🌐 영문 시/도 코드를 한글명으로 변환
function getRegionFullName(region?: string): string {
  switch (region?.toLowerCase()) {
    case "seoul": return "서울";
    case "gyeonggi": return "경기";
    case "incheon": return "인천";
    default: return region || "";
  }
}

// 🛠️ 이중 디코딩 방어 함수
function safeDecode(str?: string): string {
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

function parseLocationText(region?: string, city?: string, district?: string): string {
  const regionName = getRegionFullName(region);
  const targetLoc = city || district;
  const decodedLoc = safeDecode(targetLoc);
  return `${regionName} ${decodedLoc}`.replace(/\s+/g, " ").trim();
}

// 📌 본문에는 '출장' 및 스팸 키워드를 완전히 제거한 순수 샵 데이터
const shopData: Record<string, {
  name: string;
  cleanName: string;
  phone: string;
  badge: string;
  image: string;
  desc: string;
  courses: { name: string; time: string; price: string; desc: string }[];
  features: string[];
}> = {
  "1": {
    name: "🔥 한국미녀테라피",
    cleanName: "한국미녀테라피",
    phone: "0507-1280-3299",
    badge: "실시간 만족도 1위",
    image: "/shop1.jpg",
    desc: "수도권 전지역 신속 방문 홈케어! 타이 마사지, 아로마 마사지, 릴렉스 마사지 전문 제휴처입니다. 숙련된 테라피스트가 편안한 공간으로 직접 찾아가 굳은 근육과 묵은 피로를 시원하게 풀어드립니다.",
    courses: [
      { name: "릴렉스 마사지 (기본)", time: "60분", price: "110,000원", desc: "뭉친 어깨와 등 근육을 부드럽게 이완시키는 맞춤형 릴렉스 마사지 코스" },
      { name: "아로마 마사지 (순환)", time: "90분", price: "130,000원", desc: "천연 에센셜 오일을 사용하여 전신 혈액순환과 피로 해소를 돕는 프리미엄 아로마 마사지" },
      { name: "스웨디시 릴렉스 마사지", time: "60분", price: "140,000원", desc: "감성적인 터치로 심신을 포근하게 녹여주는 최고급 스웨디시 릴렉스 마사지" },
      { name: "VIP 타이 & 아로마 풀코스", time: "90분", price: "180,000원", desc: "시원한 타이 스트레칭과 부드러운 아로마 관리를 결합한 전신 올인원 마사지" }
    ],
    features: ["100% 후불제 안심결제", "24시간 365일 연중무휴", "수도권 전지역 빠른 방문", "철저한 위생 및 방역 관리"]
  },
  "2": {
    name: "✨ 오늘밤테라피",
    cleanName: "오늘밤테라피",
    phone: "0507-1280-3191",
    badge: "재방문율 최우수",
    image: "/shop2.jpg",
    desc: "지친 하루의 피로를 말끔히 풀어드리는 1:1 방문 홈케어! 타이 마사지부터 아로마 마사지까지 원하는 장소에서 편안하게 정통 힐링을 누려보세요.",
    courses: [
      { name: "타이 마사지 (베이직)", time: "60분", price: "60,000원", desc: "전신 근육을 시원하게 스트레칭하여 가볍고 개운한 몸을 만드는 타이 마사지" },
      { name: "아로마 마사지 (소프트)", time: "60분", price: "80,000원", desc: "향기로운 천연 오일과 부드러운 압으로 신체 긴장을 완화하는 아로마 마사지" },
      { name: "릴렉스 마사지 (감성힐링)", time: "60분", price: "90,000원", desc: "지친 심신에 온전한 안식과 숙면을 유도하는 감성 충만 릴렉스 마사지" },
      { name: "VVIP 스페셜 마사지", time: "60분", price: "100,000원", desc: "타이와 아로마의 장점을 결합하여 전신 피로를 완벽하게 날려주는 코스" },
      { name: "한국인 전문 힐러 릴렉스 마사지", time: "60분", price: "140,000원", desc: "베테랑 한국인 관리사의 디테일하고 품격 있는 1:1 맞춤 릴렉스 마사지" }
    ],
    features: ["선입금 없는 100% 후불제", "친절 마인드 전문 힐러 상주", "간편 결제 지원"]
  },
  "3": {
    name: "💎 주주홈타이",
    cleanName: "주주홈타이",
    phone: "0507-1280-3180",
    badge: "24시 상시 할인",
    image: "/shop3.jpg",
    desc: "재방문율 1위 만족도! 정통 타이 마사지와 림프 순환을 돕는 아로마 마사지로 굳어있던 몸을 유연하고 활력 넘치게 회복시켜 드립니다.",
    courses: [
      { name: "스탠다드 정통 타이 마사지", time: "60분", price: "60,000원", desc: "머리부터 발끝까지 뭉친 근육을 시원하게 풀어주는 정통 타이 마사지" },
      { name: "프리미엄 딥티슈 아로마 마사지", time: "90분", price: "90,000원", desc: "근육 결을 따라 부드럽게 속근육 깊은 곳까지 풀어주는 아로마 마사지" },
      { name: "VIP 시그니처 롱타임 마사지", time: "120분", price: "120,000원", desc: "2시간 동안 타이 마사지와 아로마 마사지를 여유롭게 누리는 풀코스" }
    ],
    features: ["선입금 0원 100% 후불제", "평균 방문 보장", "개인정보 완벽 보호"]
  },
  "4": {
    name: "🌟 한국골든테라피",
    cleanName: "한국골든테라피",
    phone: "0507-1280-3361",
    badge: "젊은 감성 베테랑",
    image: "/shop4.jpg",
    desc: "베테랑 테라피스트들의 1:1 방문 케어! 릴렉스 마사지와 전신 아로마 마사지로 품격 있는 힐링을 선사합니다.",
    courses: [
      { name: "릴렉스 마사지 (건식)", time: "60분", price: "60,000원", desc: "원하는 피로 부위를 집중적으로 시원하게 풀어주는 맞춤형 릴렉스 마사지" },
      { name: "천연 순환 아로마 마사지", time: "60분", price: "70,000원", desc: "천연 아로마 오일로 전신 혈액순환과 피부 보습을 돕는 아로마 마사지" },
      { name: "VIP 감성 릴렉스 마사지", time: "60분", price: "100,000원", desc: "부드러운 림프 순환 케어로 몸을 가볍게 만들어주는 스웨디시 릴렉스 마사지" },
      { name: "한국인 전문 관리사 VIP 풀코스", time: "60분", price: "150,000원", desc: "최상의 휴식과 컨디션 회복을 선사하는 고품격 시그니처 마사지" }
    ],
    features: ["젊고 세련된 감성 테라피", "100% 후불 결제", "24시간 상시 대기"]
  },
  "5": {
    name: "👑 퀸즈홈테라피",
    cleanName: "퀸즈홈테라피",
    phone: "0507-1280-3222",
    badge: "인기도 TOP 5",
    image: "/shop5.jpg",
    desc: "정직한 정찰제 가격으로 편안하게 받아보는 타이 마사지, 아로마 마사지, 릴렉스 마사지 프로그램.",
    courses: [
      { name: "컨디션 케어 타이 마사지", time: "60분", price: "60,000원", desc: "지친 몸의 피로를 시원한 스트레칭으로 해소하는 정통 타이 마사지" },
      { name: "스페셜 릴렉스 아로마 마사지", time: "60분", price: "70,000원", desc: "향긋한 아로마 오일과 부드러운 손길로 진행되는 전신 아로마 마사지" },
      { name: "콤비네이션 릴렉스 마사지", time: "90분", price: "120,000원", desc: "타이 마사지와 아로마 마사지를 한 번에 경험하는 밸런스 힐링 코스" },
      { name: "👑 한국인 전담 관리사 스페셜 코스", time: "60분", price: "140,000원", desc: "전문 관리사의 섬세한 1:1 맞춤 피로 회복 전신 마사지" }
    ],
    features: ["100% 후불제", "신속한 방문", "고객 만족도 최상"]
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const targetId = resolvedParams.id || resolvedParams.shopId || "1";
  const shop = shopData[targetId] || shopData["1"];

  const currentRegion = parseLocationText(resolvedParams.region, resolvedParams.city, resolvedParams.district);

  const charSum = (currentRegion + shop.cleanName + targetId + "metroheal_seo").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = charSum % 30;

  // [규칙 1] Title: '출장'과 '마사지'가 분산 배치됨 (스팸 제외)
  const titleVariants = [
    `${currentRegion} 지역 맞춤형 출장 서비스 타이 마사지 안내 - ${shop.cleanName}`,
    `${currentRegion} 전문 출장 방문 가능한 아로마 마사지 제휴점 · ${shop.cleanName}`,
    `${currentRegion} 프라이빗 출장 홈케어 릴렉스 케어 마사지 추천 코스`,
    `${currentRegion} 안심 출장 서비스 스웨디시 프로그램 마사지 1:1 안내`,
    `${currentRegion} 신속 출장 배차 전신 힐링 테라피 마사지 24시 예약`,
    `${currentRegion} 최고급 출장 테라피 딥티슈 바디 마사지 피로회복 가이드`,
    `${currentRegion} 정찰제 출장 방문 홈케어 바디 케어 마사지 정보`,
    `${currentRegion} 맞춤형 출장 서비스 릴렉스 프로그램 마사지 안내`,
    `${currentRegion} 건식 및 출장 아로마 케어 마사지 제휴샵 총정리`,
    `${currentRegion} 24시간 출장 방문 프리미엄 감성 테라피 마사지 플랫폼`,
    `${currentRegion} 힐링 출장 서비스 순환 케어 전문 샵 마사지 가이드`,
    `${currentRegion} 스트레스 해소 출장 방문 힐링 코스 마사지 추천`,
    `${currentRegion} 1인 프라이빗 출장 맞춤형 바디 마사지 서비스`,
    `${currentRegion} 바디 밸런스 출장 홈케어 프로그램 마사지 안내`,
    `${currentRegion} 후불제 출장 방문 안심 전신 관리 마사지 · ${shop.cleanName}`,
    `${currentRegion} 림프 순환 출장 아로마 테라피 마사지 제휴점`,
    `${currentRegion} 프리미엄 출장 서비스 딥릴렉스 프로그램 마사지 코스`,
    `${currentRegion} 소프트 힐링 출장 바디 케어 마사지 안내`,
    `${currentRegion} 쾌적한 출장 방문 케어 프로그램 마사지 가이드`,
    `${currentRegion} 명품 출장 감성 스웨디시 힐링 테라피 마사지 정보`,
    `${currentRegion} 체형 맞춤형 출장 바디 케어 마사지 추천`,
    `${currentRegion} 심야 24시 출장 신속 방문 마사지 예약 센터`,
    `${currentRegion} 전문 테라피스트 출장 방문 케어 마사지 안내`,
    `${currentRegion} 정통 스트레칭 출장 타이 프로그램 마사지 제휴점`,
    `${currentRegion} 하이엔드 출장 감성 힐링 프로그램 마사지 플랫폼`,
    `${currentRegion} VVIP 출장 스페셜 풀케어 바디 마사지 안내`,
    `${currentRegion} 전신 피로회복 출장 힐링 테라피 마사지`,
    `${currentRegion} 안심 출장 방문 릴렉싱 프로그램 마사지 가이드`,
    `${currentRegion} 천연 에센셜 오일 출장 케어 마사지 정보`,
    `${currentRegion} 시그니처 출장 웰니스 바디 마사지 추천 코스`
  ];

  // [규칙 2] Description: '출장마사지' 키워드를 붙여서 포함
  const descriptionVariants = [
    `${currentRegion} 24시 신속 방문 출장마사지 전문 ${shop.cleanName}. 선입금 없는 100% 후불제로 안심하고 이용하세요.`,
    `${currentRegion} 전지역 출장마사지 제휴 안내. 최고급 천연 오일로 전신 피로를 부드럽게 풀어드립니다.`,
    `${currentRegion} 맞춤형 출장마사지 솔루션. 숙련된 테라피스트의 손길로 지친 일상의 활력을 되찾아보세요.`,
    `${currentRegion} 출장마사지 예약 가이드. 프라이빗한 공간에서 온전한 쉼과 휴식을 선사하는 ${shop.cleanName}.`,
    `${currentRegion} 방문 힐링 출장마사지 프로그램. 정직한 정찰제 요금과 신속한 방문 배차 시스템을 제공합니다.`,
    `${currentRegion} 출장마사지 딥티슈 피로회복 안내. 굳은 근육을 시원하고 부드럽게 이완시키는 전문 바디케어.`,
    `${currentRegion} 내 공간에서 편안하게 누리는 출장마사지 홈케어. ${shop.cleanName}에서 지금 확인하세요.`,
    `${currentRegion} 1:1 커스텀 출장마사지 제휴처. 청결하고 쾌적한 힐링 서비스를 약속드립니다.`,
    `${currentRegion} 건식 스트레칭 및 아로마 복합 출장마사지 코스 안내. 투명한 요금과 친절한 상담 상시 대기 중.`,
    `${currentRegion} 프리미엄 감성 출장마사지 24시간 안내. ${shop.cleanName}의 정성스러운 바디 밸런스 케어.`,
    `${currentRegion} 순환 케어 중심의 출장마사지 프로그램. 림프 흐름을 원활하게 돕는 체계적인 바디 관리.`,
    `${currentRegion} 스트레스 해소에 특화된 출장마사지 힐링. 지친 심신에 활력을 불어넣어 주는 전문 힐러 방문.`,
    `${currentRegion} 프라이빗 1인 맞춤 출장마사지. 이동의 번거로움 없이 편안한 휴식 시간을 누려보세요.`,
    `${currentRegion} 바디 밸런스 회복 출장마사지 제휴샵 ${shop.cleanName}. 철저한 위생 관리와 품격 있는 서비스.`,
    `${currentRegion} 안심 후불 결제 시스템으로 믿고 부르는 출장마사지. 예약금이나 선입금을 절대 요구하지 않습니다.`,
    `${currentRegion} 은은한 향기와 함께하는 출장마사지 아로마. 숙련된 관리사의 디테일한 손길을 경험하세요.`,
    `${currentRegion} 딥릴렉스 테라피로 피로를 날려주는 출장마사지. 신속하고 안전한 방문 서비스를 제공합니다.`,
    `${currentRegion} 소프트한 감성 터치로 힐링을 드리는 출장마사지 바디 케어. 지친 하루 끝 완벽한 릴렉싱.`,
    `${currentRegion} 쾌적하고 안심할 수 있는 출장마사지 서비스. ${shop.cleanName}이 정성을 다해 케어해 드립니다.`,
    `${currentRegion} 최고급 명품 스웨디시 출장마사지 가이드. 감미로운 터치와 포근한 휴식의 만남.`,
    `${currentRegion} 고객 체형에 맞춘 커스텀 출장마사지. 뭉친 부위를 정확히 파악하여 개운하게 풀어드립니다.`,
    `${currentRegion} 심야 시간에도 신속하게 달려가는 24시 출장마사지. 수도권 전지역 빠른 도착 보장.`,
    `${currentRegion} 베테랑 전문 테라피스트의 품격 있는 출장마사지. 믿을 수 있는 1:1 방문 케어.`,
    `${currentRegion} 뻐근한 몸을 시원하게 늘려주는 정통 스트레칭 출장마사지 타이 코스.`,
    `${currentRegion} 하이엔드 감성 힐링 출장마사지 안내. 섬세한 테크닉으로 전신 긴장을 완벽 해소합니다.`,
    `${currentRegion} VVIP 전신 올인원 출장마사지 코스. 타이와 아로마를 동시에 누리는 프리미엄 패키지.`,
    `${currentRegion} 묵은 피로를 말끔히 비워내는 힐링 출장마사지. 내 집에서 편안하게 즐기는 고품격 스파.`,
    `${currentRegion} 안심 방문 릴렉싱 출장마사지 제휴처 ${shop.cleanName}. 친절하고 정직한 서비스 제공.`,
    `${currentRegion} 천연 아로마 에센셜 오일로 피부까지 케어하는 프리미엄 출장마사지 프로그램.`,
    `${currentRegion} 일상의 품격을 높여주는 시그니처 웰니스 출장마사지. 언제 어디서나 편안하게 예약하세요.`
  ];

  const pageTitle = titleVariants[variantIndex];
  const pageDescription = descriptionVariants[variantIndex];

  const targetLocParam = resolvedParams.city || resolvedParams.district || "";

  return {
    title: {
      absolute: pageTitle,
    },
    description: pageDescription,
    alternates: {
      canonical: `https://metroheal.netlify.app/massage/${resolvedParams.region}/${encodeURIComponent(safeDecode(targetLocParam))}/shop/${targetId}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://metroheal.netlify.app/massage/${resolvedParams.region}/${encodeURIComponent(safeDecode(targetLocParam))}/shop/${targetId}`,
      siteName: "메트로힐",
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function CityShopDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const targetId = resolvedParams.id || resolvedParams.shopId || "1";
  const shop = shopData[targetId] || shopData["1"];

  const currentRegion = parseLocationText(resolvedParams.region, resolvedParams.city, resolvedParams.district);
  const targetLocParam = resolvedParams.city || resolvedParams.district || "";

  return (
    <div className="bg-[#050505] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-28">
      
      {/* 상단 서브 헤더 */}
      <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3.5 shadow-[0_4px_20px_rgba(245,158,11,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                메트로힐
              </span>
              <span className="text-[9px] text-gray-400 tracking-tighter">METRO HEAL PARTNER</span>
            </div>
          </Link>
          
          <Link 
            href={`/massage/${resolvedParams.region}/${encodeURIComponent(safeDecode(targetLocParam))}`}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
          >
            ← {safeDecode(targetLocParam)} 목록
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* 대표 비주얼 카드 */}
        <section className="bg-[#121214] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="relative h-64 md:h-80 w-full overflow-hidden bg-neutral-900">
            <img 
              src={shop.image} 
              alt={`${currentRegion} 마사지 - ${shop.cleanName}`} 
              className="w-full h-full object-cover filter brightness-[0.7]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30"></div>
            <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
              {shop.badge}
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-4 -mt-8 relative z-10">
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-400 text-xs font-bold">
              📍 {currentRegion} 타이·아로마·릴렉스 마사지 24시 신속 방문
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white">
              {currentRegion} 마사지 24시 안내 - <span className="text-amber-400">{shop.cleanName}</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-black/50 p-4 rounded-2xl border border-white/5">
              {shop.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {shop.features.map((feat, idx) => (
                <div key={idx} className="bg-black/60 border border-amber-500/20 px-3 py-2 rounded-xl text-center text-[11px] font-bold text-amber-300">
                  ✓ {feat}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 상세 코스 및 요금 안내 */}
        <section className="bg-[#0d0d0f] border border-amber-500/20 p-6 md:p-8 rounded-3xl space-y-6">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">PROGRAM & PRICE</span>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              💎 {currentRegion} 타이·아로마·릴렉스 마사지 코스 및 요금 안내
            </h2>
          </div>

          <div className="space-y-4">
            {shop.courses.map((course, idx) => (
              <div key={idx} className="bg-black/60 border border-white/10 hover:border-amber-500/40 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-3 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/30">
                      {course.time}
                    </span>
                    <h3 className="font-extrabold text-white text-base md:text-lg">{course.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{course.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 inline-block">
                    {course.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 안심 이용 안내 */}
        <section className="bg-black/80 p-5 rounded-2xl border border-white/10">
          <h3 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-1.5">
            <span>📌</span> {currentRegion} 마사지 안심 이용 안내
          </h3>
          <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
            <li>모든 제휴 업체는 <strong>100% 현장 후불제</strong>로만 운영되며, 사전 선입금이나 예약금을 절대 요구하지 않습니다.</li>
            <li>원하시는 시간 20~30분 전에 문의해 주시면 타이 마사지, 아로마 마사지, 릴렉스 마사지 전문 테라피스트가 신속하게 방문합니다.</li>
          </ul>
        </section>

      </main>

      {/* 하단 고정 전화 / 문자 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#08080a]/95 backdrop-blur-xl border-t border-amber-500/30 p-3 md:p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
          <a 
            href={`tel:${shop.phone}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3.5 rounded-2xl text-xs md:text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-transform active:scale-95"
          >
            <span className="text-lg">📞</span> 전화로 즉시예약
          </a>
          <a 
            href={`sms:${shop.phone}?body=${encodeURIComponent(`[${currentRegion}]${shop.cleanName} 마사지 예약 문의드립니다. (메트로힐 보고 연락드렸어요)`)}`}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-black py-3.5 rounded-2xl text-xs md:text-sm border border-white/10 hover:border-amber-500/40 transition-transform active:scale-95"
          >
            <span className="text-lg">💬</span> 간편 문자상담
          </a>
        </div>
      </div>

    </div>
  );
}