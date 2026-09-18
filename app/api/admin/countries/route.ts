import { masterDataHandlers } from '@/lib/admin-master-data';
const handlers = masterDataHandlers('countries');
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
