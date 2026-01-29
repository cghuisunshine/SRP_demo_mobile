import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    Search,
    FileText,
    Home,
    Wrench,
    Trees as Tree,
    ShieldCheck,
    Users,
    ClipboardCheck,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SurveySection } from '@/lib/types';

interface HubTileProps {
    title: string;
    description: string;
    progress: number;
    icon: string;
    href: string;
    className?: string | undefined;
    tags?: string[];
}

const iconMap: Record<string, any> = {
    FileText,
    Home,
    Wrench,
    Tree,
    ShieldCheck,
    Users,
    ClipboardCheck
};

function HubTile({ title, description, progress, icon, href, className, tags }: HubTileProps) {
    const Icon = iconMap[icon] || ClipboardCheck;

    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all hover:shadow-md border-[#6B8E5F]/10 hover:border-[#6B8E5F]/30 h-full",
            className
        )}>
            <a href={href} className="block h-full p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#6B8E5F]/5 rounded-xl text-[#6B8E5F] group-hover:bg-[#6B8E5F] group-hover:text-white transition-colors">
                        <Icon size={24} />
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                        {tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-[#6B8E5F]/5 text-[#6B8E5F] text-[10px] uppercase tracking-wider border-none">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {title}
                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#6B8E5F]" />
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Progress</span>
                        <span className="text-sm font-bold text-[#6B8E5F]">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-[#6B8E5F]/10" />
                </div>
            </a>
        </Card>
    );
}

export function SurveyHub() {
    const { fetchHubStatus, hubStatus } = useStore();
    const [search, setSearch] = useState('');
    const [localSections, setLocalSections] = useState<SurveySection[]>([]);

    useEffect(() => {
        fetchHubStatus();
    }, []);

    useEffect(() => {
        if (hubStatus?.sections) {
            setLocalSections(hubStatus.sections);
        }
    }, [hubStatus]);

    const handleAction = (id: string, e: React.MouseEvent) => {
        if (id === 'docs') {
            e.preventDefault();
            e.stopPropagation();
            setLocalSections(prev => prev.map(s =>
                s.id === 'docs' ? { ...s, progress: 100, tags: ['Completed', 'Documents'] } : s
            ));
        }
    };

    const filteredSections = useMemo(() => {
        return localSections.filter((s) =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.description.toLowerCase().includes(search.toLowerCase()) ||
            s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
        );
    }, [localSections, search]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="relative group max-w-2xl mx-auto mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B8E5F] transition-colors" size={20} />
                <Input
                    placeholder="Search for documents, survey questions, or section titles..."
                    className="pl-12 py-6 text-lg border-gray-200 focus-visible:ring-[#6B8E5F] shadow-sm bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredSections.map((section) => (
                    <div key={section.id} onClick={(e) => handleAction(section.id, e)} className="cursor-pointer">
                        <HubTile
                            title={section.title}
                            description={section.description}
                            progress={section.progress}
                            icon={section.icon}
                            href={section.href || `/client/survey/${section.id}`}
                            className={section.gridClass || undefined}
                            tags={section.tags}
                        />
                    </div>
                ))}

                {filteredSections.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400">
                        <Search size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-xl">No sections found matching "{search}"</p>
                        <Button variant="link" onClick={() => setSearch('')} className="text-[#6B8E5F]">
                            Clear search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
