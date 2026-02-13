import { useState } from 'react';
import { gemini } from '../../geminiManager';

function ConsigliLibri ( books ) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const getRecommendations = async () => {
    if(loading) return; // Evita chiamate multiple
    setLoading(true);

    const favoriteBooks = books.libri.filter(b => b.preferito);
    const prompt = `
      Ho questi libri:
      ${books.libri.map(b => `- ${b.title} di ${b.author} (${b.genre})`).join('\n')}
      I miei preferiti sono:
      ${favoriteBooks.map(b => `- ${b.title}`).join('\n')}
      Consigliami 5 libri simili soprattutto ai preferiti.
      Rispondi SOLO in formato JSON così:
      {
        id: string,
        title: string,
        author: string,
        genere: string,
        case_editrice: string,
        anno_pubblicazione: number
      }
    `;

    try {
      const response = await gemini(prompt);
      const parsed = JSON.parse(response);
      setRecommendations(parsed.recommendations);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Consigli personalizzati</h2>
      <button onClick={getRecommendations}>
        {loading ? 'Caricamento...' : 'Genera consigli'}
      </button>

      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConsigliLibri;