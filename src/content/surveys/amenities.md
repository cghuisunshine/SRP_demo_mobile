---
title: "Amenities"
description: "Please indicate the amenity package available at the complex."
icon: "CheckSquare"
questions:
  - id: "has_common_room"
    text: "Common Room"
    type: "boolean"
    isMandatory: false

  - id: "has_guest_room"
    text: "Guest Room"
    type: "boolean"
    isMandatory: false

  - id: "has_sauna"
    text: "Sauna"
    type: "boolean"
    isMandatory: false

  - id: "has_gym"
    text: "Gym"
    type: "boolean"
    isMandatory: false

  - id: "has_library"
    text: "Library"
    type: "boolean"
    isMandatory: false

  - id: "has_pool"
    text: "Pool"
    type: "boolean"
    isMandatory: false

  - id: "has_changing_rooms"
    text: "Changing Rooms"
    type: "boolean"
    isMandatory: false

  - id: "has_tennis"
    text: "Tennis Court"
    type: "boolean"
    isMandatory: false

  - id: "has_playground"
    text: "Playground"
    type: "boolean"
    isMandatory: false

  - id: "has_concierge"
    text: "Concierge"
    type: "boolean"
    isMandatory: false

  - id: "has_caretaker"
    text: "Caretaker's Suite"
    type: "boolean"
    isMandatory: false

  - id: "has_other"
    text: "Other"
    type: "boolean"
    isMandatory: false

  - id: "other_desc"
    text: "Please specify other amenities"
    type: "text"
    isMandatory: false
    dependsOn:
      questionId: "has_other"
      value: "true"
---
