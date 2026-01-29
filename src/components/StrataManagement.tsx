import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Search, Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import type { Strata } from '@/lib/types';

export function StrataManagement() {
    const { stratas, fetchStratas } = useStore();
    const [search, setSearch] = useState('');
    const [propertyFilter, setPropertyFilter] = useState<string>('all');
    const [cityFilter, setCityFilter] = useState<string>('all');

    useEffect(() => {
        fetchStratas();
    }, []);

    const filteredStratas: Strata[] = useMemo(() => {
        return stratas.filter((s) => {
            const matchesSearch =
                s.strataPlan.toLowerCase().includes(search.toLowerCase()) ||
                s.complexName.toLowerCase().includes(search.toLowerCase());

            const matchesProperty = propertyFilter === 'all' || s.propertyType === propertyFilter;
            const matchesCity = cityFilter === 'all' || s.city === cityFilter;

            return matchesSearch && matchesProperty && matchesCity;
        });
    }, [stratas, search, propertyFilter, cityFilter]);

    const cities = useMemo(() => {
        const uniqueCities = Array.from(new Set(stratas.map(s => s.city)));
        return uniqueCities.sort();
    }, [stratas]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stratas</h1>
                <Button className="bg-[#6B8E5F] hover:bg-[#5a7850] text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-[#6B8E5F]/20 flex gap-2">
                    <Plus size={20} />
                    Create New Strata
                </Button>
            </div>

            {/* Filters Row (Bento style alignment) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B8E5F] transition-colors" size={18} />
                    <Input
                        placeholder="Search Strata ID or Name..."
                        className="h-11 pl-11 border-gray-100 bg-white/50 focus-visible:ring-[#6B8E5F] rounded-xl font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                    <SelectTrigger className="h-11 border-gray-100 bg-white/50 focus:ring-[#6B8E5F] rounded-xl font-medium">
                        <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Bare Land">Bare Land</SelectItem>
                        <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="h-11 border-gray-100 bg-white/50 focus:ring-[#6B8E5F] rounded-xl font-medium">
                        <SelectValue placeholder="Filter by city..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <Card className="overflow-hidden border-gray-100 shadow-sm rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Strata ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Complex Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStratas.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-sm text-gray-900">{s.strataPlan}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-gray-700">{s.complexName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{s.city}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className="bg-[#6B8E5F]/5 text-[#6B8E5F] border-none font-bold text-[10px] uppercase tracking-wider">
                                            {s.propertyType}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#6B8E5F] hover:bg-[#6B8E5F]/5 rounded-lg">
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredStratas.length === 0 && (
                        <div className="py-20 text-center">
                            <Building2 size={48} className="mx-auto mb-4 text-gray-200" />
                            <p className="text-gray-400 font-bold">No stratas found matching your filters.</p>
                            <Button variant="link" className="text-[#6B8E5F] font-bold" onClick={() => { setSearch(''); setPropertyFilter('all'); setCityFilter('all'); }}>
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
