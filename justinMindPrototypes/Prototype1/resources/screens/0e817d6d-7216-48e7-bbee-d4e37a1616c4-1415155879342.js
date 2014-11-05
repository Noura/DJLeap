jQuery("#simulation")
  .on("click", ".s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 .click", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Triangle_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/69c5fdc3-b2bf-477f-80b7-e76398ac2b08"
                  }
                }
              ]
            }
          ]
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  })
  .on("click", ".s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 .toggle", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Rectangle_2")) {
      if(jFirer.data("jimHasToggle")) {
        jFirer.removeData("jimHasToggle");
        jEvent.undoCases(jFirer);
      } else {
        jFirer.data("jimHasToggle", true);
        event.backupState = true;
        event.target = jFirer;
        cases = [
          {
            "blocks": [
              {
                "actions": [
                  {
                    "action": "jimChangeStyle",
                    "parameter": [ {
                      "#s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 #s-Rectangle_2": {
                        "attributes": {
                          "background-color": "transparent",
                          "background-image": "none"
                        }
                      }
                    },{
                      "#s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 #s-Rectangle_2": {
                        "attributes-ie": {
                          "-pie-background": "transparent",
                          "-pie-poll": "false"
                        }
                      }
                    } ]
                  }
                ]
              }
            ]
          }
        ];
        jEvent.launchCases(cases);
      }
    }
  })
  .on("drag", ".s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 .drag", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getDirectEventFirer(this);
    if(jFirer.is("#s-Rectangle_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimMove",
                  "parameter": {
                    "target": "#s-Rectangle_1",
                    "type": "movewithcursor",
                    "containment": false,
                    "axis": "x"
                  }
                }
              ]
            }
          ]
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  })
  .on("dragend", ".s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 .drag", function(event, data) {
    jimEvent(event).jimRestoreDrag(jQuery(this));
  })
  .on("dragend", ".s-0e817d6d-7216-48e7-bbee-d4e37a1616c4 .drag", function(event, data) {
    jimEvent(event).jimDestroyDrag(jQuery(this));
  });