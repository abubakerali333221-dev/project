
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  deleteDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMoQdcRgPGNHsembYYPUJIUtzBb0BD7vM",
  authDomain: "smart-reminder-1688c.firebaseapp.com",
  projectId: "smart-reminder-1688c",
  storageBucket: "smart-reminder-1688c.firebasestorage.app",
  messagingSenderId: "706661285934",
  appId: "1:706661285934:web:dd82f4ad7c5168abbfdfbf",
  measurementId: "G-WWWZ8YYHNN"
};

// تهيئة Firebase بطريقة آمنة
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

/**
 * خدمات قاعدة البيانات (Firestore)
 */
export const saveProfileToFirestore = async (storeId: string, profile: any) => {
  const docRef = doc(db, "merchants", storeId);
  await setDoc(docRef, profile, { merge: true });
};

export const getProfileFromFirestore = async (storeId: string) => {
  const docRef = doc(db, "merchants", storeId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getAllMerchantsFromFirestore = async () => {
  const colRef = collection(db, "merchants");
  const querySnapshot = await getDocs(colRef);
  const merchants: any[] = [];
  querySnapshot.forEach((doc) => {
    merchants.push({ id: doc.id, ...doc.data() });
  });
  return merchants;
};

export const deleteMerchantFromFirestore = async (merchantId: string) => {
  await deleteDoc(doc(db, "merchants", merchantId));
};

export const saveEventToFirestore = async (event: any) => {
  const docRef = doc(db, "events", event.id);
  await setDoc(docRef, event);
};

export const deleteEventFromFirestore = async (eventId: string) => {
  await deleteDoc(doc(db, "events", eventId));
};

export const getAllEventsFromFirestore = async () => {
  const colRef = collection(db, "events");
  const querySnapshot = await getDocs(colRef);
  const events: any[] = [];
  querySnapshot.forEach((doc) => {
    events.push(doc.data());
  });
  return events;
};

export const saveContentToFirestore = async (merchantId: string, content: any) => {
  const docRef = doc(db, "merchants", merchantId, "generated_contents", content.id);
  await setDoc(docRef, content);
};

export const getMerchantContentsFromFirestore = async (merchantId: string) => {
  const colRef = collection(db, "merchants", merchantId, "generated_contents");
  const q = query(colRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const contents: any[] = [];
  querySnapshot.forEach((doc) => {
    contents.push(doc.data());
  });
  return contents;
};

export { db, app };
