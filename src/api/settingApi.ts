// roshi_fit/src/api/settingApi.ts
import api from './axiosInstance';
import {type SiteContent } from '../types/Setting';

export const fetchSiteContent = async (): Promise<SiteContent> => {
  try {
    const res = await api.get<SiteContent>('/settings/site-content');
    console.log('API: fetchSiteContent response:', res.data);
    return res.data;
  } catch (error) {
    console.error('API: Error fetching site content:', error);
    throw error;
  }
};

export const updateSiteContent = async (data: SiteContent): Promise<SiteContent> => {
  try {
    console.log('API: updateSiteContent sending data:', data);
    const res = await api.put<SiteContent>('/settings/site-content', data);
    console.log('API: updateSiteContent response:', res.data);
    return res.data;
  } catch (error) {
    console.error('API: Error updating site content:', error);
    throw error;
  }
};