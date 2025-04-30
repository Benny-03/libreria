import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, updateDoc, getDocs, collection, deleteDoc, where, doc, query} from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
const db = getFirestore(app);


// Add a new document in collection "libri"
const AddDocument = async (isbn:number, title:string, authors:string, date:number, house:string, category:string) => {
    await setDoc(doc(db, "libri", isbn.toString()), {
        anno_pubblicazione: date,
        autori: authors,
        casa_editrice: house,
        titolo: title,
        categoria: category
    });
}

// Add a new document in collection "categorie"
const AddCategory = async (category:string) => {
    await setDoc(doc(db, "categorie", category), {
        categoria: category
    });
}


// Update an existing document in collection "libri"
const UpdateDocument = async (isbn:number, title:string, authors:string, date:number, house:string, category:string) => {
    await updateDoc(doc(db, "libri", isbn.toString()), {
        anno_pubblicazione: date,
        autori: authors,
        casa_editrice: house,
        titolo: title,
        categoria: category
    });
}


// Get all documents in collection "libri"
const GetDocuments = async () => {
    const q = query(collection(db, "libri"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    })
}

// Get all documents in collection "categorie"
const GetCategories = async () => {
    const q = query(collection(db, "categorie"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    })
}


// Delete a specific document in collection "libri"
const DeleteDocument = async (isbn:number) => {
    await deleteDoc(doc(db, "libri", isbn.toString()));
}

// Delete a document in collection "categorie"
const DeleteCategory = async (category:string) => {
    await deleteDoc(doc(db, "categorie", category));
    const q = query(collection(db, "libri"), where("categoria", "==", category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
            categoria: "Nessuna"
        });
    });
}

export { AddDocument, UpdateDocument, GetDocuments, GetCategories, AddCategory, DeleteCategory, DeleteDocument };