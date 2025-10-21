// roshi_fit/src/api/reportApi.ts
import api from './axiosInstance';
import type {
  SubscriptionReportItem,
  ProductReportItem,
  UserReport,
  ClassReportItem,
  EquipmentReportItem
} from '../types/Report';

export const fetchSubscriptionReport = async (): Promise<SubscriptionReportItem[]> => {
  const res = await api.get<SubscriptionReportItem[]>('/reports/subscriptions');
  return res.data;
};

export const fetchProductReport = async (): Promise<ProductReportItem[]> => {
  const res = await api.get<ProductReportItem[]>('/reports/products');
  return res.data;
};

export const fetchUserReport = async (): Promise<UserReport> => {
  const res = await api.get<UserReport>('/reports/users');
  return res.data;
};

export const fetchClassReport = async (): Promise<ClassReportItem[]> => {
  const res = await api.get<ClassReportItem[]>('/reports/classes');
  return res.data;
};

export const fetchEquipmentReport = async (): Promise<EquipmentReportItem[]> => {
  const res = await api.get<EquipmentReportItem[]>('/reports/equipment');
  return res.data;
};