import { masterDataHandlers } from '@/lib/admin-master-data';
const handlers = masterDataHandlers('care-symbols');
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
