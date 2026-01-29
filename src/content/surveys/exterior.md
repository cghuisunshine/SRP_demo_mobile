---
title: "Exterior Maintenance"
description: "Information regarding the building envelope, roofing, and grounds."
icon: "Home"
questions:
  - id: "ext-1"
    text: "Has the roof been replaced since the last report?"
    type: "boolean"
    isMandatory: true
  - id: "ext-2"
    text: "What year was the roof replaced?"
    type: "text"
    isMandatory: true
    helpText: "Enter 4-digit year"
    dependsOn:
      questionId: "ext-1"
      value: "true"
  - id: "ext-3"
    text: "Type of exterior cladding?"
    type: "select"
    options: ["Stucco", "Vinyl Siding", "Hardie Board", "Brick", "Mixed"]
    isMandatory: true
  - id: "ext-4"
    text: "Are there signs of water ingress visible?"
    type: "boolean"
    isMandatory: true
---

Detailed exterior survey for engineering review.
