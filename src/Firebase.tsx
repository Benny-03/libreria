import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, updateDoc, getDocs, collection, deleteDoc, where, doc, query, getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyD7W5fdt5iUlwPLRPV1gTGwxLASEUz59DA",
    authDomain: "libreria-commercialisti.firebaseapp.com",
    databaseURL: "https://libreria-commercialisti-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "libreria-commercialisti",
    storageBucket: "libreria-commercialisti.firebasestorage.app",
    messagingSenderId: "465606346136",
    appId: "1:465606346136:web:358721a6930e0a150917ed",
    measurementId: "G-ZZGDR7PMRM"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* FIRESTORE */
export const AddDocument = async (isbn: number, title: string, authors: string, date: number, house: string, category: string) => {
    const document = await GetDocument(isbn);
    if (document.length > 1) {
        console.log("Il libro è già presente");
        return false;
    }else {
        await setDoc(doc(db, "libri", isbn.toString()), {
            anno_pubblicazione: date,
            autori: authors,
            casa_editrice: house,
            titolo: title,
            categoria: category,
            id: isbn
        });
        console.log("Il libro è stato aggiunto");
        return true;
    }

}

export const AddCategory = async (category: string) => {
    await setDoc(doc(db, "categorie", category), {
        categoria: category
    });
}

export const UpdateDocument = async (isbn: number, title: string, authors: string, date: number, house: string, category: string) => {
    await updateDoc(doc(db, "libri", isbn.toString()), {
        anno_pubblicazione: date,
        autori: authors,
        casa_editrice: house,
        titolo: title,
        categoria: category,
        id: isbn
    });
}

export const GetDocuments = async () => {
    const data = [{}];
    const q = query(collection(db, "libri"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

export const GetDocument = async (isbn: number) => {
    const data = [{}];
    const q = query(collection(db, "libri"), where("id", "==", isbn));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

export const GetCategories = async () => {
    const data = [{}];
    const q = query(collection(db, "categorie"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

export const DeleteDocument = async (isbn: number) => {
    await deleteDoc(doc(db, "libri", isbn.toString()));
}

export const DeleteCategory = async (category: string) => {
    await deleteDoc(doc(db, "categorie", category));
    const q = query(collection(db, "libri"), where("categoria", "==", category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            categoria: "Nessuna"
        });
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

export const logOutUser = async () => {
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