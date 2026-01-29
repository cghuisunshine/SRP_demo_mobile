type EmailEventType =
  | 'timeline_confirmed'
  | 'document_uploaded'
  | 'documents_complete'
  | 'survey_submitted'
  | 'inspection_preferences_submitted'
  | 'appointment_confirmed'
  | 'inspection_completed';

export async function emitEmailEvent(
  eventType: EmailEventType,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch('/api/email/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, payload }),
    });
  } catch {
    // best-effort; in non-demo builds this endpoint may not exist
  }
}
