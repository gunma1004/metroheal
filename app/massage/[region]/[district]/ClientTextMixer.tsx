// ClientTextMixer.tsx 예시
"use client";

import Link from "next/link";

interface Props {
  region: string;
  district: string;
  dongName?: string;
}

export default function ClientTextMixer({ region, district, dongName }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs text-amber-400 font-bold tracking-widest uppercase">RECOMMENDED PARTNERS</p>
        <h2 className="text-xl md:text-2xl font-black text-white mt-1">
          {district} {dongName} 추천 제휴업체
        </h2>
      </div>
      {/* 샵 리스트 내용 */}
    </div>
  );
}