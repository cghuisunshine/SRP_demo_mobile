// SRP Portal - TypeScript Type Definitions
// Based on Robyn's ERD diagrams

export type UserRole = 'admin' | 'inspector' | 'client' | 'assistant';

export type PropertyType = 'Bare Land' | 'Townhouse' | 'Apartment' | 'Mixed-Use' | 'Industrial';

export type LegalType = 'Standard' | 'Air-Parcel';

export type ServiceRequestStatus =
    | 'draft'
    | 'questions_complete'
    | 'documents_complete'
    | 'pending_approval'
    | 'approved'
    | 'inspection_scheduled'
    | 'inspection_complete'
    | 'draft_meeting_scheduled'
    | 'archived';

export type DocumentStatus = 'pending' | 'uploaded' | 'reviewed' | 'rejected';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type SurveySectionId =
    | 'exterior'
    | 'interior'
    | 'services'
    | 'clubhouse'
    | 'amenity'
    | 'legal'
    | 'council';

// Core Entities

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In real app, this would be hashed
    role: UserRole;
    strataId?: string; // For client users
    position?: string; // e.g., "Strata President"
    phone?: string;
    cellPhone?: string;
    mustChangePassword: boolean;
    createdAt: string;
}

export interface Company {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface Strata {
    id: string;
    strataPlan: string; // e.g., "VIS 2345"
    complexName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string; // Default: "Canada"
    propertyType: PropertyType;
    legalType: LegalType;
    companyId: string;
    propertyManagerId?: string;
    userIds: string[]; // Max 5 council members
    createdAt: string;
}

export interface ServiceRequest {
    id: string;
    strataId: string;
    strataPlan: string;
    serviceType: string; // "Depreciation Report", etc.
    status: ServiceRequestStatus;
    progress: number; // 0-100
    requestDate: string;
    agmDate?: string;
    fiscalYearStart?: string; // "January", "April", etc.
    lastDepreciationReportDate?: string;
    targetDate?: string;
    draftSentDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SurveyResponse {
    id: string;
    serviceRequestId: string;
    sectionId: SurveySectionId;
    answers: Record<string, any>; // Flexible key-value pairs
    completedAt?: string;
    updatedAt: string;
}

export interface Document {
    id: string;
    serviceRequestId: string;
    name: string;
    fileName: string;
    documentType: string; // "Strata Plan", "Bylaws", "AGM Minutes", etc.
    category: 'mandatory' | 'if_available' | 'if_applicable';
    status: DocumentStatus;
    uploadedBy: string; // User ID
    uploadedAt?: string;
    reviewedBy?: string; // User ID
    reviewedAt?: string;
    fileSize?: number;
    mimeType?: string;
}

export interface Appointment {
    id: string;
    serviceRequestId: string;
    strataPlan: string;
    appointmentType: 'inspection' | 'draft_meeting';
    requestedDate1: string;
    requestedTime1: '10:00' | '14:00' | '18:00';
    requestedDate2?: string;
    requestedTime2?: '10:00' | '14:00' | '18:00';
    confirmedDate?: string;
    confirmedTime?: string;
    inspectorId?: string;
    status: AppointmentStatus;
    meetingType?: 'zoom' | 'in-person';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InspectorUnavailability {
    id: string;
    inspectorId: string;
    unavailableDate: string;
    reason?: string;
}

export interface CompanyHoliday {
    id: string;
    date: string;
    name: string;
}

// UI State Types

export interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    token?: string;
}

export interface NotificationItem {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
    createdAt: string;
}

// Helper Types

export interface SurveyQuestion {
    id: string;
    sectionId: string;
    questionText: string;
    questionType: string;
    options?: string[];
    isMandatory: boolean;
    helpText?: string;
    dependsOnQuestionId?: string;
    dependsOnValue?: string;
}

export interface SurveyAnswer {
    serviceRequestId: string;
    questionId: string;
    value: string;
    updatedAt: string;
}

export interface SurveySection {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    tags: string[];
    isApplicable: boolean;
    href?: string;
    gridClass?: string;
}

export interface HubStatus {
    sections: SurveySection[];
    overallProgress: number;
}

export interface ProgressMetrics {
    profileComplete: boolean;
    timelinesComplete: boolean;
    surveysComplete: boolean;
    documentsComplete: boolean;
    inspectionScheduled: boolean;
    meetingScheduled: boolean;
    overallProgress: number;
}
