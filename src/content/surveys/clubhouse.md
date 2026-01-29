---
title: "Clubhouse"
description: "Detailed assessment of clubhouse assets including envelope, interior, and mechanical systems."
icon: "Home"
questions:
  - id: "clubhouse_envelope"
    text: "When was the Clubhouse envelope (including siding, windows, doors, roofing) last replaced, and at what cost?"
    type: "text"
    isMandatory: true

  - id: "clubhouse_interior"
    text: "When were the clubhouse interior components (flooring, painting, doors, lighting) last replaced and at what cost?"
    type: "text"
    isMandatory: true

  - id: "clubhouse_mechanical"
    text: "Clubhouse mechanical equipment replacement history (boilers, hot water tanks, heat pumps) including cost?"
    type: "text"
    isMandatory: true

  - id: "clubhouse_furniture"
    text: "What is the history of the Clubhouse Furniture and Equipment (Lounge, Gym, Kitchen appliances, Chairs, Tables, etc.)?"
    type: "text"
    isMandatory: true

  - id: "clubhouse_future_work"
    text: "Is there any repairs or replacement work planned for the future?"
    type: "boolean"
    isMandatory: true

  - id: "clubhouse_future_work_desc"
    text: "Please describe the planned repairs or replacement work."
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "clubhouse_future_work"
      value: "true"
---
