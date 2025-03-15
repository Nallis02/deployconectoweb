import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDYbnZX2URzNqxvP4O4Pfxg8TrSX7U22FA",
    authDomain: "conectoweb-pedidos.firebaseapp.com",
    projectId: "conectoweb-pedidos",
    storageBucket: "conectoweb-pedidos.firebasestorage.app",
    messagingSenderId: "1056116996088",
    appId: "1:1056116996088:web:806c8bdcef241be5f0c80d",
    measurementId: "G-0JZ7Z3LM00"
};

// Inicializar Firebase 
const app = initializeApp(firebaseConfig);
//Inicializar Storage
const storage = getStorage(app);
// Inicializar Firestore
const db = getFirestore(app);
export { db, storage };