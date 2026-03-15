describe('template spec', () => {
  it('page loads and default values are correct', () => {
    cy.visit('/load_calculator')
    cy.get('[data-cy="load_calculator_header"] span:nth-child(1)').should('have.text', 'Load calculator');
    cy.get('[data-cy="load_calculator_header"] span:nth-child(2)').should('have.text', 'Test load and wire match');
    cy.get('[data-cy="RawWireView_TestIDs_title"]').should('have.text', 'Wire settings');
    cy.get('[data-cy="RawWireView_TestIDs_placement"] div[tabindex="0"]').should('have.text', 'In pipe on wall');
    cy.get('[data-cy="RawWireView_TestIDs_type"] div[tabindex="0"]').should('have.text', 'Multi wire');
    cy.get('[data-cy="RawWireView_TestIDs_phase"] div[tabindex="0"]').should('have.text', 'Single Phase');
    cy.get('[data-cy="RawWireView_TestIDs_diameter"] div[tabindex="0"]').should('have.text', '1.5');
    cy.get('[data-cy="RawWireView_TestIDs_length"] input').should('have.value', '5');
    cy.get('[data-cy="RawWireView_TestIDs_capacity"] input').should('have.value', '17.5');
    cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '8.79');
    cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '1468');
    cy.get('[data-cy="RawWireView_TestIDs_length"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '0.56');
    cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '0.56');
    cy.get('[data-cy="FormTextField_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '0.15');
    cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '0.15');
    cy.get('[data-cy="LoadView_TestIDs_title"]').should('have.text', 'Load settings');
    cy.get('[data-cy="draw_power_tf"] input').should('have.value', '2500');
    cy.get('[data-cy="draw_power_tf"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '0.56');
    cy.get('[data-testid="BoltIcon"]').should('be.visible');
    cy.get('[data-cy="power_factor_tf"] input').should('have.value', '1');
    cy.get('[data-cy="line_current_tf"] input').should('have.value', '10.87');
    cy.get('label:nth-of-type(1) [data-cy="FormCheckbox_TestIDs_checkbox"] input.PrivateSwitchBase-input').should('not.be.checked');
    cy.get('label:nth-of-type(2) [data-cy="FormCheckbox_TestIDs_checkbox"] input.PrivateSwitchBase-input').should('not.be.checked');
    cy.get('#root a.active').should('have.text', 'Load Calculator');
    cy.get('[data-cy="MessageListView_TestIDs_message_text:NO_ZEROING_TNC"]').should('have.text', 'The TN-C type connection requires zeroing');
  });

  it('changing wire part form works fine', function () {
    cy.visit('/load_calculator');
    
    //when clicking isZeroed
    cy.get('#root label:nth-child(5) span:nth-child(2)').click();
    cy.get('label:nth-of-type(2) [data-cy="FormCheckbox_TestIDs_checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:NO_ZEROING_TNC"]').should('not.exist');
    cy.get('#root label:nth-child(5) span:nth-child(2)').click();
    cy.get('label:nth-of-type(2) [data-cy="FormCheckbox_TestIDs_checkbox"] input.PrivateSwitchBase-input').uncheck();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:NO_ZEROING_TNC"]').should('be.visible');
    
    //when changing wire diameter
    cy.get('[data-cy="RawWireView_TestIDs_diameter"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:D_25"]').click();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:TOO_BIG_WIRE_DIAMETER"]').should('be.visible');
    cy.get('[data-cy="RawWireView_TestIDs_diameter"] div[tabindex="0"]').should('have.text', '2.5');
    cy.get('[data-cy="RawWireView_TestIDs_capacity"] input').should('have.value', '24');
    cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '0.34');
    cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '0.09');
    cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '2447');
    cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '5.27');
    cy.get('[data-cy="RawWireView_TestIDs_diameter"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:D_15"]').click();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:TOO_BIG_WIRE_DIAMETER"]').should('not.exist');
    
    //when changing multi wire params
    cy.get('[data-cy="RawWireView_TestIDs_placement"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:UNDER_PLASTER"]').click();
    cy.get('[data-cy="RawWireView_TestIDs_capacity"] input').should('have.value', '15.5');
    cy.get('[data-cy="RawWireView_TestIDs_type"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:ONE_WIRE"]').click();
    cy.get('[data-cy="RawWireView_TestIDs_capacity"] input').should('have.value', '16.5');
    
    //when changing wire length
    cy.get('[data-cy="RawWireView_TestIDs_length"] input').click();
    cy.get('[data-cy="RawWireView_TestIDs_length"] input').type('0');
    cy.get('[data-cy="RawWireView_TestIDs_length"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '5.63');
    cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '87.91');
    cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '147');
    cy.get('[data-cy="FormTextField_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '1.49');
    cy.get('[data-cy="MessageListView_TestIDs_message_text:TOO_BIG_VOLTAGE_DROP_THIS"]').should('be.visible');
    
    //when resolving voltage drop by increasing wire diameter
    cy.get('[data-cy="RawWireView_TestIDs_diameter"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:D_40"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '2.11');
    cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '0.56');
    cy.get('[data-cy="RawWireView_TestIDs_capacity"] input').should('have.value', '28');
    cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '32.97');
    cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '392');
    cy.get('[data-cy="MessageListView_TestIDs_message_text:TOO_BIG_WIRE_DIAMETER"]').should('be.visible');
    
    //go back and resolve by wire length decrease to max allowable
    cy.get('[data-cy="RawWireView_TestIDs_diameter"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:D_15"]').click();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:TOO_BIG_VOLTAGE_DROP_THIS"]').should('be.visible');
    cy.get('[data-cy="RawWireView_TestIDs_length"] input').click();
    cy.get('[data-cy="RawWireView_TestIDs_length"] input').clear();
    cy.get('[data-cy="RawWireView_TestIDs_length"] input').type('26.6');
    cy.get('[data-cy="RawWireView_TestIDs_length"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '2.99');
    cy.get('[data-cy="FormTextField_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '0.79');
    cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '46.77');
    cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '276');
  });

  it('changing load part form works fine', function () {
    cy.visit('/load_calculator');
    
    //when changing power
    cy.get('[data-cy="draw_power_tf"] input').click();
    cy.get('[data-cy="draw_power_tf"] input').clear();
    cy.get('[data-cy="draw_power_tf"] input').type('25'); //when clearing by backspace, empty string is auto converted to '0', so for 250 we just need to type 25
    cy.get('[data-cy="line_current_tf"] input').should('have.value', '1.09');
    cy.get('[data-cy="power_factor_tf"] input').should('have.value', '1');
    
    //when changing pf to zero
    cy.get('[data-cy="power_factor_tf"] input').click();
    cy.get('[data-cy="power_factor_tf"] input').clear();
    cy.get('[data-cy="power_factor_tf"] p').should('have.text', 'Too small: expected number to be >=0.1');
    cy.get('[data-cy="power_factor_tf"] input').click();
    cy.get('[data-cy="power_factor_tf"] input').type('.1');
    cy.get('[data-cy="power_factor_tf"] p').should('not.exist');
    cy.get('[data-cy="power_factor_tf"] [data-testid="ClearIcon"]').click();
    cy.get('[data-cy="power_factor_tf"] p').should('have.text', 'Invalid input: expected number, received string');
    cy.get('[data-cy="power_factor_tf"] input').click();
    cy.get('[data-cy="power_factor_tf"] input').type('2');
    cy.get('[data-cy="power_factor_tf"] p').should('have.text', 'Too big: expected number to be <=1');
    cy.get('[data-cy="power_factor_tf"] input').clear();
    cy.get('[data-cy="power_factor_tf"] input').type('.52');
    cy.get('[data-cy="line_current_tf"] input').should('have.value', '2.09');
    cy.get('[data-cy="power_factor_tf"] p').should('not.exist');
    
    //when changing to 3-phase wire
    cy.get('[data-cy="RawWireView_TestIDs_phase"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:THREE"]').click();
    cy.get('[data-cy="phase_current_tf"] input').should('be.visible');
    cy.get('[data-cy="line_current_tf"] input').should('have.value', '0.70');
    cy.get('[data-cy="phase_current_tf"] input').should('have.value', '0.70');
    cy.get('[data-cy="FormToggleGroup_TestIDs_button:DELTA"]').click();
    cy.get('[data-cy="phase_current_tf"] input').should('have.value', '0.40');
    cy.get('[data-cy="line_current_tf"] input').should('have.value', '0.70');
    cy.get('[data-cy="FormToggleGroup_TestIDs_button:STAR"]').click();
    cy.get('[data-cy="phase_current_tf"] input').should('have.value', '0.70');
  });

   it('light power selector works fine', function () {
    cy.visit('/load_calculator');
    
    //open and assert defaults
    cy.get('[data-cy="LoadView_TestIDs_lightPowerSelectorBtn"]').click();
    cy.get('[data-cy="light_power_selector_title"]').should('have.text', 'Light-based power selector');
    cy.get('[data-cy="LightPowerSelector_TestIDs_roomType"] div[tabindex="0"]').should('have.text', 'Residential');
    cy.get('[data-cy="LightPowerSelector_TestIDs_lightKind"] div[tabindex="0"]').should('have.text', 'Classic bulb');
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] input').should('have.value', '11.5');
    cy.get('[data-cy="LightPowerSelector_TestIDs_roomArea"] input').should('have.value', '5');
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '186.96');
    cy.get('[data-cy="LightPowerSelector_TestIDs_acceptBtn"]').should('be.enabled');
    
    //on form changes
    cy.get('[data-cy="LightPowerSelector_TestIDs_roomType"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:CORRIDOR_OR_UTILITY"]').click();
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '93.48');
    cy.get('[data-cy="LightPowerSelector_TestIDs_lightKind"]').click();
    cy.get('[data-cy="FormSelect_TestIDs_item:LINEAR_FLUORESCENT_LAMP"]').click();
    cy.get('[data-cy="LightPowerSelector_TestIDs_avgTouchable:AvgEfficiencyIndicator_touchable"] span:nth-child(1)').should('be.visible');
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] p').should('have.text', 'Outside range [45, 100]');
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] input').click();
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] input').clear();
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] input').type('5');
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '21.50');
    cy.get('[data-cy="LightPowerSelector_TestIDs_avgTouchable:AvgEfficiencyIndicator_touchable"] span:nth-child(1)').should('be.visible');
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] input').type('0');
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] p').should('have.text', 'Outside range [45, 100]');
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '2.15');
    cy.get('[data-cy="LightPowerSelector_TestIDs_avgTouchable:AvgEfficiencyIndicator_touchable"] span:nth-child(1)').should('be.visible');
    cy.get('[data-cy="LightPowerSelector_TestIDs_avgTouchable:AvgEfficiencyIndicator_touchable"] > span:nth-child(1)').click();
    cy.get('[data-cy="LightPowerSelector_TestIDs_efficiency"] input').should('have.value', '72.5');
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '14.83');
    cy.get('[data-cy="LightPowerSelector_TestIDs_avgTouchable:AvgEfficiencyIndicator_touchable"]').should('not.exist');
    cy.get('[data-cy="LightPowerSelector_TestIDs_roomArea"] input').click();
    cy.get('[data-cy="LightPowerSelector_TestIDs_roomArea"] input').type('0');
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '148.28');
    
    //on buttons action
    cy.get('[data-cy="light_power_selector_cancel_btn"]').click();
    cy.get('[data-cy="draw_power_tf"] input').should('have.value', '2500');
    cy.get('[data-testid="BoltIcon"]').click();
    cy.get('[data-cy="LightPowerSelector_TestIDs_requiredPower"] input').should('have.value', '186.96');
    cy.get('[data-cy="LightPowerSelector_TestIDs_acceptBtn"]').click();
    cy.get('[data-cy="draw_power_tf"] input').should('have.value', '186.96');
    cy.get('[data-cy="draw_power_tf"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '0.04');
    cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '1468');
    cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '0.05');
    cy.get('[data-cy="line_current_tf"] input').should('have.value', '0.81');
   });
});