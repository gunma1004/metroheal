import { Metadata } from "next";
import MainClientUI from "./MainClientUI";

export const metadata: Metadata = {
  title: "메트로힐 | 서울·경기·인천 프리미엄 힐링 & 바디 테라피 플랫폼",
  description:
    "서울, 경기, 인천 전 지역 엄선된 웰니스 바디 케어, 아로마, 스웨디시 힐링 제휴 정보 안내. 내 주변 맞춤 테라피 샵을 메트로힐에서 간편하게 확인하세요.",
  keywords: [
    "메트로힐",
    "서울 테라피",
    "경기 테라피",
    "인천 테라피",
    "수도권 바디케어",
    "아로마 테라피",
    "스웨디시",
    "프라이빗 릴렉싱",
    "웰니스 플랫폼",
    "에스테틱 케어"
  ],
  alternates: {
    canonical: "https://metroheal.netlify.app",
  },
  openGraph: {
    title: "메트로힐 | 수도권 No.1 프리미엄 힐링 & 바디 테라피 가이드",
    description:
      "서울, 경기, 인천 전역의 검증된 전문 테라피·에스테틱 제휴 정보를 한눈에 비교하고 확인해보세요.",
    url: "https://metroheal.netlify.app",
    siteName: "메트로힐",
    locale: "ko_KR",
    type: "website",
  },
};

export default function Page() {
  return <MainClientUI />;
}