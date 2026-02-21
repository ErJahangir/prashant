// Client-side Firebase initializer for frontend
import { initializeApp } from "firebase/app";
import { getFirestore as getClientFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth as getClientAuth } from "firebase/auth";

// Read config from Vite env vars, with sensible fallbacks to current Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDmmGB-qcPi3HDEQ_mboLpMAn67fy8NElo",
    authDomain: "prashant-sujata.firebaseapp.com",
    projectId: "prashant-sujata",
    storageBucket: "prashant-sujata.firebasestorage.app",
    messagingSenderId: "795588215656",
    appId: "1:795588215656:web:83d97bcd1248810c50ccdd",
};

let app;
let firestoreInstance;

export function initFirebaseClient() {
    if (app) return app;
    app = initializeApp(firebaseConfig);

    // Optionally connect to Firestore emulator in development
    if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === "true") {
        const host = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || "localhost";
        const port = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || 8080);
        try {
            firestoreInstance = getClientFirestore(app);
            connectFirestoreEmulator(firestoreInstance, host, port);
        } catch (err) {
            // ignore: emulator may not be available at runtime
            console.warn("Failed to connect to Firestore emulator:", err);
        }
    }

    return app;
}

export function getFirestore() {
    initFirebaseClient();
    if (!firestoreInstance) firestoreInstance = getClientFirestore(app);
    return firestoreInstance;
}

export function getAuth() {
    initFirebaseClient();
    return getClientAuth(app);
}
