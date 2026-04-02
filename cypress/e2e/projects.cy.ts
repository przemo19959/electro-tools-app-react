let projects = [
  { id: '100001-0', name: 'Project 1001', createdBy: 'user1', modifiedBy: 'user2', modifiedDate: '2025-01-01T08:00:00.000Z', elementCount: 12 },
  { id: '100002-1', name: 'Project 1002', createdBy: 'user3', modifiedBy: 'user4', modifiedDate: '2025-01-02T08:00:00.000Z', elementCount: 24 },
  { id: '100003-2', name: 'Project 1003', createdBy: 'user5', modifiedBy: 'user6', modifiedDate: '2025-01-03T08:00:00.000Z', elementCount: 36 },
  { id: '100004-3', name: 'Project 1004', createdBy: 'user7', modifiedBy: 'user8', modifiedDate: '2025-01-04T08:00:00.000Z', elementCount: 48 },
  { id: '100005-4', name: 'Project 1005', createdBy: 'user9', modifiedBy: 'user10', modifiedDate: '2025-01-05T08:00:00.000Z', elementCount: 60 },
  { id: '100006-5', name: 'Project 1006', createdBy: 'user11', modifiedBy: 'user12', modifiedDate: '2025-01-06T08:00:00.000Z', elementCount: 72 },
  { id: '100007-6', name: 'Project 1007', createdBy: 'user13', modifiedBy: 'user14', modifiedDate: '2025-01-07T08:00:00.000Z', elementCount: 84 },
  { id: '100008-7', name: 'Project 1008', createdBy: 'user15', modifiedBy: 'user16', modifiedDate: '2025-01-08T08:00:00.000Z', elementCount: 96 },
  { id: '100009-8', name: 'Project 1009', createdBy: 'user17', modifiedBy: 'user18', modifiedDate: '2025-01-09T08:00:00.000Z', elementCount: 108 },
  { id: '100010-9', name: 'Project 1010', createdBy: 'user19', modifiedBy: 'user20', modifiedDate: '2025-01-10T08:00:00.000Z', elementCount: 120 },
  { id: '100011-10', name: 'Project 1011', createdBy: 'user21', modifiedBy: 'user22', modifiedDate: '2025-01-11T08:00:00.000Z', elementCount: 132 },
  { id: '100012-11', name: 'Project 1012', createdBy: 'user23', modifiedBy: 'user24', modifiedDate: '2025-01-12T08:00:00.000Z', elementCount: 144 },
  { id: '100013-12', name: 'Project 1013', createdBy: 'user25', modifiedBy: 'user26', modifiedDate: '2025-01-13T08:00:00.000Z', elementCount: 156 },
  { id: '100014-13', name: 'Project 1014', createdBy: 'user27', modifiedBy: 'user28', modifiedDate: '2025-01-14T08:00:00.000Z', elementCount: 168 },
  { id: '100015-14', name: 'Project 1015', createdBy: 'user29', modifiedBy: 'user30', modifiedDate: '2025-01-15T08:00:00.000Z', elementCount: 180 },
  { id: '100016-15', name: 'Project 1016', createdBy: 'user31', modifiedBy: 'user32', modifiedDate: '2025-01-16T08:00:00.000Z', elementCount: 192 },
  { id: '100017-16', name: 'Project 1017', createdBy: 'user33', modifiedBy: 'user34', modifiedDate: '2025-01-17T08:00:00.000Z', elementCount: 204 },
  { id: '100018-17', name: 'Project 1018', createdBy: 'user35', modifiedBy: 'user36', modifiedDate: '2025-01-18T08:00:00.000Z', elementCount: 216 },
  { id: '100019-18', name: 'Project 1019', createdBy: 'user37', modifiedBy: 'user38', modifiedDate: '2025-01-19T08:00:00.000Z', elementCount: 228 },
  { id: '100020-19', name: 'Project 1020', createdBy: 'user39', modifiedBy: 'user40', modifiedDate: '2025-01-20T08:00:00.000Z', elementCount: 240 },
];
const originalProjects = structuredClone(projects);

describe('template spec', () => {
  beforeEach(() => {
    projects = originalProjects;

    cy.intercept('POST', '**/projects/page*', (req) => {
      const page = Math.max(0, Number.parseInt(String(req.query.page ?? 0), 10) || 0);
      const size = Math.max(1, Number.parseInt(String(req.query.size ?? 10), 10) || 10);
      const search = String(req.query.query ?? req.query.search ?? '').trim().toLowerCase();

      const filteredProjects = search
        ? projects.filter((project) =>
          [project.name, project.createdBy, project.modifiedBy]
            .join(' ')
            .toLowerCase()
            .includes(search),
        )
        : projects;

      const totalElements = filteredProjects.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const startIndex = page * size;
      const content = filteredProjects.slice(startIndex, startIndex + size);

      req.reply({
        statusCode: 200,
        body: {
          totalPages,
          totalElements,
          size,
          content,
          number: page,
          first: page === 0,
          last: page >= totalPages - 1,
          numberOfElements: content.length,
          empty: content.length === 0,
        },
      });
    }).as('getProjectsPage');

    cy.intercept('POST', '**/projects', (req) => {
      const nextIndex = projects.length;
      const createdProject = {
        id: `${String(100001 + nextIndex).padStart(6, '0')}-${nextIndex}`,
        name: String(req.body?.name ?? ''),
        createdBy: `user${nextIndex * 2 + 1}`,
        modifiedBy: `user${nextIndex * 2 + 2}`,
        modifiedDate: new Date(Date.UTC(2025, 0, 1 + nextIndex, 8, 0, 0, 0)).toISOString(),
        elementCount: (nextIndex + 1) * 12,
      };

      projects = [...projects, createdProject];

      req.reply({
        statusCode: 200,
        body: createdProject,
      });
    }).as('createProject');

    cy.intercept('PUT', '**/projects/*', (req) => {
      const projectId = req.url.split('/').pop() ?? '';
      const projectIndex = projects.findIndex((project) => project.id === projectId);

      if (projectIndex === -1) {
        req.reply({ statusCode: 404 });
        return;
      }

      const updatedProject = {
        ...projects[projectIndex],
        ...req.body,
      };

      projects = [
        ...projects.slice(0, projectIndex),
        updatedProject,
        ...projects.slice(projectIndex + 1),
      ];

      req.reply({
        statusCode: 200,
        body: updatedProject,
      });
    }).as('updateProject');

    cy.intercept('DELETE', '**/projects', (req) => {
      const idsToDelete = Array.isArray(req.body)
        ? req.body.map((id: unknown) => String(id))
        : [];

      projects = projects.filter((project) => !idsToDelete.includes(project.id));

      req.reply({
        statusCode: 200,
        body: null,
      });
    }).as('deleteProjects');
  });

  it('data is fetched and shown', () => {
    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear
    cy.wait('@getProjectsPage');
    cy.contains('No Data').should('not.exist');

    //when search changes, page and totals are shown correctly
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 20');
    cy.get('#root div[tabindex="0"]').should('have.text', '10');
    cy.get('#root input[type="text"]').click();
    cy.get('#root input[type="text"]').type('user1');
    cy.get('#root input[type="text"]').should('have.value', 'user1');
    cy.get('#root p:nth-child(4)').should('have.text', '1–7 of 7');
    cy.get('#root div[tabindex="0"]').should('have.text', '10');
    cy.get('#root input[type="text"]').click();
    cy.get('#root input[type="text"]').type('1');
    cy.get('#root input[type="text"]').should('have.value', 'user11');
    cy.get('#root p:nth-child(4)').should('have.text', '1–1 of 1');
    cy.get('#root div[tabindex="0"]').should('have.text', '10');
    cy.get('[data-testid="ClearIcon"]').click();
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 20');
    cy.get('#root div[tabindex="0"]').should('have.text', '10');
  });

  it('data table selection works fine', () => {
    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear
    cy.wait('@getProjectsPage');
    cy.contains('No Data').should('not.exist');

    //when single items selected
    cy.get('tr:nth-of-type(1) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '1 selected');
    cy.get('button[aria-label="Delete"] path').should('be.visible');
    cy.get('#root tr[aria-checked="true"] input.PrivateSwitchBase-input').should('have.value', 'on');
    cy.get('#root input[data-indeterminate="true"]').should('have.value', 'on');
    cy.get('tr:nth-of-type(2) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('not.be.checked');

    //when second item selected
    cy.get('tr:nth-of-type(3) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('tr:nth-of-type(3) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('be.checked');
    cy.get('[data-cy="selection-count-label"]').should('have.text', '2 selected');
    cy.get('button[aria-label="Delete"] path').should('be.visible');

    //when all selected through header checkbox
    cy.get('[data-cy="header-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '10 selected');
    cy.get('[data-cy="header-checkbox"] input.PrivateSwitchBase-input').should('be.checked');
    cy.get('tr:nth-of-type(9) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('be.checked');
    cy.get('tr:nth-of-type(8) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('be.checked');
    cy.get('tr:nth-of-type(7) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('be.checked');

    //when single deselected now
    cy.get('tr:nth-of-type(2) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').uncheck();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '9 selected');
    cy.get('#root tr[aria-checked="false"] input.PrivateSwitchBase-input').should('not.be.checked');
    cy.get('#root input[data-indeterminate="true"]').should('have.attr', 'data-indeterminate', 'true');

    //when header checkbox clicked again, select all again
    cy.get('[data-cy="header-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '10 selected');
    cy.get('tr:nth-of-type(2) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('be.checked');

    //when header checkbox clicked, deselect all
    cy.get('[data-cy="header-checkbox"] input.PrivateSwitchBase-input').uncheck();
    cy.get('[data-cy="header-checkbox"] input.PrivateSwitchBase-input').should('not.be.checked');
    cy.get('tr:nth-of-type(1) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('not.be.checked');
    cy.get('tr:nth-of-type(2) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').should('not.be.checked');
  });

  it('create project flow works', () => {
    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear
    cy.wait('@getProjectsPage');
    cy.contains('No Data').should('not.exist');

    //basic create project flow
    cy.get('[data-cy="create_project_btn"]').click();
    cy.get('[data-cy="edit_project_modal_title"]').should('be.visible');
    cy.get('[data-cy="edit_project_modal_title"]').should('have.text', 'Create project');

    cy.get('[data-cy="edit_project_modal_apply_btn"]').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] p:nth-child(3)').should('have.text', 'Field is required');
    cy.get('[data-cy="edit_project_modal_name_tf"] input').click();

    cy.get('[data-cy="edit_project_modal_apply_btn"]').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] p:nth-child(3)').should('have.text', 'Field is required');
    cy.get('[data-cy="edit_project_modal_name_tf"] input').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] input').type('ddd');
    cy.get('[data-cy="edit_project_modal_name_tf"] input').should('have.value', 'ddd');
    cy.get('[data-testid="ClearIcon"]').should('be.visible');
    cy.get('[data-testid="ClearIcon"] path').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] input').should('have.text', '');

    cy.get('[data-cy="edit_project_modal_apply_btn"]').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] p:nth-child(3)').should('have.text', 'Field is required');
    cy.get('[data-cy="edit_project_modal_cancel_btn"]').click();
    cy.get('[data-cy="edit_project_modal_title"]').should('not.exist');

    //create new project and assert
    cy.get('[data-cy="create_project_btn"]').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] input').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] input').type('new');
    cy.get('[data-cy="edit_project_modal_apply_btn"]').click();
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 21');
    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').type('new');
    cy.get('[data-cy="name_data_cell"]').should('have.text', 'new');
    cy.get('[data-testid="ClearIcon"]').click();
    cy.get('[data-cy="search_tf"] input').should('have.value', '');
  });

  it('update project flow works', () => {
    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear
    cy.wait('@getProjectsPage');
    cy.contains('No Data').should('not.exist');
    cy.get('[data-testid="MenuIcon"] path').click(); //to hide sidenav and make all actions buttons visible


    //update project and assert
    cy.get('tr:nth-child(1) [data-cy="name_data_cell"]').should('have.text', 'Project 1001');
    cy.get('tr:nth-of-type(1) [data-testid="EditIcon"] path').click();
    cy.get('[data-cy="edit_project_modal_title"]').should('have.text', 'Edit project');
    cy.get('[data-cy="edit_project_modal_name_tf"] input').should('have.value', 'Project 1001');
    cy.get('[data-testid="ClearIcon"]').should('be.visible');
    cy.get('[data-cy="edit_project_modal_cancel_btn"]').click();
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 20');
    cy.get('tr:nth-child(1) [data-cy="name_data_cell"]').should('have.text', 'Project 1001');
    cy.get('tr:nth-child(1) [data-testid="EditIcon"]').click();
    cy.get('[data-cy="edit_project_modal_apply_btn"]').click();
    cy.get('tr:nth-child(1) [data-cy="name_data_cell"]').should('have.text', 'Project 1001');
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 20');
    cy.get('tr:nth-of-type(1) [data-testid="EditIcon"] path').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] input').click();
    cy.get('[data-cy="edit_project_modal_name_tf"] input').type('aaa');
    cy.get('[data-cy="edit_project_modal_name_tf"] input').should('have.value', 'Project 1001aaa');
    cy.get('[data-cy="edit_project_modal_apply_btn"]').click();
    cy.get('tr:nth-child(1) [data-cy="name_data_cell"]').should('have.text', 'Project 1001aaa');
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 20');
  })

  it('shows empty state when API returns no projects', () => {
    cy.intercept('GET', '**/projects/page*', {
      fixture: 'projects-empty-page.json',
    }).as('getEmptyProjectsPage');

    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear;
    cy.wait('@getEmptyProjectsPage');
    cy.contains('No Data').should('be.visible');
    cy.get('tbody tr').should('have.length', 1); //cause there is row with No Data
  });

  it('delete single project flow', function () {
    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear
    cy.wait('@getProjectsPage');
    cy.contains('No Data').should('not.exist');
    cy.get('[data-testid="MenuIcon"] path').click(); //to hide sidenav and make all actions buttons visible

    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 20');
    cy.get('tr:nth-of-type(1) [data-testid="DeleteIcon"] path').click();
    cy.get('[data-cy="confirm_modal_text"]').should('have.text', 'Do you want to delete project: Project 1001?');
    cy.get('[data-cy="confirm_modal_cancel_btn"]').click();
    cy.get('tr:nth-child(1) [data-cy="name_data_cell"]').should('have.text', 'Project 1001');
    cy.get('tr:nth-of-type(1) [data-testid="DeleteIcon"] path').click();
    cy.get('[data-cy="confirm_modal_apply_btn"]').click();
    cy.get('tr:nth-child(1) [data-cy="name_data_cell"]').should('have.text', 'Project 1002');
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 19');

    //when deleting selected item, selection is adjusted correctly
    cy.get('tr:nth-of-type(2) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('tr:nth-of-type(1) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '2 selected');
    cy.get('tr:nth-child(1) [data-testid="DeleteIcon"] path').click();
    cy.get('[data-cy="confirm_modal_apply_btn"]').click();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '1 selected');
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 18');

    //when using search to find
    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').type('1001');
    cy.get('#root td').should('have.text', 'No Data');
    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').clear();
    cy.get('[data-cy="search_tf"] input').type('1002');
    cy.get('#root td').should('have.text', 'No Data');
    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').clear();
    cy.get('[data-cy="search_tf"] input').type('1003');
    cy.get('[data-cy="name_data_cell"]').should('have.text', 'Project 1003');
  });

  it('delete multi project flow', () => {
    cy.visit('/projects').wait(1000).get('[data-cy="route-loader"]', { timeout: 20000 }).should('not.exist')  // Wait for loader to disappear
    cy.wait('@getProjectsPage');
    cy.contains('No Data').should('not.exist');
    cy.get('[data-testid="MenuIcon"] path').click(); //to hide sidenav and make all actions buttons visible

    cy.get('tr:nth-of-type(1) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('tr:nth-of-type(2) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('tr:nth-of-type(3) [data-cy="row-checkbox"] input.PrivateSwitchBase-input').check();
    cy.get('[data-cy="selection-count-label"]').should('have.text', '3 selected');

    cy.get('tr:nth-child(2) [data-testid="DeleteIcon"] path').click();
    cy.get('[data-cy="confirm_modal_apply_btn"]').click();
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 19');
    cy.get('[data-cy="selection-count-label"]').should('have.text', '2 selected');

    cy.get('button[aria-label="Delete"] path').click();
    cy.get('[data-cy="confirm_modal_text"]').should('have.text', 'Are you sure you want to delete 2 project(s)?');
    cy.get('[data-cy="confirm_modal_apply_btn"]').click();
    cy.get('#root p:nth-child(4)').should('have.text', '1–10 of 17');

    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').type('1001');
    cy.get('#root td').should('have.text', 'No Data');
    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').clear();
    cy.get('[data-cy="search_tf"] input').type('1002');
    cy.get('#root td').should('have.text', 'No Data');
    cy.get('[data-cy="search_tf"] input').click();
    cy.get('[data-cy="search_tf"] input').clear();
    cy.get('[data-cy="search_tf"] input').type('1003');
    cy.get('#root td').should('have.text', 'No Data');
  });
})
