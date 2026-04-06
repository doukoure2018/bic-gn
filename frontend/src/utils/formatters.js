export const formatNumber = (num, decimals = 0) => {
  if (num == null) return '-';
  return new Intl.NumberFormat('fr-GN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatCurrency = (num) => {
  if (num == null) return '-';
  return `${formatNumber(num, 1)} Mrd GNF`;
};

export const formatPercent = (num) => {
  if (num == null) return '-';
  const sign = num > 0 ? '+' : '';
  return `${sign}${formatNumber(num, 1)}%`;
};

export const formatDate = (dateStr, lang = 'fr') => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

export const formatPeriode = (annee, trimestre) => `T${trimestre} ${annee}`;
