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

  it('changing form works fine', function () {
    cy.visit('/load_calculator');
    
    //when clicking isZeroed
    cy.get('#root label:nth-child(5) span:nth-child(2)').click();
    cy.get('label:nth-of-type(2) [data-cy="FormCheckbox_TestIDs_checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:NO_ZEROING_TNC"]').should('not.exist');
    cy.get('#root label:nth-child(5) span:nth-child(2)').click();
    cy.get('label:nth-of-type(2) [data-cy="FormCheckbox_TestIDs_checkbox"] input.PrivateSwitchBase-input').uncheck();
    cy.get('[data-cy="MessageListView_TestIDs_message_text:NO_ZEROING_TNC"]').should('be.visible');
    
    //when changing wire diameter
    // cy.get('[data-cy="MessageListView_TestIDs_message_text:TOO_BIG_WIRE_DIAMETER"]').should('be.visible');
    // cy.get('[data-cy="RawWireView_TestIDs_diameter"] div[tabindex="0"]').should('have.text', '2.5');
    // cy.get('[data-cy="RawWireView_TestIDs_capacity"] input').should('have.value', '24');
    // cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:VoltageDropIndicator_TestIDs_text"]').should('have.text', '0.34');
    // cy.get('[data-cy="FormSelect_TestIDs_endAdornment"] [data-cy="load_calculator:ImpedanceIndicator_TestIDs_text"]').should('have.text', '0.09');
    // cy.get('[data-cy="short_current_indicator_value"]').should('have.text', '2447');
    // cy.get('[data-cy="power_loss_indicator_value"]').should('have.text', '5.27');
  });
});