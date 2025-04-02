
import type { FormData } from '../../routes/[eventId]/form/types';

let initialFormData: FormData = {
    title: 'Registration Form',
    description: 'Please fill out this registration form',
    formBuilder: []
};

const setFormData = (data: FormData) => {
    if (data) {
        formState = data;
    }
};

let formState = $state<FormData>(initialFormData); 

export const formStore = {
    formState,
    setFormData,
    getFormData: () => formState
};