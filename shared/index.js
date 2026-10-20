export const ROLES = {
  CUSTOMER: 'customer',
  OWNER: 'owner',
  ADMIN: 'admin',
  VERIFICATION_STAFF: 'verification_staff',
};

export const BOOKING_STATUSES = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAYMENT_PENDING: 'payment_pending',
  CONFIRMED: 'confirmed',
  HANDOVER_PENDING: 'handover_pending',
  ACTIVE: 'active',
  RETURN_PENDING: 'return_pending',
  COMPLETED: 'completed',
  CANCELLED_BY_CUSTOMER: 'cancelled_by_customer',
  CANCELLED_BY_OWNER: 'cancelled_by_owner',
  CANCELLED_BY_ADMIN: 'cancelled_by_admin',
  DISPUTED: 'disputed',
  REFUND_PENDING: 'refund_pending',
  REFUND_COMPLETED: 'refund_completed',
};

export const VEHICLE_STATUSES = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  LISTED: 'listed',
  UNLISTED: 'unlisted',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

export const VERIFICATION_STATUSES = {
  NOT_SUBMITTED: 'not_submitted',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  RESUBMITTED: 'resubmitted',
  EXPIRED: 'expired',
};

export const VEHICLE_CATEGORIES = [
  'hatchback', 'sedan', 'suv', 'muv', 'luxury', 'bike', 'scooter'
];

export const FUEL_TYPES = [
  'petrol', 'diesel', 'electric', 'cng', 'hybrid'
];

export const TRANSMISSIONS = ['manual', 'automatic'];

export const CITIES = [
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Bengaluru', slug: 'bengaluru' },
  { name: 'Jaipur', slug: 'jaipur' },
  { name: 'Pune', slug: 'pune' },
];
