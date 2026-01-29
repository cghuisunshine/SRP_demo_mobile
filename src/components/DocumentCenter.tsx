import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
    Upload,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    Search,
    ChevronLeft,
    Trash2
} from 'lucide-react';
import { Input } from './ui/input';
import { useStore } from '@/lib/store';
import { withBase } from '@/lib/base';
import { emitEmailEvent } from '@/lib/email';

interface DocCategory {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'uploaded' | 'n/a';
    type: 'mandatory' | 'optional';
}

interface DocumentCenterProps {
    initialCategories?: any[];
}

export function DocumentCenter({ initialCategories = [] }: DocumentCenterProps) {
    const { auth, documents: storeDocs, addDocument, updateDocument, getCurrentUserServiceRequest, getCurrentUserStrata } = useStore();

    const strataPlan = getCurrentUserStrata()?.strataPlan || 'VIS 2345';

    const markDocsCompleteOnce = async (nextDocs: DocCategory[]) => {
        const mandatoryDone = nextDocs.filter((d) => d.type === 'mandatory').every((d) => d.status !== 'pending');
        if (!mandatoryDone) return;
        try {
            const key = `srp-demo-docs-complete-sent:${strataPlan}`;
            if (localStorage.getItem(key) === '1') return;
            localStorage.setItem(key, '1');
        } catch {
            // ignore
        }
        await emitEmailEvent('documents_complete', { strataPlan });
    };

    const getPersistedStatus = (id: string): DocCategory['status'] => {
        try {
            const raw = localStorage.getItem('srp-mock-db-v1');
            if (!raw) return 'pending';
            const parsed = JSON.parse(raw) as any;
            const status = parsed?.docStatusById?.[id];
            if (status === 'uploaded' || status === 'pending' || status === 'n/a') return status;
            return 'pending';
        } catch {
            return 'pending';
        }
    };

    const [docs, setDocs] = useState<DocCategory[]>(() =>
        initialCategories.map(c => ({
            ...c,
            status: typeof window !== 'undefined' ? getPersistedStatus(c.id) : 'pending'
        } as DocCategory))
    );
    const [search, setSearch] = useState('');
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    // Sync if initialCategories change (e.g. during HMR)
    useEffect(() => {
        if (initialCategories.length > 0 && docs.length === 0) {
            setDocs(initialCategories.map(c => ({
                ...c,
                status: typeof window !== 'undefined' ? getPersistedStatus(c.id) : 'pending'
            } as DocCategory)));
        }
    }, [initialCategories]);

    // Seed global document state so other pages (e.g. scheduler) can reflect progress.
    useEffect(() => {
        const currentUserId = auth.currentUser?.id || 'user-client-1';
        const serviceRequestId = getCurrentUserServiceRequest()?.id || 'req-1';

        initialCategories.forEach((c: any) => {
            const exists = storeDocs.some((d: any) => d.id === c.id);
            if (exists) return;

            addDocument({
                id: c.id,
                serviceRequestId,
                name: c.name,
                fileName: '',
                documentType: c.name,
                category: c.type === 'mandatory' ? 'mandatory' : 'if_available',
                status: (typeof window !== 'undefined' ? getPersistedStatus(c.id) : 'pending') === 'uploaded' ? 'uploaded' : 'pending',
                uploadedBy: currentUserId,
                uploadedAt: undefined,
                reviewedBy: undefined,
                reviewedAt: undefined,
                fileSize: undefined,
                mimeType: undefined,
            } as any);
        });
    }, [initialCategories, storeDocs, auth.currentUser?.id, addDocument, getCurrentUserServiceRequest]);

    const filteredDocs = useMemo(() => {
        return docs.filter(d =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [docs, search]);

    const progress = useMemo(() => {
        const completed = docs.filter(d => d.status !== 'pending').length;
        return Math.round((completed / docs.length) * 100);
    }, [docs]);

    const persistDocStatus = async (id: string, status: DocCategory['status']) => {
        try {
            await fetch('/api/surveys/save-doc-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId: id, status })
            });
        } catch (e) {
            console.error('Failed to persist doc status:', e);
        }
    };

    const handleUpload = async (id: string) => {
        setUploadingId(id);
        // Mock upload delay
        setTimeout(async () => {
            let nextDocs: DocCategory[] = [];
            setDocs((prev) => {
                nextDocs = prev.map((d) => (d.id === id ? { ...d, status: 'uploaded' as const } : d));
                return nextDocs;
            });

            updateDocument(id, { status: 'uploaded', uploadedAt: new Date().toISOString() } as any);
            await persistDocStatus(id, 'uploaded');

            const doc = nextDocs.find((d) => d.id === id);
            await emitEmailEvent('document_uploaded', {
                strataPlan,
                documentId: id,
                documentName: doc?.name || id,
            });
            await markDocsCompleteOnce(nextDocs);

            setUploadingId(null);
        }, 1500);
    };

    const handleNA = async (id: string) => {
        let nextDocs: DocCategory[] = [];
        setDocs((prev) => {
            nextDocs = prev.map((d) => (d.id === id ? { ...d, status: 'n/a' as const } : d));
            return nextDocs;
        });
        // Treat N/A as reviewed in the global state (it should not block the demo).
        updateDocument(id, { status: 'reviewed' } as any);
        await persistDocStatus(id, 'n/a');
        await markDocsCompleteOnce(nextDocs);
    };

    const handleReset = async (id: string) => {
        setDocs(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'pending' as const } : d
        ));
        updateDocument(id, { status: 'pending' } as any);
        await persistDocStatus(id, 'pending');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div className="space-y-2 flex-1">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Document Status</h2>
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-3 bg-[#6B8E5F]/10 flex-1" />
                        <span className="text-2xl font-black text-[#6B8E5F] min-w-[3rem]">{progress}%</span>
                    </div>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search document types..."
                        className="pl-10 border-gray-200 focus-visible:ring-[#6B8E5F]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredDocs.map((doc) => (
                    <Card key={doc.id} className={cn(
                        "transition-all duration-300",
                        doc.status === 'uploaded' ? "border-green-100 bg-green-50/10" :
                            doc.status === 'n/a' ? "border-gray-100 bg-gray-50/30 opacity-70" : "border-gray-100"
                    )}>
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={cn(
                                    "p-3 rounded-lg mt-1",
                                    doc.status === 'uploaded' ? "bg-green-100 text-green-600" :
                                        doc.status === 'n/a' ? "bg-gray-100 text-gray-400" : "bg-[#6B8E5F]/5 text-[#6B8E5F]"
                                )}>
                                    {doc.status === 'uploaded' ? <FileCheck size={24} /> :
                                        doc.status === 'n/a' ? <AlertCircle size={24} /> : <Upload size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] uppercase font-bold",
                                            doc.type === 'mandatory' ? "border-red-100 text-red-500 bg-red-50/50" : "border-blue-100 text-blue-500 bg-blue-50/50"
                                        )}>
                                            {doc.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                                        {doc.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                {doc.status === 'pending' ? (
                                    <>
                                        <Button
                                            onClick={() => handleUpload(doc.id)}
                                            disabled={!!uploadingId}
                                            className="bg-[#6B8E5F] hover:bg-[#5a7850] flex-1 md:flex-none min-w-[120px]"
                                        >
                                            {uploadingId === doc.id ? "Uploading..." : "Upload File"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleNA(doc.id)}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                        >
                                            N/A
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mr-4">
                                            {doc.status === 'uploaded' ? (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle2 size={16} /> Uploaded
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">Not Applicable</span>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleReset(doc.id)}
                                            className="text-gray-400 hover:text-red-500 border-gray-100"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="pt-8 flex justify-between items-center border-t border-gray-100">
                <Button variant="ghost" onClick={() => window.location.href = withBase('/client/dashboard')}>
                    <ChevronLeft size={18} className="mr-2" />
                    Back to Hub
                </Button>
                <Button
                    disabled={progress < 100}
                    className="bg-[#6B8E5F] hover:bg-[#5a7850] px-8 py-6 text-lg"
                >
                    Continue to Inspection Scheduling
                </Button>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
