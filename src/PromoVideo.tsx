import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ── Colors ──
const COLORS = {
  bg: "#0a0a0f",
  bgLight: "#12121a",
  amber: "#e8820e",
  amberLight: "#f5a623",
  gold: "#ffd700",
  text: "#e8e8ed",
  textMuted: "#8888a0",
  white: "#ffffff",
};

// ── Shared Components ──
const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      background: `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.amberLight}, ${COLORS.gold})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}
  >
    {children}
  </span>
);

const VinylDisc: React.FC<{
  size: number;
  rotation: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size, rotation, opacity = 1, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `conic-gradient(from ${rotation}deg, #1a1a25, #2a2a35, #1a1a25, #2a2a35, #1a1a25)`,
      border: `2px solid ${COLORS.amber}33`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity,
      ...style,
    }}
  >
    <div
      style={{
        width: size * 0.35,
        height: size * 0.35,
        borderRadius: "50%",
        background: COLORS.amber,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: size * 0.08,
          height: size * 0.08,
          borderRadius: "50%",
          background: COLORS.bg,
        }}
      />
    </div>
  </div>
);

// ── Slide 1: Problem ──
const ProblemSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, from: 60, to: 0, config: { damping: 14 } });
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const items = ["Scattered across shelves", "No idea what you own", "Buying duplicates", "No insurance records"];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background disc */}
      <div style={{ position: "absolute", top: -100, right: -100, opacity: 0.08 }}>
        <VinylDisc size={500} rotation={frame * 0.5} />
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleOp,
          lineHeight: 1.1,
          fontFamily: "Inter, sans-serif",
          color: COLORS.text,
          marginBottom: 48,
        }}
      >
        Your vinyl collection{"\n"}is a <GradientText>mess</GradientText>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
        {items.map((item, i) => {
          const delay = 20 + i * 12;
          const itemOp = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const itemX = spring({ frame: Math.max(0, frame - delay), fps, from: 40, to: 0, config: { damping: 14 } });
          return (
            <div
              key={i}
              style={{
                opacity: itemOp,
                transform: `translateX(${itemX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                background: `${COLORS.bgLight}`,
                borderRadius: 12,
                borderLeft: `3px solid #ff4444`,
              }}
            >
              <span style={{ fontSize: 28, color: "#ff4444" }}>✗</span>
              <span style={{ fontSize: 32, fontFamily: "Inter, sans-serif", color: COLORS.textMuted }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Slide 2: Solution ──
const SolutionSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, from: 0.8, to: 1, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const discRotation = frame * 1.5;

  const subtitleOp = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = spring({ frame: Math.max(0, frame - 20), fps, from: 30, to: 0, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.amber}15, transparent 70%)`,
        }}
      />

      <div style={{ opacity, transform: `scale(${scale})`, marginBottom: 40 }}>
        <VinylDisc size={280} rotation={discRotation} />
      </div>

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.amber,
          fontFamily: "Inter, sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Introducing
      </div>

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 80,
          fontWeight: 800,
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        <GradientText>Vinyl Tracker</GradientText>
      </div>

      <div
        style={{
          opacity: subtitleOp,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 32,
          color: COLORS.textMuted,
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          marginTop: 24,
          lineHeight: 1.4,
          maxWidth: 700,
        }}
      >
        Every record you own,{"\n"}finally organized
      </div>
    </AbsoluteFill>
  );
};

// ── Slide 3: Features ──
const FeaturesSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const features = [
    { icon: "📷", label: "Barcode Scanning", desc: "Instant album identification" },
    { icon: "🎶", label: "MusicBrainz Data", desc: "50M+ albums, auto-filled" },
    { icon: "📴", label: "Works Offline", desc: "Your data stays on device" },
    { icon: "📊", label: "Collection Stats", desc: "Genres, decades, artists" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          opacity: titleOp,
          fontSize: 56,
          fontWeight: 800,
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          marginBottom: 56,
          color: COLORS.text,
        }}
      >
        Everything you{"\n"}<GradientText>need</GradientText>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
        {features.map((f, i) => {
          const delay = 10 + i * 15;
          const itemScale = spring({ frame: Math.max(0, frame - delay), fps, from: 0.85, to: 1, config: { damping: 12 } });
          const itemOp = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity: itemOp,
                transform: `scale(${itemScale})`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "24px 28px",
                background: COLORS.bgLight,
                borderRadius: 16,
                border: `1px solid ${COLORS.amber}22`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: `${COLORS.amber}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "Inter, sans-serif", color: COLORS.text }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 24, color: COLORS.textMuted, fontFamily: "Inter, sans-serif", marginTop: 2 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Slide 4: CTA ──
const CTASlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, from: 0.9, to: 1, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const priceScale = spring({ frame: Math.max(0, frame - 25), fps, from: 0.5, to: 1, config: { damping: 10, stiffness: 120 } });
  const priceOp = interpolate(frame, [25, 35], [0, 1], { extrapolateRight: "clamp" });

  const btnOp = interpolate(frame, [40, 50], [0, 1], { extrapolateRight: "clamp" });
  const btnY = spring({ frame: Math.max(0, frame - 40), fps, from: 20, to: 0, config: { damping: 14 } });

  // Pulse glow
  const glowOpacity = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.1, 0.25]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Pulsing glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.amber}, transparent 60%)`,
          opacity: glowOpacity,
        }}
      />

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 60,
          fontWeight: 800,
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          lineHeight: 1.15,
          color: COLORS.text,
          marginBottom: 40,
        }}
      >
        Start cataloging{"\n"}<GradientText>today</GradientText>
      </div>

      <div
        style={{
          opacity: priceOp,
          transform: `scale(${priceScale})`,
          fontSize: 96,
          fontWeight: 800,
          fontFamily: "Inter, sans-serif",
          marginBottom: 8,
        }}
      >
        <GradientText>$4.99</GradientText>
      </div>

      <div
        style={{
          opacity: priceOp,
          fontSize: 28,
          color: COLORS.textMuted,
          fontFamily: "Inter, sans-serif",
          marginBottom: 48,
        }}
      >
        One-time · No subscription
      </div>

      <div
        style={{
          opacity: btnOp,
          transform: `translateY(${btnY}px)`,
          padding: "22px 56px",
          background: `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.amberLight})`,
          borderRadius: 16,
          fontSize: 32,
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          color: COLORS.white,
          boxShadow: `0 8px 32px ${COLORS.amber}44`,
        }}
      >
        Get Vinyl Tracker
      </div>

      <div
        style={{
          opacity: btnOp,
          marginTop: 24,
          fontSize: 22,
          color: COLORS.textMuted,
          fontFamily: "Inter, sans-serif",
        }}
      >
        vinyltracker.app
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──
const PromoVideoContent: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Sequence from={0} durationInFrames={90}>
        <ProblemSlide />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <SolutionSlide />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <FeaturesSlide />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <CTASlide />
      </Sequence>
    </AbsoluteFill>
  );
};

export const PromoVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideoContent}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
