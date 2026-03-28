let sharedStreamPromise: Promise<MediaStream> | null = null;
let activeConsumers = 0;

export async function acquireSharedWebcamStream() {
  activeConsumers += 1;

  if (!sharedStreamPromise) {
    sharedStreamPromise = navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 960 },
        height: { ideal: 540 },
      },
      audio: false,
    });
  }

  return sharedStreamPromise;
}

export function releaseSharedWebcamStream() {
  activeConsumers = Math.max(activeConsumers - 1, 0);

  if (activeConsumers > 0 || !sharedStreamPromise) {
    return;
  }

  void sharedStreamPromise.then((stream) => {
    stream.getTracks().forEach((track) => track.stop());
  });

  sharedStreamPromise = null;
}
