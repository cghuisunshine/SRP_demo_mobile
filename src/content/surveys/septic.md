---
title: "Septic Fields & Sanitary"
description: "Technical data collection for strata with independent waste systems."
icon: "Droplets"
questions:
  - id: "waste_system_type"
    text: "Does the sanitary system carry waste water to septic field on the lots, to a community holding tank or a biodigester system?"
    type: "select"
    options:
      - "Individual Septic Fields"
      - "Community Holding Tank"
      - "Biodigester"
    isMandatory: true

  - id: "community_septic_desc"
    text: "Please describe the community septic system"
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "waste_system_type"
      value: "Community Holding Tank"

  - id: "pump_count"
    text: "How many pumps are between the residences and the holding tank(s)?"
    type: "text"
    isMandatory: false

  - id: "last_maintenance_date"
    text: "When was the last time any work was completed?"
    type: "text"
    isMandatory: false

  - id: "last_maintenance_cost"
    text: "What was the cost of the last maintenance work?"
    type: "text"
    isMandatory: false

  - id: "holding_tank_details"
    text: "Please describe the composition, number, and capacity of holding tanks (if known)"
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "waste_system_type"
      value: "Community Holding Tank"

  - id: "biodigester_details"
    text: "Please describe the size, capacity, make, and model of biodigester"
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "waste_system_type"
      value: "Biodigester"

  - id: "future_work"
    text: "Are you planning any work in the future?"
    type: "boolean"
    isMandatory: true
---
