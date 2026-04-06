import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { getPublicEnquete, submitEnquete } from '../../api/enquetes';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

export default function EnquetePublicPage() {
  const { token } = useParams();
  const [enquete, setEnquete] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicEnquete(token)
      .then((res) => setEnquete(res.data))
      .catch(() => setError('Enquête introuvable ou expirée'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitEnquete(token, answers);
      setSubmitted(true);
    } catch {
      setError('Erreur lors de la soumission');
    }
  };

  if (loading) return <Loading />;

  if (error && !enquete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ClipboardList size={64} className="text-gray-300 mx-auto mb-4" />
        <p className="text-lg text-gray-500">{error}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="text-industrie mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Merci !</h2>
        <p className="text-gray-500">Votre réponse a été enregistrée avec succès.</p>
      </div>
    );
  }

  const questions = enquete?.questions || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <ClipboardList size={48} className="text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold">{enquete?.titre}</h1>
        {enquete?.description && <p className="text-gray-500 mt-2">{enquete.description}</p>}
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id || i} className="bg-white rounded-xl border p-5">
            <label className="block font-medium mb-3">{i + 1}. {q.texte}</label>
            {q.type === 'text' && (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {q.type === 'number' && (
              <input
                type="number"
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {q.type === 'select' && (
              <select
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Sélectionner...</option>
                {q.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {q.type === 'radio' && (
              <div className="space-y-2">
                {q.options?.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full">Soumettre mes réponses</Button>
      </form>
    </div>
  );
}
