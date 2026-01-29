import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useStore } from '@/lib/store';
import { Shield, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { withBase } from '@/lib/base';

export function PropertyProfile() {
    const { currentStrata, fetchStrata, updateStrata, auth } = useStore();
    const [confirmed, setConfirmed] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [additionalServices, setAdditionalServices] = useState({
        epr: false,
        insurance: false,
        elevator: false
    });

    useEffect(() => {
        const load = async () => {
            if (auth.currentUser?.strataId) {
                await fetchStrata(auth.currentUser.strataId);
            }
        };
        load();
    }, [auth.currentUser?.strataId, fetchStrata]);

    useEffect(() => {
        if (currentStrata) {
            setFormData(currentStrata);
        }
    }, [currentStrata]);

    const handleSave = async () => {
        if (formData) {
            await updateStrata(formData);
            setConfirmed(true);
        }
    };

    if (!formData) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E5F]"></div>
            </div>
        );
    }

    if (confirmed) {
        return (
            <Card className="max-w-3xl mx-auto border-[#6B8E5F]/20 bg-[#6B8E5F]/5 animate-in zoom-in-95 duration-500">
                <CardContent className="p-12 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-[#6B8E5F] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#6B8E5F]/30">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-gray-900">Profile Confirmed!</h2>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Thank you for verifying the property details. We've updated our records for {formData.complexName}.
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.href = withBase('/client/dashboard')}
                        className="bg-[#6B8E5F] hover:bg-[#5a7850] px-8"
                    >
                        Return to Hub
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <Card className="md:col-span-2 shadow-sm border-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-[#6B8E5F]">
                            <Building2 size={20} />
                            Core Property Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-gray-400">Strata Plan</Label>
                                <Input
                                    value={formData.strataPlan}
                                    onChange={(e) => setFormData({ ...formData, strataPlan: e.target.value })}
                                    className="font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-gray-400">Complex Name</Label>
                                <Input
                                    value={formData.complexName}
                                    onChange={(e) => setFormData({ ...formData, complexName: e.target.value })}
                                    className="font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-gray-400">Full Address</Label>
                            <div className="flex gap-2">
                                <MapPin size={18} className="text-gray-300 mt-2" />
                                <div className="space-y-2 flex-1">
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Street Address"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input value={formData.city} placeholder="City" />
                                        <Input value={formData.province} placeholder="BC" />
                                        <Input value={formData.postalCode} placeholder="V8V 1A1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-bold text-gray-400">Property Type</Label>
                                <Select defaultValue={formData.propertyType}>
                                    <SelectTrigger className="py-6 font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bare Land">Bare Land</SelectItem>
                                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                                        <SelectItem value="Apartment">Apartment</SelectItem>
                                        <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                                        <SelectItem value="Industrial">Industrial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-bold text-gray-400">Legal Type</Label>
                                <Select defaultValue={formData.legalType}>
                                    <SelectTrigger className="py-6 font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                        <SelectItem value="Air-Parcel">Air-Parcel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Additional Services */}
                <div className="space-y-6">
                    <Card className="border-blue-100 bg-blue-50/10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                                <Shield size={16} />
                                Additional Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'epr', label: 'Electrical Planning (EPR)' },
                                { id: 'insurance', label: 'Insurance Appraisal' },
                                { id: 'elevator', label: 'Elevator Monitoring' }
                            ].map((service) => (
                                <div key={service.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={service.id}
                                        checked={additionalServices[service.id as keyof typeof additionalServices]}
                                        onCheckedChange={(checked) => setAdditionalServices({ ...additionalServices, [service.id]: !!checked })}
                                    />
                                    <label htmlFor={service.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">
                                        {service.label}
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50 border-amber-100 p-4">
                        <p className="text-xs text-amber-800 leading-relaxed italic">
                            * Confirming this profile will lock the base strata data. Contact SPR support for future major amendments.
                        </p>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-100">
                <Button
                    onClick={handleSave}
                    className="bg-[#6B8E5F] hover:bg-[#5a7850] px-12 py-6 text-lg font-bold shadow-lg shadow-[#6B8E5F]/20"
                >
                    Confirm Property Profile
                </Button>
            </div>
        </div>
    );
}
