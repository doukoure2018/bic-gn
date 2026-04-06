import client from './client';

export const getIndicateurs = (params) => client.get('/indicateurs', { params });
export const getIndicateur = (id) => client.get(`/indicateurs/${id}`);
export const createIndicateur = (data) => client.post('/indicateurs', data);
export const updateIndicateur = (id, data) => client.put(`/indicateurs/${id}`, data);
export const deleteIndicateur = (id) => client.delete(`/indicateurs/${id}`);
export const getIndicateursBySecteur = (code) => client.get(`/indicateurs/secteur/${code}`);

export const getValeurs = (params) => client.get('/valeurs', { params });
export const createValeur = (data) => client.post('/valeurs', data);
export const updateValeur = (id, data) => client.put(`/valeurs/${id}`, data);
export const validerValeur = (id) => client.post(`/valeurs/${id}/valider`);
export const getSerie = (indicateurId, regionId) =>
  client.get(`/valeurs/indicateur/${indicateurId}/series`, { params: { region_id: regionId } });
