import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useAppStore } from '../../store/useAppStore';
import { getFaceLandmarker } from '../../lib/mediapipe';
import { acquireSharedWebcamStream, releaseSharedWebcamStream } from '../../lib/webcam';

export function useFaceTracking() {
  const trackingEnabled = useAppStore((state) => state.tracking.enabled);
  const setTrackingStatus = useAppStore((state) => state.setTrackingStatus);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!trackingEnabled) {
      setTrackingStatus({
        status: 'fallback',
        supported: false,
        mode: 'ui',
        message: 'UI control active',
        offsetX: 0,
        offsetY: 0,
      });
      return undefined;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setTrackingStatus({
        status: 'fallback',
        supported: false,
        mode: 'ui',
        message: 'Camera unavailable, using UI fallback',
        offsetX: 0,
        offsetY: 0,
      });
      return undefined;
    }

    let cancelled = false;

    const boot = async () => {
      try {
        setTrackingStatus({
          status: 'requesting',
          message: 'Requesting camera access…',
          supported: true,
        });

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

        const landmarker = await getFaceLandmarker();

        const detect = () => {
          if (cancelled || !videoRef.current) {
            return;
          }

          const result = landmarker.detectForVideo(videoRef.current, performance.now());
          const landmarks = result.faceLandmarks?.[0];
          if (landmarks) {
            const nose = landmarks[1];
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];
            const faceWidth = Math.max(Math.abs(rightCheek.x - leftCheek.x), 0.1);
            const normalizedX = (0.5 - nose.x) * 1.9;
            const normalizedY = (0.5 - nose.y) * 1.6;
            const dampedX = THREE.MathUtils.clamp(normalizedX * (0.7 + faceWidth), -1.2, 1.2);
            const dampedY = THREE.MathUtils.clamp(normalizedY * (0.7 + faceWidth), -0.9, 0.9);
            setTrackingStatus({
              status: 'active',
              supported: true,
              mode: 'face',
              message: 'Face offset tracking active',
              offsetX: dampedX,
              offsetY: dampedY,
            });
          } else {
            setTrackingStatus({
              status: 'fallback',
              mode: 'ui',
              message: 'Face lost, UI control active',
              offsetX: 0,
              offsetY: 0,
            });
          }

          frameRef.current = window.requestAnimationFrame(detect);
        };

        frameRef.current = window.requestAnimationFrame(detect);
      } catch {
        setTrackingStatus({
          status: 'fallback',
          supported: false,
          mode: 'ui',
          message: 'Camera denied, UI control active',
          offsetX: 0,
          offsetY: 0,
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
  }, [setTrackingStatus, trackingEnabled]);
}
