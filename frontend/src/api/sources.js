import client from './client';

export const getSourcesStatus = () => client.get('/sources/status');
export const getExternalData = (params) => client.get('/sources/donnees', { params });
export const getWorldBankLatest = () => client.get('/sources/worldbank');
export const getWorldBankIndicator = (code, limit = 20) =>
  client.get(`/sources/worldbank/${code}`, { params: { limit } });
export const getWorldBankIndicatorList = () => client.get('/sources/worldbank-indicators');
export const getContraintes = (params) => client.get('/sources/contraintes', { params });
export const getPerspectives = (params) => client.get('/sources/perspectives', { params });
export const getSousSecteurs = (params) => client.get('/sources/sous-secteurs', { params });

export const syncWorldBank = () => client.post('/sources/sync/worldbank');
export const syncOpenDataAfrica = () => client.post('/sources/sync/opendatafrica');
export const syncAll = () => client.post('/sources/sync/all');
