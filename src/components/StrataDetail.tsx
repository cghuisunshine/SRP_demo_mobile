import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import type { Strata } from '@/lib/types';

interface StrataDetailProps {
    id: string;
    initialData?: Strata;
}

export function StrataDetail({ id, initialData }: StrataDetailProps) {
    const [strata, setStrata] = useState<Strata | undefined>(initialData);
    const [loading, setLoading] = useState(!initialData);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!initialData) {
            // Fetch if not provided (though SSR should provide it)
            fetch(`/api/stratas/${id}`)
                .then(res => res.json())
                .then(data => {
                    setStrata(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch strata", err);
                    setLoading(false);
                });
        }
    }, [id, initialData]);

    const handleSave = async () => {
        if (!strata) return;
        setSaving(true);
        try {
            // Mock save - in real app would POST to /api/stratas/update
            await new Promise(resolve => setTimeout(resolve, 800));
            // Success feedback could go here
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!strata) return <div className="p-8">Strata not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.location.href = '/admin/stratas'}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{strata.complexName}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <span className="bg-[#6B8E5F]/10 text-[#6B8E5F] px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider">
                                {strata.strataPlan}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {strata.city}, {strata.province}
                            </span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#6B8E5F] hover:bg-[#5a7850] text-white shadow-lg shadow-[#6B8E5F]/20"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <Card className="md:col-span-2 border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                        <CardDescription>Core information about the strata corporation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Complex Name</Label>
                                <Input
                                    value={strata.complexName}
                                    onChange={e => setStrata({ ...strata, complexName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Strata Plan ID</Label>
                                <Input
                                    value={strata.strataPlan}
                                    className="font-mono bg-gray-50"
                                    onChange={e => setStrata({ ...strata, strataPlan: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Address</Label>
                                <Input
                                    value={strata.address}
                                    onChange={e => setStrata({ ...strata, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input
                                    value={strata.city}
                                    onChange={e => setStrata({ ...strata, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Postal Code</Label>
                                <Input
                                    value={strata.postalCode}
                                    onChange={e => setStrata({ ...strata, postalCode: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metadata Card */}
                <Card className="border-gray-100 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Property Type</Label>
                            <Input value={strata.propertyType} readOnly className="bg-gray-50 text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label>Units</Label>
                            {/* Mock field for units */}
                            <Input value="45" readOnly className="bg-gray-50 text-gray-500" />
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 font-mono">ID: {strata.id}</p>
                            <p className="text-xs text-gray-400 font-mono">Created: {new Date(strata.createdAt).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
