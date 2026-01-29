import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Trash2, Plus } from 'lucide-react'
import { Badge } from './ui/badge'

export function AdminSettings() {
  const [holidays, _setHolidays] = useState([
    { id: 1, name: 'New Year Day', date: '2026-01-01' },
    { id: 2, name: 'Family Day', date: '2026-02-16' },
    { id: 3, name: 'Good Friday', date: '2026-04-03' },
  ])

  const [blockedDates, _setBlockedDates] = useState([
    {
      id: 1,
      inspector: 'Jane Inspector',
      date: '2026-03-01',
      reason: 'Vacation',
    },
    {
      id: 2,
      inspector: 'Jane Inspector',
      date: '2026-03-02',
      reason: 'Vacation',
    },
  ])

  return (
    <Tabs defaultValue="holidays" className="space-y-6">
      <TabsList>
        <TabsTrigger value="holidays">Company Holidays</TabsTrigger>
        <TabsTrigger value="availability">Inspector Availability</TabsTrigger>
        <TabsTrigger value="profile">Admin Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="holidays">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Company Holidays</CardTitle>
              <p className="text-sm text-gray-500">
                Dates when no inspections can be booked.
              </p>
            </div>
            <Button className="bg-[#6B8E5F] hover:bg-[#5a7850]">
              <Plus className="mr-2 h-4 w-4" /> Add Holiday
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white font-bold text-gray-500">
                      {new Date(h.date).getDate()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(h.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="availability">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Inspector Availability</CardTitle>
              <p className="text-sm text-gray-500">
                Manage time-off and blackout dates for staff.
              </p>
            </div>
            <Button className="bg-[#6B8E5F] hover:bg-[#5a7850]">
              <Plus className="mr-2 h-4 w-4" /> Add Unavailable Date
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 font-medium text-gray-500">
                  <tr>
                    <th className="p-4">Staff Name</th>
                    <th className="p-4">Unavailable Date</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {blockedDates.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium">{b.inspector}</td>
                      <td className="p-4">
                        {new Date(b.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{b.reason}</Badge>
                      </td>
                      <td className="space-x-2 p-4 text-right">
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 text-gray-500"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 text-red-400"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
