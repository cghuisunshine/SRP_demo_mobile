import { Home, Users, Calendar, FileText, Upload, Video, Bell, Settings, LogOut, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { stripBase, withBase } from '@/lib/base';

interface NavItem {
    label: string;
    href: string;
    icon: any;
    badge?: number;
}

export function Sidebar() {
    const { auth, logout, getUnreadNotificationCount, getCurrentUserStrata } = useStore();
    const user = auth.currentUser;
    const strata = getCurrentUserStrata();
    const unreadCount = getUnreadNotificationCount();
    const [isOpen, setIsOpen] = useState(false);

    // Close on navigation change
    useEffect(() => {
        setIsOpen(false);
    }, [typeof window !== 'undefined' ? window.location.pathname : '']);

    if (!user) return null;

    // Role-based navigation
    const clientNav: NavItem[] = [
        { label: 'Dashboard', href: '/client/dashboard', icon: Home },
        { label: 'Profile', icon: Users, href: '/client/profile' },
        { label: 'Users', href: '/client/users', icon: Users },
        { label: 'Timelines', href: '/client/timelines', icon: Calendar },
        { label: 'Survey', href: '/client/survey/exterior', icon: FileText },
        { label: 'Documents', href: '/client/documents', icon: Upload },
        { label: 'Inspection Date', href: '/client/inspection', icon: Calendar },
        { label: 'Draft Meeting', href: '/client/meeting', icon: Video },
    ];

    const adminNav: NavItem[] = [
        { label: 'Overview', href: '/admin/dashboard', icon: Home },
        { label: 'Client Projects', href: '/admin/stratas', icon: Users },
        { label: 'Approvals Needed', href: '/admin/requests', icon: FileText, badge: 3 },
        { label: 'Staff Management', href: '/admin/users', icon: Users },
        { label: 'Global Settings', href: '/admin/settings', icon: Settings },
    ];

    const inspectorNav: NavItem[] = [
        { label: 'Dashboard', href: '/inspector/dashboard', icon: Home },
        { label: 'My Schedule', href: '/inspector/schedule', icon: Calendar },
        { label: 'Availability', href: '/inspector/availability', icon: Calendar },
    ];

    const navItems =
        user.role === 'admin' ? adminNav :
            user.role === 'inspector' ? inspectorNav :
                clientNav;

    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const pathname = typeof window !== 'undefined' ? stripBase(window.location.pathname) : '';

    const surveySubItems = [
        { label: 'Exterior', href: '/client/survey/exterior' },
        { label: 'Interior', href: '/client/survey/interior' },
        { label: 'Septic & Sanitary', href: '/client/survey/septic' },
        { label: 'Services', href: '/client/survey/services' },
        { label: 'Clubhouse', href: '/client/survey/clubhouse' },
        { label: 'Amenity Room', href: '/client/survey/amenity' },
        { label: 'Legal', href: '/client/survey/legal' },
        { label: 'Council Concerns', href: '/client/survey/council' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white/80 backdrop-blur-sm border-[#6B8E5F]/20 text-[#6B8E5F]"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Shell */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-40
                w-72 bg-white border-r border-gray-100 flex flex-col h-screen
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-12 flex items-center justify-center overflow-hidden">
                            <img src={withBase('/logo_SRP.png')} alt="SRP" className="h-8 w-auto object-contain" />
                        </div>
                        <div>
                            <h2 className="font-black text-xs text-gray-900 leading-tight tracking-tighter uppercase font-inter">Strata Reserve</h2>
                            <p className="text-[10px] text-[#6B8E5F] font-black uppercase tracking-[0.2em] mt-0.5">Planning</p>
                        </div>
                    </div>
                </div>

                {/* Metadata Section (High-Fidelity) */}
                <div className="px-6 py-4 border-b border-gray-100 space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STRATA ID</p>
                        <p className="text-sm font-black text-gray-900 mt-1">{strata?.strataPlan || 'VIS 2345'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">USER</p>
                        <p className="text-sm font-black text-gray-900 mt-1">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ROLE</p>
                        <p className="text-sm font-black text-[#6B8E5F] mt-1 capitalize">{user.role}</p>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            const isSurvey = item.label === 'Survey';

                            if (isSurvey) {
                                return (
                                    <li key={item.label} className="space-y-1">
                                        <button
                                            onClick={() => setIsSurveyOpen(!isSurveyOpen)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${isActive || isSurveyOpen
                                                ? 'bg-[#6B8E5F]/5 text-[#6B8E5F]'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className={`h-4 w-4 ${isActive || isSurveyOpen ? 'text-[#6B8E5F]' : 'text-gray-400'}`} />
                                            <span className="text-sm font-bold flex-1 text-left">{item.label}</span>
                                            {isSurveyOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </button>

                                        {isSurveyOpen && (
                                            <ul className="ml-9 space-y-1 mt-1 border-l-2 border-gray-50 pl-2">
                                                {surveySubItems.map((sub) => (
                                                    <li key={sub.href}>
                                                        <a
                                                            href={withBase(sub.href)}
                                                            className={`block px-4 py-2 rounded-lg text-xs font-bold transition-colors ${pathname === sub.href
                                                                ? 'text-[#6B8E5F] bg-[#6B8E5F]/5'
                                                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {sub.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }

                            return (
                                <li key={item.href}>
                                    <a
                                        href={withBase(item.href)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${isActive
                                            ? 'bg-[#6B8E5F] text-white shadow-md shadow-[#6B8E5F]/20'
                                            : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#6B8E5F]'}`} />
                                        <span className="text-sm font-bold">{item.label}</span>
                                        {item.badge && (
                                            <Badge className="ml-auto bg-red-500 border-none px-1.5 h-4 min-w-4 flex items-center justify-center text-[10px] font-bold">{item.badge}</Badge>
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="p-6 border-t border-gray-50 space-y-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-12 rounded-xl text-gray-500 hover:bg-[#6B8E5F]/5 hover:text-[#6B8E5F] font-bold gap-4 px-5"
                        onClick={() => window.location.href = withBase('/notifications')}
                    >
                        <div className="relative">
                            <Bell className="h-5 w-5 text-gray-400 group-hover:text-[#6B8E5F]" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
                            )}
                        </div>
                        <span className="text-sm">Notifications</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start h-12 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50/50 font-black gap-4 px-5 transition-colors"
                        onClick={() => {
                            logout();
                            window.location.href = withBase('/');
                        }}
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm">Sign Out</span>
                    </Button>
                </div>
            </div>
        </>
    );
}
