---
title: "Legal"
description: "Information regarding lawsuits, arbitration, and legal claims."
icon: "Scale"
questions:
  - id: "legal_lawsuits"
    text: "Have there been lawsuits or arbitration decisions that affected the Contingency Reserve Fund (CRF)?"
    type: "boolean"
    isMandatory: true

  - id: "legal_lawsuits_desc"
    text: "Please explain the lawsuits or arbitration decisions."
    type: "text"
    isMandatory: true
    dependsOn:
      questionId: "legal_lawsuits"
      value: "true"

  - id: "legal_crt_claims"
    text: "Are there pending litigation/CRT claims that may affect the building?"
    type: "boolean"
    isMandatory: true

  - id: "legal_crt_claims_desc"
    text: "Please explain the pending litigation/CRT claims."
    type: "text"
    isMandatory: true
    dependsOn:
      questionId: "legal_crt_claims"
      value: "true"

  - id: "legal_responsibility"
    text: "Has the strata taken responsibility for a component in/on a strata lot?"
    type: "boolean"
    isMandatory: true

  - id: "legal_responsibility_desc"
    text: "Please explain the component responsibility."
    type: "text"
    isMandatory: true
    dependsOn:
      questionId: "legal_responsibility"
      value: "true"

  - id: "legal_lot_changes"
    text: "Please provide a list of strata lots that have taken responsibility for changes to common property or attachments/alterations of the building envelope."
    type: "text"
    isMandatory: true
---
