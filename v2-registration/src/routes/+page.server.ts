import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
import { fail } from 'sveltekit-superforms';
import { env } from '$env/dynamic/private';
import { registration } from '$lib/schema/registration';
import { AWS_URL } from '$env/static/private';

let eventID = '';
let createdBy = '';
let webhook = '';
let eventDetails: any = null;

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
		eventDetails = await formsResp.json();

		eventDetails = eventDetails.docs[0];
		eventID = eventDetails.id;
		createdBy = eventDetails.createdBy;

		if (eventDetails.webhook != undefined || eventDetails.webhook != '') {
			webhook = eventDetails.webhook;
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
		eventDetails = await formsResp.json();
		eventDetails = eventDetails.docs[0];
		eventID = eventDetails.id;
		createdBy = eventDetails.createdBy;
		if (eventDetails.webhook != undefined || eventDetails.webhook != '') {
			webhook = eventDetails.webhook;
		}
	} else {
		// redirect(302, 'https://www.veent.io/');
	}

	const formBuilder = eventDetails.formBuilder;

	formBuilder.push({
		name: 'paymentType',
		fieldType: 'json',
		label: 'Tickets',
		ticketData: eventDetails.paymentType
	});

	const schema = registration(formBuilder);
	const form = await superValidate(zod(schema));

	const serverTime = new Date();

	return { form, formBuilder, eventDetails, AWS_URL, serverTime };
};

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		const schema = registration(eventDetails.formBuilder);
		const form = await superValidate(formData, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('form: ', form.data.tabs);

		return message(form, { success: true, message: 'Registration successful!' });
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
