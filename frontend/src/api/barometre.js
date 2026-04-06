import client from './client';

export const getDashboard = () => client.get('/barometre/dashboard');
export const getIBIC = () => client.get('/barometre/ibic');
export const getIBICEvolution = (secteur) =>
  client.get('/barometre/ibic/evolution', { params: { secteur_code: secteur } });
export const getIndustrie = () => client.get('/barometre/industrie');
export const getCommerce = () => client.get('/barometre/commerce');
export const getRegions = () => client.get('/barometre/regions');
export const getComparaison = () => client.get('/barometre/comparaison');
