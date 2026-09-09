import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    region?: string;
  }>;
}

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
    desc: "수도권 전역 신속 방문! 지친 일상을 깨우는 정성 가득한 1:1 맞춤 출장마사지 & 감성 테라피. 최고급 베테랑 힐러진이 고객님의 프라이빗 공간으로 찾아갑니다.",
    courses: [
      { name: "20대 감성 스웨디시 출장마사지 A", time: "60분", price: "110,000원", desc: "뭉친 근육과 피로를 집중적으로 풀어주는 기본 건식 릴렉싱" },
      { name: "20대 감성 스웨디시 출장마사지 B", time: "90분", price: "130,000원", desc: "여유로운 시간 동안 전신 이완과 활력을 더해주는 추천 코스" },
      { name: "한국 VIP 스웨디시 출장마사지 A", time: "60분", price: "140,000원", desc: "최고급 천연 아로마 오일로 전신을 부드럽게 케어하는 힐링 코스" },
      { name: "한국 VIP 스웨디시 출장마사지 풀케어", time: "90분", price: "180,000원", desc: "건식 릴렉스 + 프리미엄 오일 + 딥티슈 집중 관리가 결합된 VIP 코스" }
    ],
    features: ["100% 후불제 안심결제", "24시간 365일 연중무휴", "수도권 전지역 25분 칼도착", "위생 및 방역 관리 철저"]
  },
  "2": {
    name: "✨ 오늘밤테라피",
    cleanName: "오늘밤테라피",
    phone: "0507-1280-3191",
    badge: "재방문율 최우수",
    image: "/shop2.jpg",
    desc: "품격 있는 힐링을 선사하는 프라이빗 방문 출장마사지! 최고급 천연 오일과 섬세한 바디 테라피로 특별한 휴식을 선사합니다.",
    courses: [
      { name: "맞춤형 바디 건식케어 출장마사지", time: "60분", price: "60,000원", desc: "부담 없이 가볍게 상/하체 피로를 푸는 실속 코스" },
      { name: "스페셜 아로마 테라피 출장마사지", time: "60분", price: "80,000원", desc: "부드러운 오일 압으로 스트레스와 피로를 완화하는 코스" },
      { name: "VIP 감성힐링 스웨디시 출장마사지", time: "60분", price: "90,000원", desc: "부드럽고 섬세한 터치로 전신 긴장을 해소하는 인기 코스" },
      { name: "VVIP 스페셜 풀코스 출장마사지", time: "60분", price: "100,000원", desc: "전신 피로를 완벽하게 날려주는 최고급 스페셜 케어" },
      { name: "한국인 전문 힐러 스웨디시 출장마사지", time: "60분", price: "140,000원", desc: "숙련된 한국인 관리사의 1:1 맞춤형 딥 릴렉싱 케어" }
    ],
    features: ["100% 후불제 안심결제", "친절 마인드 힐러 상시 대기", "카드/현금/계좌이체 가능"]
  },
  "3": {
    name: "💎 주주홈타이",
    cleanName: "주주홈타이",
    phone: "0507-1280-3180",
    badge: "24시 상시 할인",
    image: "/shop3.jpg",
    desc: "재방문율 1위! 칼도착 25분 보장, 철저한 위생 관리와 정통 타이 기법을 결합한 럭셔리 출장마사지 서비스입니다.",
    courses: [
      { name: "스탠다드 정통 타이 출장마사지", time: "60분", price: "60,000원", desc: "전신 스트레칭 중심의 뻐근함 해소 릴렉싱 케어" },
      { name: "프리미엄 딥티슈 아로마 출장마사지", time: "90분", price: "90,000원", desc: "피부 자극 없이 뭉친 속근육 깊은 곳까지 풀어주는 테라피" },
      { name: "VIP 럭셔리 시그니처 출장마사지", time: "120분", price: "120,000원", desc: "머리부터 발끝까지 2시간 동안 집중 케어하는 풀코스" }
    ],
    features: ["선입금 0원 100% 후불제", "평균 25분 방문 보장", "개인정보 완벽 보호"]
  },
  "4": {
    name: "🌟 한국골든테라피",
    cleanName: "한국골든테라피",
    phone: "0507-1280-3361",
    badge: "젊은 감성 베테랑",
    image: "/shop4.jpg",
    desc: "베테랑 테라피스트들의 1:1 맞춤형 VIP 피로회복 솔루션! 수도권 전지역 어디서나 만나는 품격 있는 방문 출장마사지.",
    courses: [
      { name: "건식 릴렉싱 힐링 출장마사지", time: "60분", price: "60,000원", desc: "원하는 부위를 집중적으로 풀어주는 맞춤형 릴렉싱 코스" },
      { name: "천연 아로마 순환 케어 출장마사지", time: "60분", price: "70,000원", desc: "은은한 에센셜 아로마와 함께 전신 혈액순환을 돕는 테라피" },
      { name: "VIP 스페셜 감성 출장마사지", time: "60분", price: "100,000원", desc: "부드럽게 림프 순환을 돕는 프리미엄 감성 스웨디시 케어" },
      { name: "한국 전문 관리사 VIP 풀코스", time: "60분", price: "150,000원", desc: "최상의 휴식과 힐링을 선사하는 고품격 시그니처 코스" }
    ],
    features: ["젊고 세련된 감성 테라피", "100% 후불 결제", "24시간 항시 대기"]
  },
  "5": {
    name: "👑 퀸즈홈테라피",
    cleanName: "퀸즈홈테라피",
    phone: "0507-1280-3222",
    badge: "인기도 TOP 5",
    image: "/shop5.jpg",
    desc: "수도권 전지역 평균 25분 신속 도착! 정직한 100% 후불제 운영과 검증된 매니저들의 프리미엄 바디 밸런스 출장마사지.",
    courses: [
      { name: "온도 타이 릴렉스 출장마사지", time: "60분", price: "60,000원", desc: "지친 피로를 깔끔하게 해소하는 기본 건식 힐링 케어" },
      { name: "온도 스페셜 아로마 출장마사지", time: "60분", price: "70,000원", desc: "향기로운 천연 오일과 함께하는 부드러운 전신 릴렉싱" },
      { name: "온도 스페셜 콤비네이션 출장마사지", time: "90분", price: "120,000원", desc: "스트레칭과 아로마 케어가 결합된 밸런스 힐링 코스" },
      { name: "👑 한국인 전담 관리사 스페셜 코스", time: "60분", price: "140,000원", desc: "전신 집중 케어와 함께하는 완벽한 힐링 피로 회복 코스" }
    ],
    features: ["100% 후불제", "수도권 전지역 빠른 도착", "고객 만족도 최상"]
  }
};

// 🌟 [지역명] 출장마사지 24시 안내 - [상호명] 구조로 생성
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const search = searchParams ? await searchParams : undefined;
  const shop = shopData[id] || shopData["1"];

  // 지역 파라미터(?region=강남구 등) 우선 반영, 없으면 '수도권'
  const currentRegion = search?.region ? decodeURIComponent(search.region) : "수도권";

  // 요청하신 타이틀 형식: 강남구 출장마사지 24시 안내 - 한국미녀테라피
  const pageTitle = `${currentRegion} 출장마사지 24시 안내 - ${shop.cleanName}`;
  const description = `${currentRegion} 24시 신속 방문 출장마사지 전문 ${shop.cleanName}! 타이·스웨디시·아로마 프로그램 및 코스별 정찰제 요금 안내.`;

  return {
    title: {
      absolute: pageTitle, // layout의 template("%s | 메트로힐")을 무시하고 요청 형태 그대로 브라우저에 출력
    },
    description,
    keywords: [
      `${currentRegion} 출장마사지`,
      `${currentRegion} 24시 출장마사지`,
      `${currentRegion} ${shop.cleanName}`,
      `${shop.cleanName} 출장마사지`,
      `${currentRegion} 홈타이`,
      `${currentRegion} 방문마사지`
    ],
    alternates: {
      canonical: `https://metroheal.netlify.app/shop/${id}${search?.region ? `?region=${encodeURIComponent(search.region)}` : ""}`,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `https://metroheal.netlify.app/shop/${id}${search?.region ? `?region=${encodeURIComponent(search.region)}` : ""}`,
      siteName: "메트로힐",
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function ShopDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = searchParams ? await searchParams : undefined;
  const shop = shopData[id];

  if (!shop) {
    notFound();
  }

  const currentRegion = search?.region ? decodeURIComponent(search.region) : "수도권";

  // 주요 거점 지역 리스트 (크롤러 색인 및 내부 링크용)
  const majorRegions = [
    { name: "강남구", slug: "강남구" },
    { name: "서초구", slug: "서초구" },
    { name: "송파구", slug: "송파구" },
    { name: "마포구", slug: "마포구" },
    { name: "영등포구", slug: "영등포구" },
    { name: "수원시", slug: "수원시" },
    { name: "성남시", slug: "성남시" },
    { name: "분당구", slug: "분당구" },
    { name: "일산", slug: "고양시" },
    { name: "부천시", slug: "부천시" },
    { name: "용인시", slug: "용인시" },
    { name: "안양시", slug: "안양시" },
    { name: "인천 부평", slug: "부평구" },
    { name: "인천 송도", slug: "연수구" },
    { name: "인천 구월", slug: "남동구" },
  ];

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
          
          <Link href="/" className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all">
            🏠 메인으로
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* 대표 비주얼 카드 */}
        <section className="bg-[#121214] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="relative h-64 md:h-80 w-full overflow-hidden bg-neutral-900">
            <img 
              src={shop.image} 
              alt={`${currentRegion} 출장마사지 - ${shop.cleanName}`} 
              className="w-full h-full object-cover filter brightness-[0.7]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30"></div>
            <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
              {shop.badge}
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-4 -mt-8 relative z-10">
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-400 text-xs font-bold">
              📍 {currentRegion} 출장마사지 24시 신속 방문
            </div>

            {/* 본문 제목도 동일한 SEO 구조 적용 */}
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {currentRegion} 출장마사지 24시 안내 - <span className="text-amber-400">{shop.cleanName}</span>
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
              💎 {currentRegion} 출장마사지 코스 및 요금 안내
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

        {/* 지역별 빠른 연결 링크 */}
        <section className="bg-neutral-950 p-6 rounded-3xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              🗺️ {shop.cleanName} 주요 거점 출장마사지 빠른 연결
            </h3>
            <span className="text-[10px] text-gray-500">24시간 신속 방문</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {majorRegions.map((reg, idx) => (
              <Link
                key={idx}
                href={`/shop/${id}?region=${encodeURIComponent(reg.slug)}`}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  currentRegion === reg.slug 
                    ? "bg-amber-500 text-black font-black border-amber-400" 
                    : "bg-black/40 text-gray-400 border-white/10 hover:border-amber-500/40 hover:text-white"
                }`}
              >
                {reg.name} 출장마사지
              </Link>
            ))}
          </div>
        </section>

        {/* 이용 안내 */}
        <section className="bg-black/80 p-5 rounded-2xl border border-white/10">
          <h3 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-1.5">
            <span>📌</span> {currentRegion} 출장마사지 안심 이용 안내
          </h3>
          <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
            <li>메트로힐 제휴 업체는 <strong>100% 현장 후불제</strong>로만 운영됩니다. 선입금이나 예약금을 절대 요구하지 않습니다.</li>
            <li>희망하시는 시간 20~30분 전에 문의 주시면 가장 가까운 테라피스트가 신속하게 방문합니다.</li>
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
            href={`sms:${shop.phone}?body=${encodeURIComponent(`[${currentRegion}] ${shop.cleanName} 출장마사지 예약 문의드립니다. (메트로힐 보고 연락드렸어요)`)}`}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-black py-3.5 rounded-2xl text-xs md:text-sm border border-white/10 hover:border-amber-500/40 transition-transform active:scale-95"
          >
            <span className="text-lg">💬</span> 간편 문자상담
          </a>
        </div>
      </div>

    </div>
  );
}