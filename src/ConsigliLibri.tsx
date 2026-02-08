import { useState } from "react";

type Libro = {
  id: string;
  titolo: string;
  autore: string;
  categoria: string;
  anno: number;
  preferito: boolean;
};

function ConsigliLibri({ libri }: { libri: Libro[] }) {
  const [consigli, setConsigli] = useState<string>("");

  async function caricaConsigli() {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libri }),
    });

    const data = await res.json();
    setConsigli(data.consigli);
  }

  return (
    <div>
      <button onClick={caricaConsigli}>
        Suggerisci libri 📚
      </button>

      <pre>{consigli}</pre>
    </div>
  );
}

export default ConsigliLibri;