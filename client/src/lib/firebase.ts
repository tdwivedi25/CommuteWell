import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let db: ReturnType<typeof getFirestore> | null = null;

try {
  if (firebaseConfig.projectId) {
    const app = initializeApp(firebaseConfig as any);
    db = getFirestore(app);
  }
} catch (e) {
  // initialization failed or not configured in env — leave db null
  // Consumers should handle null db gracefully.
  // eslint-disable-next-line no-console
  console.warn("Firebase not initialized:", e);
}

export async function savePlanToFirestore(payload: any) {
  if (!db) {
    // Not configured — noop for now
    // eslint-disable-next-line no-console
    console.log("Firestore not configured. Payload:", payload);
    return;
  }

  try {
    const id = `${payload.userId}_${payload.date}`;
    const ref = doc(collection(db, "wellness"), id);
    // add server timestamp
    const toSave = { ...payload, updatedAt: Timestamp.now() };
    await setDoc(ref, toSave, { merge: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to save plan:", err);
  }
}

export { db };
