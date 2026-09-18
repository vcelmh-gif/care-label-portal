import { masterDataHandlers } from '@/lib/admin-master-data';
const handlers = masterDataHandlers('fibers');
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
