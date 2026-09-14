import { Metadata } from "next";
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

// 🌟 스팸 키워드 배제 클린 웰니스 SEO 패턴
const DONG_SEO_PATTERNS = [
  {
    title: (loc: string) => `${loc} 웰니스 마사지 제휴 안내 | 스웨디시 & 타이마사지`,
    desc: (loc: string) => `${loc} 인근 쾌적한 웰니스 마사지 제휴점 안내. 투명한 정찰제 가격과 릴렉스 바디케어 프로그램을 확인하세요.`
  },
  {
    title: (loc: string) => `${loc} 바디 힐링 테라피 추천 코스 가이드`,
    desc: (loc: string) => `체계적인 전신 스트레칭과 섬세한 압으로 피로를 풀어주는 ${loc} 웰니스 제휴 샵 상세 코스 비교.`
  },
  {
    title: (loc: string) => `${loc} 아로마 오일 테라피 & 바디케어 프로그램 안내`,
    desc: (loc: string) => `천연 에센셜 오일로 일상의 스트레스를 부드럽게 완화하는 ${loc} 추천 아로마 마사지 정보.`
  },
  {
    title: (loc: string) => `${loc} 정통 타이마사지 및 릴렉스 테라피 안내`,
    desc: (loc: string) => `굳은 근육을 편안하게 이완시켜 활력을 충전해 드리는 ${loc} 검증된 힐링 바디케어 제휴점.`
  }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { region, district, dong } = resolvedParams;

  const regionShort = getRegionShortName(region);
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const locationKeyword = `${regionShort} ${districtName} ${dongName}`.trim();

  const charSum = locationKeyword.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = Math.abs(charSum) % DONG_SEO_PATTERNS.length;

  const pattern = DONG_SEO_PATTERNS[variantIndex];
  const finalTitle = pattern.title(locationKeyword);
  const finalDescription = pattern.desc(locationKeyword);

  return {
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    alternates: {
      canonical: `https://metroheal.netlify.app/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `https://metroheal.netlify.app/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}`,
      siteName: "메트로힐",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function DongDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { region, district, dong } = resolvedParams;

  const regionFullName = getRegionFullName(region);
  const districtName = safeDecode(district);
  const dongName = safeDecode(dong);

  const fullLocation = `${regionFullName} ${districtName} ${dongName}`;
  const shortLocation = `${districtName} ${dongName}`;

  const dongShops = [
    {
      id: 1,
      name: `한국미녀테라피 (${dongName})`,
      desc: "지친 일상에 맞춤형 활력 충전! 전문 테라피스트의 정성 어린 감성 바디 테라피",
      phone: "0507-1280-3299",
      price: "110,000원부터~",
      image: "/shop1.jpg"
    },
    {
      id: 2,
      name: `오늘밤테라피 (${dongName})`,
      desc: "최고급 천연 아로마 오일을 활용한 전신 이완 및 림프 순환 케어 전문 프로그램",
      phone: "0507-1280-3191",
      price: "60,000원부터~",
      image: "/shop2.jpg"
    },
    {
      id: 3,
      name: `주주홈타이 (${dongName})`,
      desc: "재방문율 높은 안심 케어! 철저한 위생 관리와 품격 있는 정통 타이 & 릴렉싱",
      phone: "0507-1280-3180",
      price: "60,000원부터~",
      image: "/shop3.jpg"
    },
    {
      id: 4,
      name: `한국골든테라피 (${dongName})`,
      desc: "전문 힐러진의 맞춤형 바디 관리, 시간대별 편안한 VIP 피로회복 솔루션",
      phone: "0507-1280-3361",
      price: "60,000원부터~",
      image: "/shop4.jpg"
    },
    {
      id: 5,
      name: `퀸즈홈테라피 (${dongName})`,
      desc: "수도권 전지역 엄선된 파트너! 정직한 안내와 함께하는 프라이빗 힐링 테라피",
      phone: "0507-1280-3222",
      price: "60,000원부터~",
      image: "/shop5.jpg"
    }
  ];

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
            📍 {shortLocation} 웰니스 마사지 안내
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-2">
            {fullLocation} 고객님을 위한 힐링 바디케어 디렉토리입니다. 정직한 정찰제 요금표와 코스를 확인하세요.
          </p>
        </section>

        {/* 🌟 샵 리스트: 누르면 /seoul/강서구/발산1동/shop/1 로 이동 */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-amber-400 tracking-wider uppercase">
            🏆 {shortLocation} 추천 제휴점
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dongShops.map((shop) => (
              <div 
                key={shop.id} 
                className="bg-[#111114] border border-amber-500/20 hover:border-amber-500/60 rounded-2xl p-4 flex gap-4 items-center shadow-lg transition-all group relative"
              >
                {/* 🌟 동 기준 샵 상세 링크 */}
                <Link 
                  href={`/${region}/${encodeURIComponent(districtName)}/${encodeURIComponent(dongName)}/shop/${shop.id}`}
                  className="absolute inset-0 z-10" 
                  aria-label={`${shop.name} 코스 및 상세정보 보기`} 
                />

                <img 
                  src={shop.image} 
                  alt={shop.name} 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10 flex-shrink-0" 
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                    {shop.name}
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