import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import client from '../../api/client';
import Button from '../../components/common/Button';
import { useLanguage } from '../../hooks/useLanguage';

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', organisation: '', sujet: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await client.post('/contact', form);
      setSent(true);
    } catch {
      setError('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="text-industrie mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('contact.succes')}</h2>
        <p className="text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Mail size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{t('contact.titre')}</h1>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-12">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'nom', label: t('contact.nom'), type: 'text', required: true },
            { name: 'email', label: t('contact.email'), type: 'email', required: true },
            { name: 'telephone', label: t('contact.telephone'), type: 'tel' },
            { name: 'organisation', label: t('contact.organisation'), type: 'text' },
            { name: 'sujet', label: t('contact.sujet'), type: 'text' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows="5"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Envoi...' : t('contact.envoyer')}
          </Button>
        </form>
      </section>
    </div>
  );
}
