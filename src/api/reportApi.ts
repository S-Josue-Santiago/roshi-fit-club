// roshi_fit/src/api/reportApi.ts
import api from './axiosInstance';
import { SubscriptionReportData, ProductReportData, UserReportData, ClassReportData, TrainingReportData, SystemActivityReportData, FinancialReportData } from '../types/Report';

export const fetchSubscriptionReport = async (): Promise<SubscriptionReportData[]> => {
  const res = await api.get<SubscriptionReportData[]>('/reports/subscriptions');
  return res.data;
};

export const fetchProductReport = async (): Promise<ProductReportData[]> => {
  const res = await api.get<ProductReportData[]>('/reports/products');
  return res.data;
};

export const fetchUserReport = async (): Promise<UserReportData> => {
  const res = await api.get<UserReportData>('/reports/users');
  return res.data;
};

export const fetchClassReport = async (): Promise<ClassReportData[]> => {
  const res = await api.get<ClassReportData[]>('/reports/classes');
  return res.data;
};

export const fetchEquipmentReport = async (): Promise<EquipmentReportData[]> => {
  const res = await api.get<EquipmentReportData[]>('/reports/equipment');
  return res.data;
};

export const fetchTrainingReport = async (): Promise<TrainingReportData> => {
  const res = await api.get<TrainingReportData>('/reports/training');
  return res.data;
};

export const fetchSystemActivityReport = async (): Promise<SystemActivityReportData[]> => {
  const res = await api.get<SystemActivityReportData[]>('/reports/system-activity');
  return res.data;
};

export const fetchFinancialReport = async (): Promise<FinancialReportData> => {
  const res = await api.get<FinancialReportData>('/reports/financial');
  return res.data;
};