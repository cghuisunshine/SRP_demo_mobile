import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type InboxItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
};

type OutboxItem = {
  id: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  eventType: string;
  createdAt: string;
};

function typeColor(type: InboxItem['type']): string {
  if (type === 'success') return 'bg-green-50 text-green-700 border-green-100';
  if (type === 'warning') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  if (type === 'error') return 'bg-red-50 text-red-700 border-red-100';
  return 'bg-blue-50 text-blue-700 border-blue-100';
}

export function NotificationsCenter(): React.JSX.Element {
  const { auth, fetchNotifications, notifications } = useStore();
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [loadingOutbox, setLoadingOutbox] = useState(false);
  const isStaff = auth.currentUser?.role === 'admin' || auth.currentUser?.role === 'assistant';

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const loadOutbox = async () => {
      if (!isStaff) return;
      setLoadingOutbox(true);
      try {
        const res = await fetch('/api/email-outbox');
        if (!res.ok) return;
        const data = (await res.json()) as OutboxItem[];
        setOutbox(data);
      } finally {
        setLoadingOutbox(false);
      }
    };
    loadOutbox();
  }, [isStaff]);

  const inbox = useMemo(() => {
    const uid = auth.currentUser?.id;
    if (!uid) return [];
    return (notifications || []).filter((n) => n.userId === uid);
  }, [notifications, auth.currentUser?.id]);

  const unreadCount = useMemo(() => inbox.filter((n) => !n.read).length, [inbox]);

  const markRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } finally {
      await fetchNotifications();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="mt-1 text-gray-500">
            Demo email automation: key events generate an inbox item and a staff outbox entry.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unread</p>
          <p className="text-3xl font-black text-[#6B8E5F]">{unreadCount}</p>
        </div>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">My Inbox</TabsTrigger>
          {isStaff && <TabsTrigger value="outbox">Email Outbox</TabsTrigger>}
        </TabsList>

        <TabsContent value="inbox">
          <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-50">
              {inbox.map((n) => (
                <div key={n.id} className={cn('p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4', !n.read && 'bg-[#6B8E5F]/5')}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('text-[10px] uppercase font-black tracking-wider', typeColor(n.type))}>
                        {n.type}
                      </Badge>
                      {!n.read && (
                        <Badge className="bg-[#6B8E5F] text-white border-none text-[10px] uppercase font-black tracking-wider">
                          New
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 font-bold">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="font-black text-gray-900">{n.title}</div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed font-sans">
                      {n.message}
                    </pre>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-200"
                      disabled={n.read}
                      onClick={() => markRead(n.id)}
                    >
                      {n.read ? 'Read' : 'Mark Read'}
                    </Button>
                  </div>
                </div>
              ))}

              {inbox.length === 0 && (
                <div className="p-16 text-center text-gray-400 font-bold">
                  No notifications yet. Trigger an event (upload a document, submit survey, etc.).
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {isStaff && (
          <TabsContent value="outbox">
            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <div className="divide-y divide-gray-50">
                {loadingOutbox && <div className="p-10 text-center text-gray-400 font-bold">Loading outbox…</div>}
                {!loadingOutbox && outbox.map((e) => (
                  <div key={e.id} className="p-5 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-black tracking-wider border-gray-200 text-gray-500">
                        {e.eventType}
                      </Badge>
                      <span className="text-xs text-gray-400 font-bold">{new Date(e.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="font-black text-gray-900">{e.subject}</div>
                    <div className="text-xs text-gray-500 font-medium">
                      To: {e.to.join(', ')}
                      {e.cc && e.cc.length > 0 ? ` • Cc: ${e.cc.join(', ')}` : ''}
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed font-sans">
                      {e.body}
                    </pre>
                  </div>
                ))}

                {!loadingOutbox && outbox.length === 0 && (
                  <div className="p-16 text-center text-gray-400 font-bold">
                    Outbox is empty. Trigger an event to generate an email.
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
