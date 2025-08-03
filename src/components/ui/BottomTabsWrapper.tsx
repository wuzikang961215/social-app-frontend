"use client";

import dynamic from 'next/dynamic';

const BottomTabs = dynamic(() => import('./BottomTabs'), {
  ssr: false
});

export default function BottomTabsWrapper() {
  return <BottomTabs />;
}