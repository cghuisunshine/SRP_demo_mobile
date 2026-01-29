import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Users,
    UserPlus,
    Phone,
    Mail,
    PhoneCall,
    Trash2,
    Save,
    CheckCircle2,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
    id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    cell: string;
    company?: string;
    role: 'Property Manager' | 'Site Contact';
}

export function ContactManagement() {
    const [isSaved, setIsSaved] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([
        {
            id: 'pm-1',
            name: 'John Doe',
            position: 'Senior Property Manager',
            company: 'Associa Property Management',
            email: 'john.doe@associa.com',
            phone: '604-555-0199',
            cell: '604-555-0200',
            role: 'Property Manager'
        },
        {
            id: 'site-1',
            name: 'Billy Brown',
            position: 'Strata President',
            email: 'BillyBobbyThorton@gmail.com',
            phone: '250-555-0155',
            cell: '250-555-0156',
            role: 'Site Contact'
        }
    ]);

    const addContact = () => {
        if (contacts.length >= 5) return;
        const newContact: Contact = {
            id: Math.random().toString(36).substring(2, 11),
            name: '',
            position: '',
            email: '',
            phone: '',
            cell: '',
            role: 'Site Contact'
        };
        setContacts([...contacts, newContact]);
    };

    const removeContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const updateContact = (id: string, field: keyof Contact, value: string) => {
        setContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center bg-[#6B8E5F]/5 p-6 rounded-2xl border border-[#6B8E5F]/10">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-gray-900">Personnel Confirmation</h2>
                    <p className="text-sm text-gray-500">Please confirm the contacts for the Depreciation Report process.</p>
                </div>
                <Button
                    onClick={addContact}
                    disabled={contacts.length >= 5}
                    variant="outline"
                    className="border-[#6B8E5F] text-[#6B8E5F] hover:bg-[#6B8E5F] hover:text-white"
                >
                    <UserPlus size={18} className="mr-2" />
                    Add Site Contact
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {contacts.map((contact) => (
                    <Card key={contact.id} className={cn(
                        "relative overflow-hidden group transition-all",
                        contact.role === 'Property Manager' ? "border-blue-100" : "border-gray-100"
                    )}>
                        {contact.role === 'Property Manager' && (
                            <div className="absolute top-0 right-0 p-1 px-3 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                                Primary Lead
                            </div>
                        )}
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Basic Info */}
                                <div className="lg:col-span-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400">Full Name</Label>
                                        <div className="relative">
                                            <Input
                                                value={contact.name}
                                                onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="pl-9 font-bold h-12"
                                            />
                                            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400">Position / Title</Label>
                                        <div className="relative">
                                            <Input
                                                value={contact.position}
                                                onChange={(e) => updateContact(contact.id, 'position', e.target.value)}
                                                placeholder="e.g. Strata President"
                                                className="pl-9 h-12"
                                            />
                                            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                        </div>
                                    </div>
                                    {contact.role === 'Property Manager' && (
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Company</Label>
                                            <Input
                                                value={contact.company}
                                                onChange={(e) => updateContact(contact.id, 'company', e.target.value)}
                                                className="h-12 border-blue-100 bg-blue-50/20"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Contact Details */}
                                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                value={contact.email}
                                                onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                                                className="pl-9 h-12"
                                            />
                                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400">Telephone</Label>
                                        <div className="relative">
                                            <Input
                                                value={contact.phone}
                                                onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                                                className="pl-9 h-12"
                                            />
                                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label className="text-[10px] uppercase font-bold text-gray-400">Cell Phone (Critical for Site Day)</Label>
                                        <div className="relative">
                                            <Input
                                                value={contact.cell}
                                                onChange={(e) => updateContact(contact.id, 'cell', e.target.value)}
                                                className="pl-9 h-12 bg-amber-50/30 border-amber-100"
                                            />
                                            <PhoneCall size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-1 flex lg:flex-col justify-end gap-2">
                                    {contact.role !== 'Property Manager' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeContact(contact.id)}
                                            className="text-gray-300 hover:text-red-500"
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <Button variant="ghost" onClick={() => window.location.href = '/client/dashboard'} className="text-gray-400">
                    Cancel and Return
                </Button>
                <Button
                    onClick={handleSave}
                    className={cn(
                        "bg-[#6B8E5F] hover:bg-[#5a7850] px-12 py-6 text-lg font-bold transition-all",
                        isSaved && "bg-green-600 hover:bg-green-600"
                    )}
                >
                    {isSaved ? (
                        <>
                            <CheckCircle2 size={20} className="mr-2" />
                            Update Successful
                        </>
                    ) : (
                        <>
                            <Save size={20} className="mr-2" />
                            Update Contacts
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
