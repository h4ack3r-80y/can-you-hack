// High-quality inline SVG icon set (no emoji in UI).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: P, path: React.ReactNode) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden {...props}>{path}</svg>
  );
}

export const IconTerminal = (p: P) => base(p, <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>);
export const IconShield = (p: P) => base(p, <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>);
export const IconTarget = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>);
export const IconSearch = (p: P) => base(p, <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></>);
export const IconNetwork = (p: P) => base(p, <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><line x1="8" y1="7.5" x2="15.5" y2="7.5" /><line x1="7.2" y1="8.2" x2="10.8" y2="15.8" /><line x1="16.8" y1="8.2" x2="13.2" y2="15.8" /></>);
export const IconTrophy = (p: P) => base(p, <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 2 4.5 5 4.5M17 6h3a1 1 0 0 1 1 1c0 2.5-2 4.5-5 4.5" /></>);
export const IconChart = (p: P) => base(p, <><line x1="4" y1="20" x2="20" y2="20" /><rect x="6" y="12" width="3.4" height="8" rx="1" /><rect x="11" y="8" width="3.4" height="12" rx="1" /><rect x="16" y="4" width="3.4" height="16" rx="1" /></>);
export const IconUser = (p: P) => base(p, <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>);
export const IconLock = (p: P) => base(p, <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);
export const IconCheck = (p: P) => base(p, <polyline points="4 12.5 9.5 18 20 6.5" />);
export const IconBolt = (p: P) => base(p, <polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" />);
export const IconBook = (p: P) => base(p, <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></>);
export const IconFlag = (p: P) => base(p, <><path d="M5 22V4" /><path d="M5 4h13l-2.5 4L18 12H5" /></>);
export const IconAward = (p: P) => base(p, <><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></>);
export const IconHome = (p: P) => base(p, <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>);
export const IconCrown = (p: P) => base(p, <><path d="M3 18h18M4 17l-1-9 5 3 4-6 4 6 5-3-1 9z" /></>);
export const IconSun = (p: P) => base(p, <><circle cx="12" cy="12" r="4.5" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.5" y1="4.5" x2="6.5" y2="6.5" /><line x1="17.5" y1="17.5" x2="19.5" y2="19.5" /><line x1="4.5" y1="19.5" x2="6.5" y2="17.5" /><line x1="17.5" y1="6.5" x2="19.5" y2="4.5" /></>);
export const IconMoon = (p: P) => base(p, <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />);
export const IconMenu = (p: P) => base(p, <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>);
export const IconX = (p: P) => base(p, <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>);
export const IconArrowRight = (p: P) => base(p, <><line x1="4" y1="12" x2="20" y2="12" /><polyline points="13 5 20 12 13 19" /></>);
export const IconPlay = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><polygon points="10 8.5 15.5 12 10 15.5" fill="currentColor" stroke="none" /></>);
export const IconClock = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></>);
export const IconStar = (p: P) => base(p, <polygon points="12 2.5 14.9 8.6 21.5 9.5 16.7 14.1 18 20.6 12 17.4 6 20.6 7.3 14.1 2.5 9.5 9.1 8.6" />);
export const IconFingerprint = (p: P) => base(p, <><path d="M12 11a2 2 0 0 1 2 2c0 2.5-.5 5-1.5 7" /><path d="M8.5 12.5c0 3-.6 5.6-1.7 7.5M15.5 12.5c.2 2.8-.3 5.4-1.4 7.5" /><path d="M12 7a5.5 5.5 0 0 1 5.5 5.5M6.5 12.5A5.5 5.5 0 0 1 12 7" /><path d="M4.2 10.5A9 9 0 0 1 12 3.5c2.5 0 4.8 1 6.4 2.6" /></>);
export const IconRadar = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><line x1="12" y1="12" x2="19" y2="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>);
export const IconFile = (p: P) => base(p, <><path d="M6 2h8l4 4v16H6z" /><polyline points="14 2 14 6 18 6" /></>);
export const IconKey = (p: P) => base(p, <><circle cx="8" cy="15" r="4.5" /><line x1="11.5" y1="11.5" x2="20" y2="3" /><polyline points="16 7 18.5 9.5 16.5 11.5" /></>);
export const IconSpark = (p: P) => base(p, <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>);
export const IconCamera = (p: P) => base(p, <><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>);
export const IconLogout = (p: P) => base(p, <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>);
export const IconMedal = (p: P) => base(p, <><circle cx="12" cy="14" r="5" /><path d="M8.5 9.5 6 3h4l2 4 2-4h4l-2.5 6.5" /></>);

// Category identity
export const CATEGORY_STYLE: Record<string, { color: string; soft: string; icon: (p: P) => React.ReactNode; label: string }> = {
  Pentesting: { color: "#f43f5e", soft: "rgba(244,63,94,.12)", icon: IconTarget, label: "Penetration Testing" },
  Forensics: { color: "#0ea5e9", soft: "rgba(14,165,233,.12)", icon: IconFingerprint, label: "Digital Forensics" },
  "Network Analysis": { color: "#f59e0b", soft: "rgba(245,158,11,.12)", icon: IconNetwork, label: "Network Analysis" },
};
