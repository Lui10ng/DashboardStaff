// src/collections/Promotions.ts
import type { CollectionConfig } from 'payload';
// import { isAdmin } from '../access/isAdmin'; // Assume only admins manage promotions

const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: {
    useAsTitle: 'code',
    description: 'Manage discount codes and promotions for ticket orders.',
    defaultColumns: ['code', 'discountType', 'discountValue', 'status', 'usageLimit', 'validUntil'],
    listSearchableFields: ['code', 'description'],
    group: 'Configuration', // Group with other config items
  },
  access: {
    // Usually restricted to Admins
    // read: isAdmin,
    // create: isAdmin,
    // update: isAdmin,
    // delete: isAdmin,
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    // Force code to uppercase for easier case-insensitive lookup
    beforeChange: [
      ({ data }) => {
        if (data.code) {
          data.code = data.code.toUpperCase().trim();
        }
        return data;
      }
    ]
  },
  fields: [
    {
      name: 'code',
      label: 'Promo Code',
      type: 'text', required: true, unique: true, index: true,
      admin: { description: 'The code users enter (forced uppercase). e.g., EARLYBIRD20' },
    },
    { name: 'description', label: 'Internal Description', type: 'textarea', required: true },
    {
      name: 'status', label: 'Status', type: 'select', enumName: 'PromotionStatus', index: true,
      options: [ { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }, { label: 'Expired', value: 'expired' } ],
      defaultValue: 'active', required: true, admin: { position: 'sidebar' }
    },
    // --- Discount ---
    { type: 'row', fields: [
        { name: 'discountType', label: 'Type', type: 'select', enumName: 'DiscountType', options: [ { label: 'Percentage Off (%)', value: 'percentage' }, { label: 'Fixed Amount Off', value: 'fixed_amount' } ], required: true, admin: { width: '50%' } },
        { name: 'discountValue', label: 'Value', type: 'number', required: true, min: 0, admin: { width: '50%', step: 0.01, description: '% or fixed amount' } },
      ],
    },
    {
      name: 'currency', label: 'Currency (for Fixed Amount)', type: 'select', enumName: 'CurrencyType',
      options: [ { label: 'USD', value: 'USD' }, { label: 'PHP', value: 'PHP' }, { label: 'EUR', value: 'EUR' } ],
      admin: { condition: (data) => data.discountType === 'fixed_amount' },
    //   validate: (value, { siblingData }) => (siblingData.discountType === 'fixed_amount' && !value) ? 'Currency required for fixed amount discounts.' : true,
    },
    // --- Rules & Limits ---
    { name: 'usageLimit', label: 'Total Usage Limit', type: 'number', min: 0, admin: { description: 'Optional: Max total uses. Blank for unlimited.' } },
    { type: 'row', fields: [
        { name: 'validFrom', label: 'Valid From', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'validUntil', label: 'Valid Until', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        //   validate: (value, { siblingData }) => { /* Ensure end > start */ return (siblingData.validFrom && value && new Date(value) <= new Date(siblingData.validFrom)) ? 'Valid Until must be after Valid From.' : true; },
        },
      ]
    },
    { name: 'minimumOrderAmount', label: 'Minimum Order Amount', type: 'number', min: 0, admin: { description: 'Optional: Order total must meet this amount.' } },
    // --- Applicability ---
    { name: 'appliesToAllEvents', label: 'Applies To All Events?', type: 'checkbox', defaultValue: true },
    {
      name: 'applicableEvents', label: 'Applicable Events', type: 'relationship', relationTo: 'events', hasMany: true,
      admin: { condition: (data) => !data.appliesToAllEvents, description: 'Only applies to these specific events if not checked above.' },
      // NOTE: Your checkout logic needs to fetch the promotion and check these rules
      // against the event(s) in the user's cart/order before applying the discount.
    },
  ],
  timestamps: true,
};

export default Promotions;