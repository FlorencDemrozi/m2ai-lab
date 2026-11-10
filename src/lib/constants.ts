/** Shared by the content schemas and the site code. */
export const STATUSES = ['installed', 'acquiring', 'planned', 'retired'] as const;
export const SYNC = ['hardware', 'software', 'none', 'unknown'] as const;
/**
 * Where an item comes from. Independent of `status` (an item can be a planned lab purchase).
 * lab = bought for the lab · personal = the PI's own collection, available for lab use ·
 * shared-uis = available through other labs at UiS · collaboration = through a partner lab.
 */
export const SOURCES = ['lab', 'personal', 'shared-uis', 'collaboration'] as const;
