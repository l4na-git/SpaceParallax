import { useEffect, useRef } from 'react';

import { getGestureRecognizer } from '../../lib/mediapipe';
import { acquireSharedWebcamStream, releaseSharedWebcamStream } from '../../lib/webcam';
import { useAppStore } from '../../store/useAppStore';

export function useGesturePlacement() {
  const trackingEnabled = useAppStore((state) => state.tracking.enabled);
  const selectedTemplateId = useAppStore((state) => state.catalog.selectedTemplateId);
  const selectedOrbitTargetId = useAppStore((state) => state.catalog.selectedOrbitTargetId);
  const pendingMass = useAppStore((state) => state.catalog.pendingMass);
  const addObjectToOrbit = useAppStore((state) => state.addObjectToOrbit);
  const setTrackingStatus = useAppStore((state) => state.setTrackingStatus);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number>(0);
  const lastTriggerRef = useRef<number>(0);

  useEffect(() => {
    if (!trackingEnabled || !navigator.mediaDevices?.getUserMedia) {
      return undefined;
    }

    let cancelled = false;

    const boot = async () => {
      try {
        const stream = await acquireSharedWebcamStream();

        if (cancelled) {
          releaseSharedWebcamStream();
          return;
        }

        const video = document.createElement('video');
        video.playsInline = true;
        video.muted = true;
        video.autoplay = true;
        video.srcObject = stream;
        await video.play();
        videoRef.current = video;

        const recognizer = await getGestureRecognizer();

        const detect = () => {
          if (cancelled || !videoRef.current) {
            return;
          }

          const result = recognizer.recognizeForVideo(videoRef.current, performance.now());
          const gesture = result.gestures?.[0]?.[0];
          const now = performance.now();

          if (gesture && gesture.categoryName !== 'None' && gesture.score > 0.65 && now - lastTriggerRef.current > 2200) {
            lastTriggerRef.current = now;
            addObjectToOrbit({
              templateId: selectedTemplateId,
              orbitTargetId: selectedOrbitTargetId,
              mass: pendingMass,
            });
            setTrackingStatus({
              message: `Gesture deployed: ${gesture.categoryName}`,
            });
          }

          frameRef.current = window.requestAnimationFrame(detect);
        };

        frameRef.current = window.requestAnimationFrame(detect);
      } catch {
        setTrackingStatus({
          message: 'Gesture extension unavailable',
        });
      }
    };

    void boot();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameRef.current);
      releaseSharedWebcamStream();
      videoRef.current = null;
    };
  }, [
    addObjectToOrbit,
    pendingMass,
    selectedOrbitTargetId,
    selectedTemplateId,
    setTrackingStatus,
    trackingEnabled,
  ]);
}
