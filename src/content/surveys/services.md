---
title: "Services"
description: "Technical data collection for strata with independent waste systems."
icon: "Activity"
questions:
  - id: "sanitary_system_type"
    text: "Does the sanitary system carry waste water to septic field on the lots, to a community holding tank or a biodigester system?"
    type: "radio"
    options:
      - "Individual Septic Fields"
      - "Community Holding tank"
      - "Biodigester"
    isMandatory: true

  - id: "community_septic_desc"
    text: "Please describe the community septic system"
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "sanitary_system_type"
      value: "Community Holding tank"

  - id: "pumps_count"
    text: "How many pumps are between the residences and the holding tank(s)?"
    type: "text"
    isMandatory: true

  - id: "last_work_cost"
    text: "When was the last time any work was completed and what was the cost?"
    type: "text"
    isMandatory: true

  - id: "holding_tanks_capacity"
    text: "Please describe the composition number and capacity of holding tanks (if known)?"
    type: "text"
    isMandatory: false

  - id: "biodigester_desc"
    text: "Please describe the size, capacity, make, and model of biodigester"
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "sanitary_system_type"
      value: "Biodigester"

  - id: "future_work_plans"
    text: "Are you planning any work in the future?"
    type: "boolean"
    isMandatory: true
---
