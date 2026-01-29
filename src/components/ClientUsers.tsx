import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { User, Phone, Mail, Plus, Save } from 'lucide-react'

interface Contact {
  id: string
  role: string
  name: string
  email: string
  phone: string
  cell: string
  isReadOnly?: boolean
}

export function ClientUsers() {
  const [activeTab, setActiveTab] = useState('contacts')

  // Mock Data - In a real app, this would come from an API
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'pm-1',
      role: 'Property Manager',
      name: 'John Doe',
      email: 'john.doe@associapm.com',
      phone: '(604) 555-0101',
      cell: '(604) 555-0102',
      isReadOnly: true,
    },
    {
      id: 'sc-1',
      role: 'Site Contact 1',
      name: 'Billy Brown',
      email: 'billy.brown@gmail.com',
      phone: '(604) 555-0103',
      cell: '(604) 555-0104',
    },
  ])

  const handleUpdate = (id: string, field: keyof Contact, value: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    )
  }

  const handleSave = () => {
    // Mock save action
    alert('Contacts updated successfully! (Mock)')
  }

  return (
    <div className="space-y-6 duration-500 animate-in fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="contacts">Site Contacts</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {contacts.map((contact) => (
              <Card
                key={contact.id}
                className="border-gray-200 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader
                  className={`border-b ${contact.isReadOnly ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 bg-white">
                        {contact.role}
                      </Badge>
                      <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <User className="h-4 w-4 text-gray-400" />
                        {contact.isReadOnly ? (
                          contact.name
                        ) : (
                          <Input
                            value={contact.name}
                            onChange={(e) =>
                              handleUpdate(contact.id, 'name', e.target.value)
                            }
                            className="h-8 border-transparent text-lg font-bold hover:border-gray-200 focus:border-[#6B8E5F]"
                          />
                        )}
                      </CardTitle>
                    </div>
                    {contact.isReadOnly && (
                      <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-300">
                        Read Only
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Email Address
                    </Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {contact.isReadOnly ? (
                        <span className="text-sm font-medium">
                          {contact.email}
                        </span>
                      ) : (
                        <Input
                          value={contact.email}
                          onChange={(e) =>
                            handleUpdate(contact.id, 'email', e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Phone
                      </Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {contact.isReadOnly ? (
                          <span className="text-sm font-medium">
                            {contact.phone}
                          </span>
                        ) : (
                          <Input
                            value={contact.phone}
                            onChange={(e) =>
                              handleUpdate(contact.id, 'phone', e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Cell
                      </Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {contact.isReadOnly ? (
                          <span className="text-sm font-medium">
                            {contact.cell}
                          </span>
                        ) : (
                          <Input
                            value={contact.cell}
                            onChange={(e) =>
                              handleUpdate(contact.id, 'cell', e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                {!contact.isReadOnly && (
                  <CardFooter className="flex justify-end border-t bg-gray-50/50 p-4">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-[#6B8E5F] hover:bg-[#5a7850]"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Update Contact
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}

            {/* Add New Contact Placeholder */}
            <button className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-gray-400 transition-all hover:border-[#6B8E5F] hover:bg-[#6B8E5F]/5 hover:text-[#6B8E5F]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-[#6B8E5F]/10">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-bold">Add Another Contact</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="access">
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 text-center text-gray-500">
            <User className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="font-bold text-gray-900">User Access Control</h3>
            <p className="mx-auto mt-2 max-w-md">
              Manage who can access this strata profile. Feature coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
