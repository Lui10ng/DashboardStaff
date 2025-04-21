import { CollectionConfig } from 'payload/types'

const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'title',
    group: 'Configuration',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Registration Form',
    },
    {
      name: 'description',
      type: 'text',
      defaultValue: 'Please fill out this registration form',
    },
    {
      name: 'formBuilder',
      type: 'array',
      label: 'Form Fields',
      defaultValue: [
        {
          name: 'firstName',
          label: 'First Name',
          required: true,
          fieldType: 'text',
          id: '67d76d34a51bc30a88bf0528',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          required: true,
          fieldType: 'text',
          id: '67d76d34a51bc30a88bf0529',
        },
        {
          name: 'contactNumber',
          label: 'Contact Number',
          required: true,
          fieldType: 'text',
          id: '67d76d34a51bc30a88bf052a',
        },
        {
          name: 'email',
          label: 'Email',
          required: true,
          fieldType: 'email',
          id: '67d76d34a51bc30a88bf052b',
        },
      ],
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'Number', value: 'number' },
            { label: 'Date', value: 'date' },
            { label: 'Time', value: 'time' },
            { label: 'Multiple Choice', value: 'multipleChoice' },
            { label: 'Checkbox', value: 'checkbox' },
            { label: 'Dropdown', value: 'dropdown' },
            { label: 'File', value: 'file' },
            { label: 'Short Text', value: 'shortText' },
            { label: 'Long Text', value: 'longText' },
            { label: 'Region', value: 'region' },
            { label: 'City', value: 'city' },
          ],
        },
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'responses',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'fieldId',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'submittedAt',
          type: 'date',
        },
      ],
    },
  ],
}

export default Forms
