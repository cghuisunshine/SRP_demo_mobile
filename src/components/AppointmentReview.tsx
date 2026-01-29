import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Calendar, Check, X, User, MapPin } from 'lucide-react'

interface Request {
  id: string
  strataId: string
  complexName: string
  serviceType: string
  requestedBy: string
  requestDate: string
  choice1: string
  choice2: string
  status: 'pending' | 'approved' | 'rejected'
}

export function AppointmentReview() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 'req-101',
      strataId: 'VIS 2345',
      complexName: 'Vancouver Heights',
      serviceType: 'Standard Depreciation Report',
      requestedBy: 'John Doe',
      requestDate: '2026-01-20',
      choice1: '2026-03-06T10:00:00',
      choice2: '2026-03-06T14:00:00',
      status: 'pending',
    },
    {
      id: 'req-102',
      strataId: 'EPS 9921',
      complexName: 'Maple Ridge Complex',
      serviceType: 'Check-up Inspection',
      requestedBy: 'Jane Smith',
      requestDate: '2026-01-22',
      choice1: '2026-03-12T10:00:00',
      choice2: '2026-03-12T14:00:00',
      status: 'pending',
    },
  ])

  const [selectedInspector, setSelectedInspector] = useState<string>('')

  const handleAction = (
    id: string,
    action: 'approve1' | 'approve2' | 'reject',
  ) => {
    if (!selectedInspector && action !== 'reject') {
      alert('Please select an inspector to assign.')
      return
    }

    // Mock remove from list
    setRequests((prev) => prev.filter((r) => r.id !== id))
    alert(
      `Request ${id} processed: ${action} (Assigned to: ${selectedInspector || 'None'})`,
    )
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
          <Check className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
          <p className="text-gray-500">No pending appointment requests.</p>
        </div>
      ) : (
        requests.map((req) => (
          <Card
            key={req.id}
            className="overflow-hidden border-l-4 border-l-orange-400 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="bg-gray-50/50 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-orange-200 bg-white text-orange-600"
                    >
                      Pending Review
                    </Badge>
                    <span className="font-mono text-xs text-gray-400">
                      {req.id}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {req.complexName}
                  </CardTitle>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" /> {req.strataId} •{' '}
                    {req.serviceType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    REQUESTED BY
                  </p>
                  <p className="font-bold">{req.requestedBy}</p>
                  <p className="text-xs text-gray-400">{req.requestDate}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-bold text-gray-900">
                    <Calendar className="h-5 w-5 text-[#6B8E5F]" />
                    Requested Times
                  </h4>

                  <div className="space-y-3">
                    <div
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-[#6B8E5F]/20 bg-[#6B8E5F]/5 p-4 transition-colors hover:bg-[#6B8E5F]/10"
                      onClick={() => handleAction(req.id, 'approve1')}
                    >
                      <div>
                        <Badge className="mb-1 bg-[#6B8E5F]">1st Choice</Badge>
                        <p className="font-bold text-gray-900">
                          {formatDate(req.choice1)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#6B8E5F] opacity-0 transition-opacity hover:bg-[#5a7850] group-hover:opacity-100"
                      >
                        Approve
                      </Button>
                    </div>

                    <div
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                      onClick={() => handleAction(req.id, 'approve2')}
                    >
                      <div>
                        <Badge variant="outline" className="mb-1">
                          2nd Choice
                        </Badge>
                        <p className="font-medium text-gray-600">
                          {formatDate(req.choice2)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#6B8E5F] opacity-0 transition-opacity hover:text-[#6B8E5F] group-hover:opacity-100"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-bold text-gray-900">
                    <User className="h-5 w-5 text-gray-500" />
                    Assign Inspector
                  </h4>

                  <div className="space-y-4 rounded-xl bg-gray-50 p-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Select Inspector
                      </label>
                      <Select
                        value={selectedInspector}
                        onValueChange={setSelectedInspector}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select an inspector..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Jane Inspector">
                            Jane Inspector (Senior)
                          </SelectItem>
                          <SelectItem value="Alice Field">
                            Alice Field (Junior)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                      <p className="font-bold">✨ Availability Check</p>
                      <p>
                        Selected inspector is available for both requested
                        times.
                      </p>
                    </div>

                    <div className="flex justify-end border-t border-gray-200 pt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAction(req.id, 'reject')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject Request
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
