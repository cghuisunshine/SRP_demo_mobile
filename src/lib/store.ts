// SRP Portal - Global State Store
// Fetches data from Axum Rust backend

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    User,
    Strata,
    ServiceRequest,
    Document,
    Appointment,
    NotificationItem,
    AuthState,
    SurveyResponse,
    HubStatus,
} from './types';

interface AppState {
    // Auth
    auth: AuthState;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;

    // Data
    users: User[];
    stratas: Strata[];
    serviceRequests: ServiceRequest[];
    hubStatus: HubStatus | null;
    currentStrata: Strata | null;
    documents: Document[];
    appointments: Appointment[];
    notifications: NotificationItem[];
    surveyResponses: SurveyResponse[];
    logisticsBooking: any; // Added logistics booking state

    // Fetching Actions
    fetchStratas: () => Promise<void>;
    fetchRequests: () => Promise<void>;
    calculateTimeline: (params: any) => Promise<any>;
    fetchHubStatus: () => Promise<void>;
    fetchStrata: (id: string) => Promise<void>;
    updateStrata: (strata: Partial<Strata>) => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchNotifications: () => Promise<void>;

    // Actions
    updateServiceRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<void>;
    addDocument: (doc: Document) => Promise<void>;
    updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
    addAppointment: (appointment: Appointment) => Promise<void>;
    updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
    saveSurveyResponse: (response: SurveyResponse) => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;

    // Helpers
    getCurrentUserStrata: () => Strata | null;
    getCurrentUserServiceRequest: () => ServiceRequest | null;
    getUnreadNotificationCount: () => number;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial Auth State
            auth: {
                isAuthenticated: false,
                currentUser: null,
            },

            // Initial Data
            users: [],
            stratas: [],
            serviceRequests: [],
            documents: [],
            appointments: [],
            notifications: [],
            surveyResponses: [],
            hubStatus: null,
            currentStrata: null,
            logisticsBooking: null, // Initial state for logistics booking

            // Auth Actions
            login: async (email, password) => {
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({
                            auth: {
                                isAuthenticated: true,
                                currentUser: data.user,
                                token: data.token,
                            },
                        });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Login error:', error);
                    return false;
                }
            },

            checkAuth: async () => {
                try {
                    const response = await fetch('/api/auth/me');
                    if (response.ok) {
                        const user = await response.json();
                        set((state) => ({
                            auth: { ...state.auth, isAuthenticated: true, currentUser: user },
                        }));
                    } else {
                        set({ auth: { isAuthenticated: false, currentUser: null } });
                    }
                } catch (error) {
                    set({ auth: { isAuthenticated: false, currentUser: null } });
                }
            },

            logout: () => {
                set({
                    auth: {
                        isAuthenticated: false,
                        currentUser: null,
                    },
                });
            },

            // Fetching Actions
            fetchStratas: async () => {
                try {
                    const response = await fetch('/api/stratas');
                    if (response.ok) {
                        const data = await response.json();
                        set({ stratas: data });
                    }
                } catch (error) {
                    console.error('Fetch stratas error:', error);
                }
            },

            fetchRequests: async () => {
                try {
                    const response = await fetch('/api/stratas/requests');
                    if (response.ok) {
                        const data = await response.json();
                        set({ serviceRequests: data });
                    }
                } catch (error) {
                    console.error('Fetch requests error:', error);
                }
            },

            calculateTimeline: async (params) => {
                try {
                    const response = await fetch('/api/stratas/calculate-timeline', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(params),
                    });
                    if (response.ok) {
                        return await response.json();
                    }
                    return null;
                } catch (error) {
                    console.error('Calculate timeline error:', error);
                    return null;
                }
            },

            fetchHubStatus: async () => {
                try {
                    const response = await fetch('/api/surveys/status');
                    if (response.ok) {
                        const data = await response.json();
                        set({ hubStatus: data });
                    }
                } catch (error) {
                    console.error('Fetch hub status error:', error);
                }
            },

            fetchStrata: async (id: string) => {
                try {
                    const response = await fetch(`/api/stratas/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        set({ currentStrata: data });
                    }
                } catch (error) {
                    console.error('Failed to fetch strata:', error);
                }
            },

            updateStrata: async (updates: Partial<Strata>) => {
                try {
                    const response = await fetch(`/api/stratas/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        set({ currentStrata: data });
                    }
                } catch (error) {
                    console.error('Failed to update strata:', error);
                }
            },

            fetchUsers: async () => {
                try {
                    const response = await fetch('/api/users');
                    if (response.ok) {
                        const data = await response.json();
                        set({ users: data });
                    }
                } catch (error) {
                    console.error('Fetch users error:', error);
                }
            },

            fetchNotifications: async () => {
                try {
                    const response = await fetch('/api/notifications');
                    if (!response.ok) return;
                    const data = await response.json();
                    set({ notifications: data });
                } catch {
                    // In non-demo builds this endpoint may not exist.
                }
            },

            // Service Request Actions
            updateServiceRequest: async (id, updates) => {
                set((state) => ({
                    serviceRequests: state.serviceRequests.map((sr) =>
                        sr.id === id ? { ...sr, ...updates, updatedAt: new Date().toISOString() } : sr
                    ),
                }));
            },

            // Document Actions
            addDocument: async (doc) => {
                set((state) => ({
                    documents: [...state.documents, doc],
                }));
            },

            updateDocument: async (id, updates) => {
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, ...updates } : doc
                    ),
                }));
            },

            // Appointment Actions
            addAppointment: async (appointment) => {
                set((state) => ({
                    appointments: [...state.appointments, appointment],
                }));
            },

            updateAppointment: async (id, updates) => {
                set((state) => ({
                    appointments: state.appointments.map((appt) =>
                        appt.id === id ? { ...appt, ...updates, updatedAt: new Date().toISOString() } : appt
                    ),
                }));
            },

            // Survey Actions
            saveSurveyResponse: async (response) => {
                set((state) => {
                    const existing = state.surveyResponses.find(
                        (sr) =>
                            sr.serviceRequestId === response.serviceRequestId &&
                            sr.sectionId === response.sectionId
                    );

                    if (existing) {
                        return {
                            surveyResponses: state.surveyResponses.map((sr) =>
                                sr.id === existing.id
                                    ? { ...response, updatedAt: new Date().toISOString() }
                                    : sr
                            ),
                        };
                    } else {
                        return {
                            surveyResponses: [...state.surveyResponses, response],
                        };
                    }
                });
            },

            // Notification Actions
            markNotificationRead: async (id) => {
                set((state) => ({
                    notifications: state.notifications.map((notif) =>
                        notif.id === id ? { ...notif, read: true } : notif
                    ),
                }));
            },

            // Helper Functions
            getCurrentUserStrata: () => {
                const { auth, stratas } = get();
                const currentUser = auth.currentUser;
                if (!currentUser?.strataId) return null;
                return stratas.find((s: Strata) => s.id === currentUser.strataId) || null;
            },

            getCurrentUserServiceRequest: () => {
                const { serviceRequests } = get();
                const strata = get().getCurrentUserStrata();
                if (!strata) return null;

                return (
                    serviceRequests.find((sr) => sr.strataId === strata.id) || null
                );
            },

            getUnreadNotificationCount: () => {
                const { auth, notifications } = get();
                if (!auth.currentUser) return 0;

                return notifications.filter(
                    (n) => n.userId === auth.currentUser!.id && !n.read
                ).length;
            },
        }),
        {
            name: 'srp-portal-storage',
            storage: {
                getItem: (name: string) => {
                    if (typeof window === 'undefined') return null;
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name: string, value: any) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(name, JSON.stringify(value));
                    }
                },
                removeItem: (name: string) => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(name);
                    }
                },
            } as any,
            partialize: (state: AppState) => ({
                auth: state.auth,
                surveyResponses: state.surveyResponses,
                documents: state.documents,
                appointments: state.appointments,
            } as any),
        }
    )
);
