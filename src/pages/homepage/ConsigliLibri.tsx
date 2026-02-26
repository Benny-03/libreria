import { useState } from "react";
import { gemini } from "../../geminiManager";
import { AddDocument, AddCategory } from "../../Firebase";
import { useAuth } from "../../state";

type Book = {
  isbn: number;
  title: string;
  author: string;
  category?: string;
  casaEditrice?: string;
  anno_pubblicazione?: number;
};

type Props = {
  libri: {
    id: string;
    title: string;
    author: string;
    preferito: boolean;
  }[];
};

function ConsigliLibri({ libri }: Props) {
  const { setMessage, setBooks, message, setCategory } = useAuth();
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  const getRecommendations = async () => {
    if (loading) return;
    setLoading(true);

    const favoriteBooks = libri.filter((b) => b.preferito);
    const booksList = favoriteBooks.map((b) => `- ${b.titolo} ${b.autori ? "di " + b.autori : ""}`).join("\n");
    console.log("Books list for prompt:", booksList);

    const prompt = `
      I miei libri preferiti:
      ${booksList}

      Consigliami 5 libri simili.
      Rispondi SOLO con un array JSON valido nel formato:
      [
        {
          "isbn": number,
          "title": "string",
          "author": "string",
          "category": "string",
          "casaEditrice": "string",
          "anno_pubblicazione": number
        }
      ]
      `;

    try {
      const response = await gemini(prompt);
      const cleaned = response.replace(/```json|```/g, "").trim();
      const jsonStart = cleaned.indexOf("[");
      const jsonEnd = cleaned.lastIndexOf("]") + 1;

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Nessun array JSON trovato nella risposta");
      }

      const jsonString = cleaned.substring(jsonStart, jsonEnd);
      const parsed: Book[] = JSON.parse(jsonString);
      setRecommendations(parsed);
      console.log("Parsed recommendations:", parsed);

    } catch (error) {
      console.error("Errore parsing:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (rec: Book) => {
    const authors = [rec.author];
    const primaCategoria = rec.category.split(",")[0] || "Nessuna";
    const flag = await AddDocument(rec.isbn, rec.title, authors, rec.anno_pubblicazione, rec.casaEditrice, primaCategoria, false);

    if(rec.category) {
      const flagCategory = await AddCategory(primaCategoria);
      if(flagCategory) {
        setCategory(prevCat => [...prevCat, { categoria: primaCategoria }]);
      }
    }

    if (flag) {
        setMessage('Il libro è stato aggiunto');
        setBooks(prevBooks => [...prevBooks, rec]);
    } else {
        setMessage('Il libro è già presente');
    }
    setPopup(true);
  }

  const togglePopup = () => {
    setPopup(!popup);
  }

  return (
    <div className="section-consigli">
      <div className="box">
        <h2 style={{marginBottom: "0"}}>Consigli personalizzati</h2>

        <button onClick={getRecommendations} disabled={loading} className="btn-consigli" style={{margin: "0"}}>
          {loading ? "Caricamento..." : "Genera consigli"}
        </button>
      </div>
      

      <div className="lista-consigli">
        {recommendations.map((rec) => (
          <div key={rec.isbn} style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
            <button className='btn-add classic' onClick={() => addBook(rec)}><i className='fas fa-add'></i></button>
            <p>{rec.title} di {rec.author}</p>
          </div>
        ))}
      </div>
      {popup && (
          <div className='box-popup'>
              <div className='popup'>
                  <h1 style={{ textAlign: "center" }}>{message}</h1>
                  <button onClick={togglePopup}>Chiudi</button>
              </div>
          </div>
      )}
    </div>
  );
}

export default ConsigliLibri;