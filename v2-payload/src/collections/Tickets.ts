// src/collections/Tickets.ts
import type { CollectionConfig } from 'payload';
import { v4 as uuidv4 } from 'uuid'; // For unique ticket codes
// import { isAdmin } from '../access/isAdmin';
// Needs complex access control: Owner (user or via Order guest email), Organizer, Check-in Staff, Admin
// import { isTicketHolderOrAdmin } from '../access/isTicketHolderOrAdmin'; // Example custom access
import type { User } from '../payload-types';

const Tickets: CollectionConfig = {
  slug: 'tickets',
  admin: {
    useAsTitle: 'ticketCode',
    description: 'Individual tickets issued per order, used for check-in.',
    // Add fields to columns to show guest info if no user linked? Requires some hook/virtual field logic.
    defaultColumns: ['ticketCode', 'attendee', 'event', 'ticketType', 'checkInStatus', 'assignedSeat.seatNumber'],
    listSearchableFields: ['ticketCode'], // Maybe search associated Order's guestEmail?
    // disableCreation: true, // Tickets generated programmatically from paid Orders
    group: 'Orders & Tickets',
  },
  // Access Control Notes:
  // - Logged-in User (`attendee`) should see their own tickets.
  // - Guests need a secure way (e.g., unique link via email using order details) to view their ticket/QR code.
  // - Organizer for the `event` should see all tickets for that event.
  // - Check-in Staff role should have read access and update access ONLY to checkInStatus/related fields.
  // - Admins see all.
  access: {
    // read: isTicketHolderOrAdmin, // Complex check needed (is Admin OR attendee matches user OR user is organizer for event OR user is check-in staff for event...)
    // create: isAdmin, // System/Admin creates programmatically
    // update: ({ req: { user } }) => user?.roles?.includes('admin') || user?.roles?.includes('check-in-staff'), // Example for check-in
    // delete: isAdmin,
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    // Generate unique ticket code
    // beforeValidate: [
    //   (args) => {
    //     const { data } = args;
    //     if (!data.ticketCode) { data.ticketCode = uuidv4(); }
    //     return data;
    //   }
    // ],
    // Handle check-in timestamp/user updates
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation === 'update' && data.checkInStatus === 'checked_in' && originalDoc?.checkInStatus !== 'checked_in') {
          data.checkedInAt = new Date().toISOString();
          if (req.user) { data.checkedInBy = req.user.id; }
        }
        if (operation === 'update' && data.checkInStatus !== 'checked_in' && originalDoc?.checkInStatus === 'checked_in') {
           data.checkedInAt = null;
           data.checkedInBy = null;
        }
        return data;
      }
    ]
  },
  fields: [
    // --- Core Relationships (Set on Creation) ---
    { name: 'order', label: 'Originating Order', type: 'relationship', relationTo: 'orders', required: true, index: true, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'event', label: 'Event', type: 'relationship', relationTo: 'events', required: true, index: true, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'ticketType', label: 'Ticket Type', type: 'relationship', relationTo: 'ticket-types', required: true, index: true, admin: { readOnly: true, position: 'sidebar' } },

    // --- Ticket Holder Identification ---
    {
      name: 'attendee',
      label: 'Attendee (User Account)',
      type: 'relationship',
      relationTo: 'users',
      required: false, // ** Optional: Allows for guest tickets **
      index: true,
      admin: {
        readOnly: true,
        description: 'Link to the user account, if the ticket holder has one and was logged in during purchase/registration.',
        condition: (data) => Boolean(data.attendee) // Only show if linked
      },
    },
    // Note: For guest tickets (where 'attendee' is null), identity (name/email) is primarily tracked
    // via the associated 'Registrants' document or potentially the 'Orders' document based on your workflow.
    // You might add read-only virtual fields here in Admin UI to display guest name/email pulled from related record.

    // --- Unique ID & Check-in ---
    {
      name: 'ticketCode', label: 'Ticket Code (QR)', type: 'text',
      required: true, unique: true, index: true,
      admin: { readOnly: true, description: 'Unique identifier for check-in/QR code.' },
    },
    {
      name: 'checkInStatus', label: 'Check-In Status', type: 'select', enumName: 'CheckInStatus',
      options: [ { label: 'Pending Check-In', value: 'pending' }, { label: 'Checked In', value: 'checked_in' }, { label: 'Invalid / Denied', value: 'invalid' }],
      defaultValue: 'pending', required: true, index: true,
    },
    { name: 'checkedInAt', label: 'Checked-In At', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'checkedInBy', label: 'Checked-In By Staff', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },

    // --- Reserved Seating Info ---
    {
      name: 'assignedSeat',
      label: 'Assigned Seat (Reserved Seating Only)',
      type: 'group',
      admin: {
        description: 'Specific seat assignment; only relevant if the linked event uses reserved seating.',
        // Displaying this conditionally based on related Event.seatingType requires
        // more advanced Admin UI customization or is handled by frontend logic.
      },
      fields: [
        { name: 'seatMapSection', label: 'Section', type: 'text', admin: { width: '33%' } },
        { name: 'seatMapRow', label: 'Row', type: 'text', admin: { width: '33%' } },
        { name: 'seatMapNumber', label: 'Seat', type: 'text', admin: { width: '33%' } },
      ],
      // NOTE: This data is populated programmatically during ticket generation for reserved seating events,
      // based on the selected/assigned seat from the Event's linked SeatMap.
    },
  ],
  timestamps: true,
};

export default Tickets;