
// Custom command to visit the app
Cypress.Commands.add('VisitApp', () => {
  cy.visit(Cypress.config('baseUrl'))
})

// Custom command to setup intercepts
Cypress.Commands.add('runRoutes', (route) => {
  cy.intercept('GET', 'https://app.diagrams.net/resources/dia.txt').as('Diatext')
  cy.intercept('GET', 'https://app.diagrams.net/cache?alive').as('Cachealive')
  cy.intercept('GET', 'https://app.diagrams.net/notifications').as('Notification')
})

// Custom command for drag and drop element
Cypress.Commands.add('dragElementToCenter', (itemLocator, index, widgetLocator, dropAreaLocator) => {
  const dataTransfer = new DataTransfer()

  cy.get(itemLocator)
    .eq(index)
    .scrollIntoView()
    .should('be.visible')
    .click()

  cy.get('div.popup-elements div.waiting-saved-template svg', { timeout: 60000 }).should('not.exist')

  cy.get(widgetLocator)
    .eq(index)
    .should('be.visible')
    .then($el => {
      const elRect = $el[0].getBoundingClientRect()
      const startX = elRect.left + elRect.width / 2
      const startY = elRect.top + elRect.height / 2

      cy.wrap($el)
        .trigger('mousedown', { which: 1, force: true })
        .trigger('dragstart', { dataTransfer, pageX: startX, pageY: startY, force: true })

      cy.get(dropAreaLocator)
        .should('be.visible')
        .then($target => {
          const targetRect = $target[0].getBoundingClientRect()
          const dropX = targetRect.left + targetRect.width / 2
          const dropY = targetRect.top + targetRect.height / 2

          cy.wrap($target)
            .trigger('dragover', { dataTransfer, pageX: dropX, pageY: dropY, force: true })
            .trigger('drop', { dataTransfer, pageX: dropX, pageY: dropY, force: true })

          cy.wrap($el).trigger('mouseup', { force: true })
        })
    })
})

// Drag shape by offset
Cypress.Commands.add('dragShape', (selector, offset) => {
  cy.get(selector)
    .should('exist')
    .first()
    .then($g => {
      const rect = $g[0].getBoundingClientRect()
      const startX = rect.left + rect.width / 2
      const startY = rect.top + rect.height / 2

      cy.wrap($g)
        .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
        .trigger('mousemove', { clientX: startX + offset.x, clientY: startY + offset.y, force: true })
        .trigger('mouseup', { clientX: startX + offset.x, clientY: startY + offset.y, force: true })
    })
})

// Connect shapes via arrow
Cypress.Commands.add('connectViaArrow', (sourceNode, targetHandle) => {
  cy.get(sourceNode)
    .trigger('mouseover', { force: true })
    .trigger('mouseenter', { force: true })
    .trigger('mousemove', { force: true })

  cy.get('img[title*="Click to connect"]')
    .filter(':visible')
    .first()
    .click({ shiftKey: true, force: true })

  cy.get(targetHandle)
    .should('be.visible')
    .trigger('mouseover', { force: true })
    .trigger('mousedown', { force: true })
    .trigger('mouseup', { force: true })
})

// Verify connection command
Cypress.Commands.add('verifyConnection', (
  sourceNode,
  targetNode,
  connectorSelector,
  arrowSelector,
  moveOffsets = { source: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
) => {
  const epsilon = 0.01

  cy.get(connectorSelector).should('exist').and('be.visible')
  cy.get(arrowSelector).should('exist').and('be.visible')

  cy.get(connectorSelector).then($path => {
    const coords = $path.attr('d').match(/[\d\.]+/g).map(Number)
    expect(coords[2]).to.be.greaterThan(coords[0] - epsilon)
  })

  if (moveOffsets.source.x !== 0 || moveOffsets.source.y !== 0) {
    cy.get(sourceNode)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: moveOffsets.source.x, clientY: moveOffsets.source.y, force: true })
      .trigger('mouseup', { force: true })
  }

  if (moveOffsets.target.x !== 0 || moveOffsets.target.y !== 0) {
    cy.get(targetNode)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: moveOffsets.target.x, clientY: moveOffsets.target.y, force: true })
      .trigger('mouseup', { force: true })
  }

  cy.get(connectorSelector).should('exist').and('be.visible')
  cy.get(connectorSelector).then($path => {
    const coordsAfter = $path.attr('d').match(/[\d\.]+/g).map(Number)
    expect(coordsAfter[2]).to.be.greaterThan(coordsAfter[0] - epsilon)
  })
})

// Edit shape text command
Cypress.Commands.add('editShapeText', (shapeSelector, newText, saveByEnter = true) => {
  const textEditorSelector = 'div.mxCellEditor.geContentEditable[contenteditable="true"]'

  cy.get(shapeSelector).dblclick({ force: true })
  cy.get(textEditorSelector).should('be.visible').clear({ force: true }).type(newText, { force: true })

  if (saveByEnter) {
    cy.get(textEditorSelector).type('{enter}', { force: true })
  }

  cy.get(textEditorSelector).should('contain.text', newText)
})

// Undo/Redo command
Cypress.Commands.add('undoRedoMxGraph', (shapeSelector) => {
  const getX = ($el) => parseFloat($el.attr('x'))

  cy.get('.geDiagramContainer, .mxGraphContainer').first().click({ force: true }).focus()

  cy.get(shapeSelector).first().then($shape => {
    cy.wrap(getX($shape)).as('initialX')
  })

  cy.get(shapeSelector).first().then($shape => {
    const rect = $shape[0].getBoundingClientRect()

    cy.wrap($shape)
      .trigger('mousedown', {
        clientX: rect.x + rect.width / 2,
        clientY: rect.y + rect.height / 2,
        force: true
      })
      .trigger('mousemove', {
        clientX: rect.x + rect.width / 2 + 80,
        clientY: rect.y + rect.height / 2,
        force: true
      })
      .trigger('mouseup', { force: true })
  })

  cy.get('.geDiagramContainer, .mxGraphContainer')
    .first()
    .trigger('keydown', { key: 'z', ctrlKey: true, force: true })

  cy.get('@initialX').then(initialX => {
    cy.get(shapeSelector).first().should($shape => {
      expect(getX($shape)).to.eq(initialX)
    })
  })

  cy.get('.geDiagramContainer, .mxGraphContainer')
    .first()
    .trigger('keydown', { key: 'y', ctrlKey: true, force: true })
})

// Verify delete button and delete elements command
Cypress.Commands.add('verifyDeleteButton', () => {
  cy.get('g > ellipse[cx="1196"]').click({ force: true })
  cy.get('a.geButton[title="Delete (Delete)"]').should('exist').and('be.visible').click()

  const pathSelector = 'path[d^="M 1186 1522"]'

  cy.get(pathSelector).first().rightclick({ force: true })
  cy.get('tbody').should('be.visible')

  cy.contains('tr.mxPopupMenuItem', /^Delete$/).should('be.visible').click({ force: true })
  cy.get(pathSelector).should('not.exist')

  const connectorSelector = 'path[d^="M 1196 1562"]'

  cy.get(connectorSelector).first().rightclick({ force: true })
  cy.get('tbody').should('be.visible')

  cy.contains('tr.mxPopupMenuItem', /^Delete$/).should('be.visible').click({ force: true })
  cy.get(connectorSelector).should('not.exist')
})
