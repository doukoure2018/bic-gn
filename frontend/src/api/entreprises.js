import client from './client';

export const getEntreprisesPublic = (secteur_code) =>
  client.get('/entreprises/public', { params: { secteur_code } });

export const getAgregation = (secteur_code) =>
  client.get('/entreprises/public/agregation', { params: { secteur_code } });

export const getConsolidation = () =>
  client.get('/entreprises/public/consolidation');

// Admin
export const getEntreprises = (secteur_code) =>
  client.get('/entreprises', { params: { secteur_code } });

export const createEntreprise = (data) => client.post('/entreprises', data);
export const updateEntreprise = (id, data) => client.put(`/entreprises/${id}`, data);
export const deleteEntreprise = (id) => client.delete(`/entreprises/${id}`);
export const validerEntreprise = (id) => client.post(`/entreprises/${id}/valider`);
export const publierEntreprise = (id) => client.post(`/entreprises/${id}/publier`);
export const validerSecteur = (secteur_code) => client.post(`/entreprises/valider-secteur/${secteur_code}`);
