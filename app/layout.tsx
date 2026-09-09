import type { Metadata } from "next";
import "./globals.css";
import NavigationHeader from "./NavigationHeader";

const SITE_URL = "https://metroheal.netlify.app";
const SITE_NAME = "메트로힐";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 서울·경기·인천 프리미엄 힐링 & 바디 테라피 플랫폼`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "서울·경기·인천 전 지역 엄선된 웰니스 바디 케어, 아로마, 스웨디시 힐링 샵 정보. 내 주변 테라피 샵 위치 및 코스 정보를 메트로힐에서 간편하게 확인하세요.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | 수도권 No.1 프리미엄 힐링 & 바디 케어 가이드`,
    description:
      "서울, 경기, 인천 전역의 검증된 전문 테라피·에스테틱 제휴 정보를 한눈에 비교하고 확인해보세요.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "768436618b4220619b86a6ca368bb858ce471561",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <NavigationHeader />
        {children}
      </body>
    </html>
  );
}