import { Language, FactCheckArticle } from '../types';

const API_BASE_URL = '/api';

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('auth_token');

// Helper to create auth headers
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
});

export const api = {
    // Auth
    login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
    },

    getCurrentUser: async () => {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to get user');
        return res.json();
    },

    // Articles (Public)
    getArticles: async (lang: Language, limit: number = 10, offset: number = 0): Promise<FactCheckArticle[]> => {
        const res = await fetch(`${API_BASE_URL}/articles?lang=${lang}&limit=${limit}&offset=${offset}`);
        if (!res.ok) throw new Error('Failed to fetch articles');
        return res.json();
    },

    getArticleById: async (id: string, lang: Language): Promise<FactCheckArticle> => {
        const res = await fetch(`${API_BASE_URL}/articles/${id}?lang=${lang}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
    },

    // Articles (Admin)
    createArticle: async (article: any) => {
        const res = await fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(article),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create article');
        }
        return res.json();
    },

    updateArticle: async (id: string, article: any) => {
        const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(article),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to update article');
        }
        return res.json();
    },

    deleteArticle: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete article');
        return res.json();
    },

    // Claims
    submitClaim: async (claim: string, source?: string, evidence?: string) => {
        const res = await fetch(`${API_BASE_URL}/claims`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claim, source, evidence }),
        });
        if (!res.ok) throw new Error('Failed to submit claim');
        return res.json();
    },

    getClaims: async (status?: string) => {
        const url = status ? `${API_BASE_URL}/claims?status=${status}` : `${API_BASE_URL}/claims`;
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) throw new Error('Failed to fetch claims');
        return res.json();
    },

    updateClaimStatus: async (id: string, status: string) => {
        const res = await fetch(`${API_BASE_URL}/claims/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update claim');
        return res.json();
    },

    // Newsletter
    subscribeNewsletter: async (email: string) => {
        const res = await fetch(`${API_BASE_URL}/newsletter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error('Failed to subscribe');
        return res.json();
    },

    getNewsletterSubscribers: async () => {
        const res = await fetch(`${API_BASE_URL}/newsletter`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch subscribers');
        return res.json();
    },

    // Admin
    getAdminStats: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    getUsers: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    updateUserRole: async (id: string, role: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error('Failed to update user role');
        return res.json();
    },

    // Content
    getPageContent: async (slug: string) => {
        const res = await fetch(`${API_BASE_URL}/content/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch content');
        return res.json();
    },

    getAllPages: async () => {
        const res = await fetch(`${API_BASE_URL}/content`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch pages');
        return res.json();
    },

    updatePageContent: async (slug: string, data: any) => {
        const res = await fetch(`${API_BASE_URL}/content/${slug}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update content');
        return res.json();
    },

    // Careers
    getCareers: async () => {
        const res = await fetch(`${API_BASE_URL}/careers`);
        if (!res.ok) throw new Error('Failed to fetch careers');
        return res.json();
    },

    getAllCareers: async () => {
        const res = await fetch(`${API_BASE_URL}/careers/all`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch all careers');
        return res.json();
    },

    createCareer: async (career: any) => {
        const res = await fetch(`${API_BASE_URL}/careers`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(career),
        });
        if (!res.ok) throw new Error('Failed to create career');
        return res.json();
    },

    updateCareer: async (id: string, career: any) => {
        const res = await fetch(`${API_BASE_URL}/careers/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(career),
        });
        if (!res.ok) throw new Error('Failed to update career');
        return res.json();
    },

    deleteCareer: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/careers/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete career');
        return res.json();
    },

    applyToCareer: async (id: string, application: any) => {
        const res = await fetch(`${API_BASE_URL}/careers/${id}/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(application),
        });
        if (!res.ok) throw new Error('Failed to submit application');
        return res.json();
    },

    getJobApplications: async () => {
        const res = await fetch(`${API_BASE_URL}/careers/applications/all`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
    },

    updateApplicationStatus: async (id: string, status: string, notes?: string) => {
        const res = await fetch(`${API_BASE_URL}/careers/applications/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ status, notes }),
        });
        if (!res.ok) throw new Error('Failed to update application');
        return res.json();
    },

    // Upload
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload image');
        return res.json();
    },

    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE_URL}/upload/file`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload file');
        return res.json();
    },

    // Settings
    getSettings: async () => {
        const res = await fetch(`${API_BASE_URL}/settings`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
    },

    updateSettings: async (settings: any) => {
        const res = await fetch(`${API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(settings),
        });
        if (!res.ok) throw new Error('Failed to update settings');
        return res.json();
    },

    // Video URLs (multiple)
    getVideoUrls: async () => {
        const res = await fetch('/api/video-url', {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to fetch video URLs');
        return res.json(); // returns array
    },

    addVideoUrl: async (url: string) => {
        const res = await fetch('/api/video-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });
        if (!res.ok) throw new Error('Failed to save video URL');
        return res.json();
    },

    deleteVideoUrl: async (id: string) => {
        const res = await fetch(`/api/video-url/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to delete video URL');
        return res.json();
    },
    // AI Content Generation
    generateContent: async (claim: string) => {
        const res = await fetch(`${API_BASE_URL}/ai-content/generate-content`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ claim }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to generate content');
        }

        return res.json();
    },
};
