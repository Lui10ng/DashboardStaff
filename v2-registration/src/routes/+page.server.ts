import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from 'sveltekit-superforms';
import { env } from '$env/dynamic/private';
import { registration } from '$lib/schema/registration';

let eventID = '';
let createdBy = '';
let webhook = '';
let forms: any = null;

export const load = async ({ url }) => {
	const hostName = url.hostname;
	const subdomain = hostName.split('.')[0];

	if (
		hostName.includes('.localhost') ||
		hostName.includes('.test.com') ||
		hostName.includes('.veent.co')
	) {
		const formsResp = await fetch(
			`${env.PAYLOAD_PUBLIC_SERVER_URL}/api/events?where[subdomain][equals]=${subdomain}&depth=1`,
			{
				method: 'GET'
			}
		);
		forms = await formsResp.json();

		forms = forms.docs[0];
		eventID = forms.id;
		createdBy = forms.createdBy;

		if (forms.webhook != undefined || forms.webhook != '') {
			webhook = forms.webhook;
		}
	} else if (
		hostName.includes('veent-registration.vercel.app') ||
		hostName.includes('veent-registration-git-staging-veent-team.vercel.app')
	) {
		const formsResp = await fetch(
			`${env.PAYLOAD_PUBLIC_SERVER_URL}/api/events?where[subdomain][equals]=${subdomain}&depth=1`,
			{
				method: 'GET'
			}
		);
		forms = await formsResp.json();
		forms = forms.docs[0];
		eventID = forms.id;
		createdBy = forms.createdBy;
		if (forms.webhook != undefined || forms.webhook != '') {
			webhook = forms.webhook;
		}
	} else {
		// redirect(302, 'https://www.veent.io/');
	}

	const formBuilder = forms.formBuilder;

	const schema = registration(forms.formBuilder);
	const form = await superValidate(zod(schema));

	return { form, formBuilder };
};

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		const schema = registration(forms.formBuilder);
		const form = await superValidate(formData, zod(schema));

		console.log('form: ', form);

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('form: ', form.data.tabs);
	}
};

const doWebhook = async (webhook: any, form: any) => {
	// console.log("form.data",form.data);
	try {
		if (webhook != '' || webhook != undefined) {
			// console.log(webhook);
			const response = await fetch(webhook, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([form.data])
			});
			// console.log(await response.text());
		}
	} catch (error) {}
};

const checkPaymentStatus = async (paymongoSecretKey: string, checkoutID: string) => {
	const res = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${checkoutID}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			authorization: 'Basic ' + paymongoSecretKey
		}
	});
	const checkout_sessions = await res.json();
	return checkout_sessions;
};
