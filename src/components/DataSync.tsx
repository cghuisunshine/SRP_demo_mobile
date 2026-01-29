import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function DataSync() {
    const { checkAuth, fetchStratas, fetchRequests, fetchNotifications } = useStore();

    useEffect(() => {
        const syncData = async () => {
            await checkAuth();
            await fetchStratas();
            await fetchRequests();
            await fetchNotifications();
        };

        syncData();
    }, []);

    return null;
}
