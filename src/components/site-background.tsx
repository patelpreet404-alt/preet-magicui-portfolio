"use client";

import { useEffect, useRef } from "react";
import { useMotionSettings } from "@/components/motion-settings";

const SPACE_STREAM = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export default function SiteBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) {
      video?.pause();
      return;
    }

    let cancelled = false;
    let destroyStream: (() => void) | undefined;
    const handleVisibilityChange = () => {
      if (document.hidden) video.pause();
      else void video.play().catch(() => undefined);
    };

    const startStream = async () => {
      try {
        const { default: Hls } = await import("hls.js");
        if (cancelled) return;
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
          hls.loadSource(SPACE_STREAM);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, handleVisibilityChange);
          destroyStream = () => hls.destroy();
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = SPACE_STREAM;
          handleVisibilityChange();
        }
      } catch {
        video.pause();
      }
    };

    void startStream();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
      destroyStream?.();
      video.removeAttribute("src");
      video.load();
    };
  }, [reducedMotion]);

  return (
    <div className="site-background" aria-hidden="true">
      <video ref={videoRef} className="site-background__video" muted loop playsInline />
      <div className="site-background__veil" />
    </div>
  );
}
