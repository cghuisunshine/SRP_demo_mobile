import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyProfile } from '@/components/PropertyProfile';
import { ContactManagement } from '@/components/ContactManagement';

export function ClientProfileView() {
    return (
        <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="property" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-1 bg-gray-100/50">
                    <TabsTrigger value="property" className="text-md font-bold data-[state=active]:bg-white data-[state=active]:text-[#6B8E5F] data-[state=active]:shadow-sm">
                        1. Property Details
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="text-md font-bold data-[state=active]:bg-white data-[state=active]:text-[#6B8E5F] data-[state=active]:shadow-sm">
                        2. Personnel & Contacts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="property" className="mt-0 outline-none">
                    <PropertyProfile />
                </TabsContent>
                <TabsContent value="contacts" className="mt-0 outline-none">
                    <ContactManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
