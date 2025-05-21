import type { PageServerLoad, Actions } from './$types';
import type { Staff } from '$lib/types/staff';
import { PUBLIC_PAYLOAD_API_URL } from '$env/static/public';
import { error, fail, redirect } from '@sveltejs/kit';
import { PLATFORM_ROLES } from '$lib/types/users';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
    try {
        const auth = await locals.auth();
        if (!auth) {
            throw redirect(303, '/login');
        }

        const token = await auth.getToken();
        if (!token) {
            throw redirect(303, '/login');
        }

        // First get all users
        const usersUrl = `${PUBLIC_PAYLOAD_API_URL}/api/users`;
        const usersResponse = await fetch(usersUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!usersResponse.ok) {
            const errorText = await usersResponse.text();
            console.error('Users API Error:', {
                status: usersResponse.status,
                statusText: usersResponse.statusText,
                body: errorText
            });
            throw error(usersResponse.status, `Failed to fetch users: ${errorText}`);
        }

        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);

        if (!usersData.docs) {
            console.error('No docs array in users data:', usersData);
            throw error(500, 'Invalid response format from users API');
        }

        // Map all users to staff members
        const staffMembers: Staff[] = usersData.docs.map((user: any) => ({
            id: user.id,
            name: user.name || 'N/A',
            email: user.email || 'N/A',
            clerkRoles: user.clerkRoles || [],
            userStatus: user.userStatus || 'active',
            phone: user.phone || '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            loginAttempts: user.loginAttempts || 0
        }));

        return {
            staffMembers: staffMembers.filter((staff: Staff) => staff.userStatus === 'active')
        };

    } catch (err) {
        console.error('Load function error:', err);
        
        if (err instanceof Error) {
            if (err.message === 'No authentication token available') {
                throw redirect(303, '/login');
            }
            throw error(500, `Server error: ${err.message}`);
        }
        
        throw error(500, 'An unexpected error occurred while loading staff data');
    }
};


export const actions = {
    removeStaff: async ({ request, fetch, locals }) => {
        const auth = await locals.auth();
        if (!auth) {
            return fail(401, { error: 'Not authenticated' });
        }
    
        const token = await auth.getToken();
        if (!token) {
            return fail(401, { error: 'No token available' });
        }
    
        try {
            const formData = await request.formData();
            const userId = formData.get('userId')?.toString();
    
            if (!userId) {
                return fail(400, { 
                    type: 'error',
                    error: { message: 'User ID is required' }
                });
            }
    
            // First, delete all event_user_roles for this user
            const deleteRolesResponse = await fetch(`${PUBLIC_PAYLOAD_API_URL}/api/event-user-roles?where[user][equals]=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
    
            if (!deleteRolesResponse.ok) {
                console.error('Failed to delete event roles:', await deleteRolesResponse.text());
                // Continue with user deletion even if role deletion fails
            }
    
            // Now delete the user
            const deleteResponse = await fetch(`${PUBLIC_PAYLOAD_API_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
    
            if (!deleteResponse.ok) {
                const error = await deleteResponse.json();
                return fail(deleteResponse.status, { 
                    type: 'error',
                    error: { message: error.message || 'Failed to remove staff member' }
                });
            }
    
            return { 
                type: 'success',
                message: 'Staff member removed successfully'
            };
        } catch (err) {
            console.error('Error removing staff:', err);
            return fail(500, {
                type: 'error',
                error: { message: err instanceof Error ? err.message : 'Failed to remove staff member' }
            });
        }
    },

    inviteStaff: async ({ request, fetch, locals }) => {
        const auth = await locals.auth();
        if (!auth) {
            return fail(401, { error: 'Not authenticated' });
        }

        const token = await auth.getToken();
        if (!token) {
            return fail(401, { error: 'No token available' });
        }

        try {
            const formData = await request.formData();
            const roles = formData.getAll('roles');
            
            const name = formData.get('name')?.toString().trim();
            const email = formData.get('email')?.toString().trim().toLowerCase();
            const phone = formData.get('phone')?.toString().trim();

            if (!name || !email) {
                return fail(400, {
                    type: 'error',
                    error: { message: 'Name and email are required' }
                });
            }

            // Generate a temporary password
            const tempPassword = Math.random().toString(36).slice(-8);

            const userData = {
                name,
                email,
                phone,
                password: tempPassword,
                clerkRoles: roles,
                userStatus: 'active' // Set to active immediately
            };

            const response = await fetch(`${PUBLIC_PAYLOAD_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                return fail(response.status, { 
                    type: 'error',
                    error: { 
                        message: errorData.errors?.[0]?.message || 'Failed to create staff member',
                        details: errorData
                    }
                });
            }

            const responseData = await response.json();
            return { type: 'success', data: responseData };
        } catch (err) {
            console.error('Invite staff error:', err);
            return fail(500, {
                type: 'error',
                error: { 
                    message: err instanceof Error ? err.message : 'Failed to invite staff member',
                    details: err
                }
            });
        }
    },

    declineStaff: async ({ request, fetch, locals, params }) => {
        const auth = await locals.auth();
        if (!auth) {
            return fail(401, { error: 'Not authenticated' });
        }

        const token = await auth.getToken();
        if (!token) {
            return fail(401, { error: 'No token available' });
        }

        try {
            const formData = await request.formData();
            const userId = formData.get('userId')?.toString();
            const eventId = params.eventId; // Get eventId from route params

            if (!userId) {
                return fail(400, { 
                    type: 'error',
                    error: { message: 'User ID is required' }
                });
            }

            if (!eventId) {
                return fail(400, { 
                    type: 'error',
                    error: { message: 'Event ID is required' }
                });
            }

            // First, delete all event_user_roles for this user and event
            const deleteRolesResponse = await fetch(
                `${PUBLIC_PAYLOAD_API_URL}/api/event-user-roles?where[user][equals]=${userId}&where[event][equals]=${eventId}`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            if (!deleteRolesResponse.ok) {
                console.error('Failed to delete event roles:', await deleteRolesResponse.text());
                // Continue with user deletion even if role deletion fails
            }

            // Now delete the user
            const deleteResponse = await fetch(`${PUBLIC_PAYLOAD_API_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!deleteResponse.ok) {
                const error = await deleteResponse.json();
                return fail(deleteResponse.status, { 
                    type: 'error',
                    error: { message: error.message || 'Failed to decline staff member' }
                });
            }

            return { 
                type: 'success',
                message: 'Staff member declined successfully'
            };
        } catch (err) {
            console.error('Error declining staff:', err);
            return fail(500, {
                type: 'error',
                error: { message: err instanceof Error ? err.message : 'Failed to decline staff member' }
            });
        }
    }
    
} satisfies Actions;