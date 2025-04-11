// src/collections/Orders.ts
import type { CollectionConfig } from 'payload';
// import { isAdmin } from '../access/isAdmin';
// import { isOwnerOrAdmin_Complex } from '../access/isOwnerOrAdmin_Complex'; // Needs custom logic for guests
import type { User } from '../payload-types';

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    description: 'Records of ticket purchases (by users or guests) and their status.',
    defaultColumns: ['id', 'orderStatus', 'orderedBy', 'guestEmail', 'event', 'finalAmount', 'currency', 'createdAt'],
    listSearchableFields: ['id', 'paymentIntentId', 'guestEmail', /* Add user email? */],
    // disableCreation: true, // Orders created via checkout flow, not manually
  },
  // Access Control Notes:
  // This becomes complex with guests.
  // - Logged-in user should only see their own orders (check orderedBy == req.user.id).
  // - Guests need a secure way to view their order (e.g., unique link sent via email, not standard API access).
  // - Admins can see all. Organizers might see orders for their events.
  access: {
    // read: isOwnerOrAdmin_Complex('orderedBy', 'guestEmail'), // Custom function needed
    read: () => true,
    create: () => true, // Allow programmatic creation via checkout endpoint (auth handled there)
    update: () => true,
    delete: () => true, 
    // update: isAdmin, // Only admins or system processes update orders
    // delete: isAdmin, // Restrict deletion
  },
  fields: [
    // --- Purchaser Identification ---
    {
      name: 'orderedBy',
      label: 'Ordered By User (if logged in)',
      type: 'relationship',
      relationTo: 'users',
      required: false, // ** NOT required to allow guest checkout **
      index: true,
      admin: {
        readOnly: true,
        description: 'Link to the user account if the purchase was made while logged in.',
      }
    },
    {
      name: 'guestEmail',
      label: 'Guest Email (if not logged in)',
      type: 'email',
      index: true,
      // Required only if 'orderedBy' is null/empty
    //   validate: (value, { siblingData }) => {
    //     if (!siblingData.orderedBy && !value) {
    //       return 'Guest Email is required if the order is not placed by a logged-in user.';
    //     }
    //     if (value && typeof value === 'string' && !value.includes('@')) {
    //         return 'Please enter a valid email address.'; // Basic format check
    //     }
    //     return true;
    //   },
      admin: {
        readOnly: true,
        condition: (data) => !data.orderedBy, // Show only if orderedBy is empty
      },
    },
    // --- Event Link ---
    {
      name: 'event',
      label: 'Event',
      type: 'relationship', relationTo: 'events', required: true, hasMany: false, index: true,
      admin: { readOnly: true },
    },
    // --- Order Status ---
    // {
    //   name: 'orderStatus', label: 'Order Status', type: 'select', required: true, index: true,
    //   options: [ /* Pending Payment, Processing, Failed, Paid, Refunded, Cancelled */ ], // As before
    //   defaultValue: 'pending', admin: { width: '50%' },
    // },
    // --- Order Items (Snapshot) ---
    {
      name: 'items', label: 'Order Items', type: 'array', required: true, minRows: 1, admin: { readOnly: true },
      fields: [ // Fields: ticketType (relationship), quantity, pricePerTicket, currency, subtotal (as defined before)
        { name: 'ticketType', label: 'Ticket Type', type: 'relationship', relationTo: 'ticket-types', required: true },
        { name: 'quantity', label: 'Qty', type: 'number', required: true, min: 1, admin: { width: '20%' } },
        { name: 'pricePerTicket', label: 'Price/Ticket', type: 'number', required: true, min: 0, admin: { width: '30%', step: 0.01 } },
        { name: 'currency', label: 'Currency', type: 'text', required: true, admin: { width: '20%' } },
        { name: 'subtotal', label: 'Subtotal', type: 'number', required: true, admin: { width: '30%', step: 0.01 } },
      ],
    },
    // --- Financial Summary ---
    { name: 'subtotalAmount', label: 'Items Subtotal', type: 'number', admin: { readOnly: true } }, // Sum of item subtotals
    { name: 'promotion', label: 'Applied Promotion', type: 'relationship', relationTo: 'promotions', hasMany: false, admin: { readOnly: true } },
    { name: 'discountAmount', label: 'Discount Applied', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'donationAmount', // ** NEW FIELD for Optional Donation **
      label: 'Optional Donation', type: 'number', min: 0, defaultValue: 0,
      admin: { description: 'Amount donated during checkout (if applicable).' }
    },
     { type: 'row', fields: [
        // Final amount needs calculation: subtotal + donation - discount
        { name: 'finalAmount', label: 'Final Amount Charged', type: 'number', required: true, min: 0, admin: { readOnly: true, width: '50%' } },
        { name: 'currency', label: 'Order Currency', type: 'text', required: true, admin: { readOnly: true, width: '50%' } },
      ]
    },
    // --- Payment & Notes ---
    { name: 'paymentIntentId', label: 'Payment Intent ID', type: 'text', index: true, admin: { readOnly: true } },
    { name: 'notes', label: 'Internal Order Notes', type: 'textarea' },
    // NOTE: Removed 'registrationData' JSON field - this will be handled by the dedicated 'Registrants' collection linked to this order.
  ],
  timestamps: true,
  hooks: {
    // Potential Hooks:
    // - beforeChange: Calculate/validate totals (subtotalAmount, finalAmount including donation/discount).
    // - afterChange: Trigger 'Transactions' log entry on status change (paid, refunded).
    //              Trigger ticket generation on 'paid' status (likely better in worker/saga).
  }
};

export default Orders;

// --- Example Complex Access Control Function Signature ---
// Needs careful implementation based on how guest identity is verified (e.g., session, signed URL?)
// import { Access } from 'payload/types';
// import { User } from '../payload-types';
// export const isOwnerOrAdmin_Complex = (userField: string, guestEmailField: string): Access<any, User> =>
//    async ({ req: { user, payload }, id: docId }) => {
//   if (user?.roles?.includes('admin')) return true; // Admin bypass

//   if (user) { // If user is logged in, check ownership via user link
//     return { [userField]: { equals: user.id } };
//   }

//   // --- Guest Access Logic ---
//   // This is tricky. How do we know the guest making the request owns this order?
//   // Requires a mechanism outside standard Payload auth, e.g.:
//   // 1. A temporary session set after checkout.
//   // 2. A unique, signed link sent to the guest's email.
//   // 3. Checking against an order ID + email provided in the request (less secure?).
//   // For standard API access, guest reads are likely disabled by default.
//   // This function would return 'false' for guests unless one of the above mechanisms is implemented
//   // and verified within custom endpoint logic or more advanced access control.
//   return false; // Default deny for guests in standard access control context
// };