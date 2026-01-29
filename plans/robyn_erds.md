## 1. Core Users & Stratas Structure

```mermaid 
erDiagram
    USER_TYPE {
        int user_type_id PK
        string user_type_name "admin, inspector, client, assistant"
    }

    EMPLOYEE {
        int employee_id PK
        string email
        string password
        boolean must_change_password
        int user_type_id FK
    }

    COMPANY {
        int company_id PK
        string company_name
    }

    STRATA {
        int strata_id PK
        string strata_plan
        string complex_name
        string country "Default: Canada"
        int legal_type FK
        int property_type_id FK
        int company_id FK
    }

    PROPERTY_TYPE {
        int property_type_id PK
        string property_type_name "bare land, townhouse, etc"
    }

    STRATA_EMPLOYEE {
        int strata_employee_id PK
        string strata_position
        int strata_id FK
        int employee_id FK
    }

    USER_TYPE ||--o{ EMPLOYEE : defines
    COMPANY ||--o{ STRATA : manages
    PROPERTY_TYPE ||--o{ STRATA : classifies
    STRATA ||--o{ STRATA_EMPLOYEE : has
    EMPLOYEE ||--o{ STRATA_EMPLOYEE : assigned_to
```

## 2. Surveys & Documents Logic

```mermaid  
erDiagram
    SERVICE {
        int service_id PK
        string service_name "Depreciation Report, etc"
    }

    SERVICE_REQUEST {
        int service_request_id PK
        timestamp request_date
        string status "draft, pending_approval, etc"
        int strata_id FK
        int service_id FK
    }

    QUESTION {
        int question_id PK
        string question_text
        string question_category "survey OR timeline"
    }

    QUESTION_RESPONSE {
        int response_id PK
        string response_text
        boolean response_boolean
        int service_request_id FK
        int question_id FK
    }

    REQUIRED_DOCUMENT {
        int required_document_id PK
        boolean is_required
        int service_id FK
        int property_type_id FK
    }

    SERVICE_REQUEST_DOCUMENT {
        int service_request_document_id PK
        string file_path
        timestamp uploaded_at
        int service_request_id FK
        int document_type_id FK
    }

    SERVICE ||--o{ SERVICE_REQUEST : initiates
    SERVICE_REQUEST ||--o{ QUESTION_RESPONSE : contains
    QUESTION ||--o{ QUESTION_RESPONSE : answers
    SERVICE_REQUEST ||--o{ SERVICE_REQUEST_DOCUMENT : includes
    REQUIRED_DOCUMENT ||--o{ SERVICE_REQUEST_DOCUMENT : validates
```

## 3. Appointments & Scheduling 

```mermaid
erDiagram
    APPOINTMENT_REQUEST {
        int appointment_request_id PK
        date first_choice_date
        date second_choice_date
        string status "pending_review, approved"
        int service_request_id FK
    }

    APPOINTMENT {
        int appointment_id PK
        date appointment_date
        string status "scheduled, completed"
        int inspector_employee_id FK
        int appointment_request_id FK
    }

    APPOINTMENT_TYPE {
        int appointment_type_id PK
        string type_name "inspection, draft_meeting"
        boolean is_draft_meeting
    }

    TIME_SLOT {
        int time_slot_id PK
        time slot_time "10:00 or 14:00"
        string slot_name "10am, 2pm"
    }

    INSPECTOR_UNAVAILABLE {
        int unavailable_date_id PK
        date unavailable_date
        int inspector_employee_id FK
    }

    SERVICE_REQUEST ||--o{ APPOINTMENT_REQUEST : generates
    APPOINTMENT_REQUEST ||--|| APPOINTMENT : results_in
    APPOINTMENT_TYPE ||--o{ APPOINTMENT : defines
    TIME_SLOT ||--o{ APPOINTMENT : occurs_at
    EMPLOYEE ||--o{ INSPECTOR_UNAVAILABLE : has
```

## 4. Business Rules: Status Flow (The "Cannot Skip Steps" Rule) 

```mermaid 
stateDiagram-v2
    direction LR
    
    state "Draft Phase" as P1 {
        [*] --> Draft
        Draft --> Questions_Complete
        Questions_Complete --> Documents_Complete
    }

    state "Review Phase" as P2 {
        Documents_Complete --> Pending_Approval
        Pending_Approval --> Approved
        Pending_Approval --> Rejected
        Rejected --> Draft : User must fix
    }

    state "Inspection Phase" as P3 {
        Approved --> Appointment_Pending
        Appointment_Pending --> Appointment_Scheduled
        Appointment_Scheduled --> Appointment_Completed
    }

    state "Meeting Phase" as P4 {
        Appointment_Completed --> Draft_Meeting_Pending
        Draft_Meeting_Pending --> Draft_Meeting_Scheduled
        Draft_Meeting_Scheduled --> Draft_Meeting_Completed
    }

    P4 --> Archived
    Archived --> [*]
``` 

## 5. Business Rules: Appointment Slot Logic 

```mermaid  
flowchart TD
    Start([User Selects Time Slot]) --> CheckSlot{Which Slot?}

    %% 10 AM Logic
    CheckSlot -- 10:00 AM --> DayCheck10{Day is\nMon-Fri?}
    DayCheck10 -- Yes --> TypeCheck10[Allowed: All Service Types]
    DayCheck10 -- No --> Block10[Blocked: Weekend]

    %% 2 PM Logic
    CheckSlot -- 02:00 PM --> DayCheck2{Day is\nMon-Fri?}
    DayCheck2 -- Yes --> DurationCheck{Duration Type?}
    DayCheck2 -- No --> Block2[Blocked: Weekend]
    DurationCheck -- Half Day --> Allow2[Allowed]
    DurationCheck -- Full Day --> Block2B[Blocked:\nRequires Full Day]

    %% 6 PM Logic
    CheckSlot -- 06:00 PM --> DayCheck6{Day is\nMon-Thu?}
    DayCheck6 -- No --> Block6[Blocked:\nFri-Sun not allowed]
    DayCheck6 -- Yes --> TypeCheck6{Is Draft\nMeeting?}
    TypeCheck6 -- No --> Block6B[Blocked:\nDraft Meetings Only]
    TypeCheck6 -- Yes --> FatigueCheck{Has 2pm Appointment\nsame day?}
    FatigueCheck -- Yes --> Block6C[Blocked:\nInspector Fatigue Rule]
    FatigueCheck -- No --> Allow6[Allowed]
```

## 6. Business Rules: Inspector Availability Constraints 

```mermaid  
flowchart TD
    subgraph Availability_Check [Availability Algorithm]
        direction TB
        Request[New Appointment Request] --> Check1{Is Weekend?}
        Check1 -- Yes --> Deny[Unavailable]
        Check1 -- No --> Check2{Is Company Holiday?}
        
        Check2 -- Yes --> Deny
        Check2 -- No --> Check3{Inspector Marked\nUnavailable?}
        
        Check3 -- Yes --> Deny
        Check3 -- No --> Check4{Slot Already Booked?}
        
        Check4 -- Yes --> Deny
        Check4 -- No --> Check5{City Constraint\n(Travel Logic)}
        
        Check5 -- "Different City than\nother appts that day" --> Deny
        Check5 -- "Same City OR\nNo other appts" --> Approve[Available]
    end
```
 
## 7. Permissions & Roles Matrix 

```mermaid  
graph TD
    subgraph Roles
        Admin((Administrator))
        Insp((Inspector))
        Client((Strata Client))
        Asst((Assistant))
    end

    subgraph Actions
        %% Admin Actions
        CreateUser[Create Users & Temp Passwords]
        ApproveReq[Approve/Reject Requests]
        SetHol[Set Company Holidays]
        ManageData[Manage All System Data]
        
        %% Inspector Actions
        MarkUnavail[Mark Unavailable Dates]
        ConductAppt[Conduct Appointments]
        AddNotes[Add Completion Notes]
        
        %% Client Actions
        SubmitReq[Submit Service Requests]
        AnswerQ[Answer Questionnaires]
        UploadDocs[Upload Documents]
        BookAppt[Request Bookings]
        
        %% Assistant Actions
        HelpClient[Help Clients with Requests]
        UploadOnBehalf[Upload on Behalf of Client]
        AnswerOnBehalf[Answer on Behalf of Client]
    end

    %% Connections
    Admin --> CreateUser & ApproveReq & SetHol & ManageData
    Insp --> MarkUnavail & ConductAppt & AddNotes
    Client --> SubmitReq & AnswerQ & UploadDocs & BookAppt
    Asst --> HelpClient & UploadOnBehalf & AnswerOnBehalf
    
    %% Shared Logic (Assistant mimics Client)
    Asst -.->|Acts as| Client
``` 

## 8. Data Connection Rules

```mermaid 
flowchart LR
    %% Core Hierarchy
    Company[Company] -->|1 to Many| Strata[Strata]
    Strata -->|1 to 1| PropType{Property Type}
    Strata -->|1 to 1| LegalType{Legal Type}
    
    %% Service Logic
    Strata -->|Annual Renewals| Request[Service Request]
    Request -->|Filtered by Prop Type| Questions[Questions]
    Request -->|Filtered by Service Type| Docs[Required Documents]
    
    %% Example Logic
    subgraph Filtering_Example [Logic Example: Elevator]
        direction TB
        Input[Service: Elevator Report]
        Check{Property Type?}
        Check -- Apartment --> Show[Show Elevator Questions]
        Check -- Townhouse --> Hide[Hide Elevator Questions]
    end
    
    PropType -.-> Check
``` 

