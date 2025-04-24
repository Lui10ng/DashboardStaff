import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request }) => {
  const endpoint = params.endpoint;

  switch (endpoint) {
    case 'uploadImage':
        const formData = await request.formData();
        const uploads: any[] = [];

        for (const [key, value] of formData.entries()) {
            if (value instanceof File && value.size > 0) {
                console.log("Uploading:", key, value.name);

                // Create a new FormData for each file
                const form = new FormData();
                // const compressedBuffer = await value.arrayBuffer();
                // const compressedBlob = new Blob([compressedBuffer], { type: value.type });
                form.append('file', value);
                form.append('alt', value.name);
                form.append(
                    '_payload',
                    JSON.stringify({alt:value.name}),
                  )
                const url = `${env.PUBLIC_PAYLOAD_API_URL}api/media`;
                console.log("url",url);
                
                const res = await fetch(url, {
                    method: 'POST',
                    body: form,
                });

                if (!res.ok) {
                    console.error('Upload failed with status:', res.status);
                    const errorText = await res.text();
                    console.error('Error response:', errorText);
                    continue;
                }

                const temp = await res.json();
                uploads.push(temp);
            }
        }

        return json({ uploads });    

    case 'uploadPoster':
      // Handle poster upload
      return json({ message: 'Poster uploaded successfully' });

    default:
      return json({ error: 'Unknown endpoint' }, { status: 404 });
  }
};