import type {
  FaceLandmarker,
  FilesetResolver,
  GestureRecognizer,
} from '@mediapipe/tasks-vision';

const visionBundleUrl =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm';

const faceModelUrl =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

const gestureModelUrl =
  'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';

type VisionModule = typeof import('@mediapipe/tasks-vision');

let visionModulePromise: Promise<VisionModule> | null = null;
let visionPromise: Promise<Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>> | null = null;
let faceLandmarkerPromise: Promise<FaceLandmarker> | null = null;
let gestureRecognizerPromise: Promise<GestureRecognizer> | null = null;

async function getVisionModule() {
  if (!visionModulePromise) {
    visionModulePromise = import('@mediapipe/tasks-vision');
  }

  return visionModulePromise;
}

async function getVisionResolver() {
  if (!visionPromise) {
    visionPromise = getVisionModule().then(({ FilesetResolver: Resolver }) =>
      Resolver.forVisionTasks(visionBundleUrl),
    );
  }

  return visionPromise;
}

export async function getFaceLandmarker() {
  if (!faceLandmarkerPromise) {
    faceLandmarkerPromise = Promise.all([getVisionModule(), getVisionResolver()]).then(
      ([visionModule, vision]) =>
        visionModule.FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: faceModelUrl,
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        }),
    );
  }

  return faceLandmarkerPromise;
}

export async function getGestureRecognizer() {
  if (!gestureRecognizerPromise) {
    gestureRecognizerPromise = Promise.all([getVisionModule(), getVisionResolver()]).then(
      ([visionModule, vision]) =>
        visionModule.GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: gestureModelUrl,
          },
          runningMode: 'VIDEO',
          numHands: 1,
        }),
    );
  }

  return gestureRecognizerPromise;
}
