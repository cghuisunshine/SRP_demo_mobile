import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function DataSync() {
    const { checkAuth, fetchStratas, fetchRequests } = useStore();

    useEffect(() => {
        const syncData = async () => {
            await checkAuth();
            await fetchStratas();
            await fetchRequests();
        };

        syncData();
    }, []);

    return null;
}
