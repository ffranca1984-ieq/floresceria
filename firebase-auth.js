// FlorescerIA — Firebase config v6
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEelyfihFeT6xXVYJNoY62sEhLkzvBiA8",
  authDomain: "floresceria-a1631.firebaseapp.com",
  projectId: "floresceria-a1631",
  storageBucket: "floresceria-a1631.firebasestorage.app",
  messagingSenderId: "572333214071",
  appId: "1:572333214071:web:749c83bc2bc6883fb63972"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// AUTH
export const loginGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const onAuth = (cb) => onAuthStateChanged(auth, cb);

// FIRESTORE HELPERS
export async function saveSession(uid, tipo, dados) {
  await addDoc(collection(db, 'sessoes'), {
    uid, tipo, dados, criadoEm: serverTimestamp()
  });
}

export async function getSessions(uid, tipo) {
  const q = query(collection(db, 'sessoes'),
    where('uid','==',uid), where('tipo','==',tipo), orderBy('criadoEm','desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({id:d.id,...d.data()}));
}

export async function saveProfile(uid, dados) {
  await setDoc(doc(db, 'usuarios', uid), dados, {merge:true});
}

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveVinculo(codigoResp, uidFilho, nomeFilho) {
  await setDoc(doc(db, 'vinculos', codigoResp + '_' + uidFilho), {
    codigoResp, uidFilho, nomeFilho, criadoEm: serverTimestamp()
  });
}

export async function getVinculados(codigoResp) {
  const q = query(collection(db, 'vinculos'), where('codigoResp','==',codigoResp));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function getLastSession(uid, tipo) {
  const q = query(collection(db, 'sessoes'),
    where('uid','==',uid), where('tipo','==',tipo), orderBy('criadoEm','desc'));
  const snap = await getDocs(q);
  return snap.docs.length > 0 ? {id:snap.docs[0].id,...snap.docs[0].data()} : null;
}
