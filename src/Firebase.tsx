import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, updateDoc, getDocs, collection, deleteDoc, where, doc, query, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const AddDocument = async (email: string, isbn: number, title: string, authors: string, date: number, house: string, category: string, preferito: boolean) => {
    const q = query(collection(db, "libri"),where("user", "==", email));
    const snapshot = await getDocs(q);
    let flag = false
    snapshot.forEach((doc) => {
        if (doc.data().id === isbn.toString()) {
            flag = true; // Imposta la dimensione a 2 per indicare che il libro è già presente
        }
    });
    if (flag) {
        console.log("Il libro è già presente");
        return false;
    }else {
        await setDoc(doc(db, "libri", isbn.toString()), {
            anno_pubblicazione: date.toString(),
            autori: authors,
            casa_editrice: house,
            titolo: title,
            categoria: category,
            id: isbn.toString(),
            preferito: preferito,
            user: email
        });
        console.log("Il libro è stato aggiunto");
        return true;
    }
}

export const AddCategory = async (email:string, category: string) => {
    const q = query(collection(db, "categorie"),where("user", "==", email));
    const snapshot = await getDocs(q);
    let flag = false;
    snapshot.forEach((doc) => {
        if (doc.data().id === category.toLowerCase()) {
            flag = true; // Imposta la dimensione a 2 per indicare che il libro è già presente
        }
    });
    if (flag) {
        console.log("La categoria è già presente");
        return false;
    }else {
        await setDoc(doc(db, "categorie", category.toLowerCase()), {
            categoria: category,
            user: email
        });
        console.log("La categoria è stato aggiunta");
        return true;
    }
}

export const UpdateDocument = async (email:string, isbn: number, title: string, authors: string, date: number, house: string, category: string, preferito: boolean) => {
    const q = query(collection(db, "libri"),where("user", "==", email));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
        if (doc.data().id === isbn.toString()) {
            updateDoc(doc.ref, {
                anno_pubblicazione: date,
                autori: authors,
                casa_editrice: house,
                titolo: title,
                categoria: category,
                id: isbn,
                preferito: preferito
            });
        }
    });
}

export const UpdateSingleValue = async (email: string, isbn: number, field: string, value: string | number | boolean) => {
    const q = query(collection(db, "libri"),where("user", "==", email));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
        if (doc.data().id === isbn.toString()) {
            updateDoc(doc.ref, {
                [field]: value
            });
        }
    });
}

export const GetDocuments = async (email: string) => {
    const data = [{}];
    const q = query(collection(db, "libri"), where("user", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

export const GetDocument = async (email: string, isbn: number) => {
    const data = [{}];
    const q = query(collection(db, "libri"), where("user", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.data().id === isbn.toString()) {
            data.push(doc.data());
        }
    });
    return data;
}

export const GetDocumentWithCategory = async (email: string, category: string) => { 
    const data = [{}];
    const q = query(collection(db, "libri"), where("user", "==", email), where("categoria", "==", category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => { 
        data.push(doc.data());
    });
    return data;
}

export const GetCategories = async (email: string) => {
    const data = [{}];
    const q = query(collection(db, "categorie"), where("user", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

export const GetCategory = async (email: string, category: string) => {
    const data = [{}];
    const q = query(collection(db, "categorie"), where("user", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.data().categoria === category) {
            data.push(doc.data());
        }
    });
    return data;
}

export const DeleteDocument = async (email: string, isbn: number) => {
    const q = query(collection(db, "libri"), where("user", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.data().id === isbn.toString()) {
            deleteDoc(doc.ref);
        }
    });
}

export const DeleteCategory = async (email: string, category: string) => {
    await deleteDoc(doc(db, "categorie", category.toLowerCase()));
    const q = query(collection(db, "libri"), where("user", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.data().categoria === category) {
            updateDoc(doc.ref, {
                categoria: "Nessuna"
            });
        }
    });
}

export const addUsers = async (email: string, nome: string, cognome: string, data: string, username: string) => {
    await setDoc(doc(db, "utenti", email), {
        nome: nome,
        cognome: cognome,
        data_nascita: data,
        username: username,
        id: email
    });
}

export const getUser = async (email: string) => {
    const q = query(collection(db, "utenti"), where("id", "==", email));
    const querySnapshot = await getDocs(q);
    let user = {
        nome: '',
        cognome: '',
        data_nascita: '',
        username: '',
        id: ''
    };
    querySnapshot.forEach((doc) => {
        user = {
            nome: doc.data().nome,
            cognome: doc.data().cognome,
            data_nascita: doc.data().data_nascita,
            username: doc.data().username,
            id: doc.data().id
        };
    });
    return user;
}


/* AUTENTICAZIONE */

export const createUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Errore Firebase:', error.message);
        }
        throw error;
    }
}

export const signInUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Errore Firebase:', error.message);
        }
        throw error;
    }
}

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Errore di logout:', error);
        throw error;
    }
};

export const resetPassword = async (email: string) => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('Email di reset password inviata');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}


/* ERRORI */
export function isFirebaseError(error: unknown): error is { code: string; message: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error
    );
}