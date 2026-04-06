import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getActualite } from '../../api/actualites';
import Loading from '../../components/common/Loading';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import { ACTUALITE_CATEGORIES } from '../../utils/constants';

export default function ActualiteDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActualite(slug)
      .then((res) => setArticle(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!article) return <div className="text-center py-20 text-gray-400">Article introuvable</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/actualites" className="inline-flex items-center gap-1 text-primary hover:underline text-sm mb-6">
        <ArrowLeft size={16} /> Retour aux actualités
      </Link>

      {article.categorie && <Badge color="blue">{ACTUALITE_CATEGORIES[article.categorie]}</Badge>}
      <h1 className="text-3xl font-bold mt-2 mb-4">{article.titre}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>{formatDate(article.date_publication)}</span>
        {article.auteur && <span>Par {article.auteur}</span>}
        <span>{article.vues} vues</span>
      </div>

      <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {article.contenu}
      </div>

      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
          {article.tags.map((tag, i) => <Badge key={i} color="gray">{tag}</Badge>)}
        </div>
      )}
    </div>
  );
}
