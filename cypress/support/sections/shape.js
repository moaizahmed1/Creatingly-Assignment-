export const DiagramLocators = {
  leftPanelShape: '.geItem',
  canvas: '.geBackgroundPage',
  canvasShapes: '.mxCell'
}


export const interceptResponseCodeWait = (api, responseCode) =>
  cy.wait(api).its('response.statusCode').should('eq', responseCode)

export const verifyShape = () => {
  cy.get('.geDiagramContainer svg')
    .find('rect')
    .should('exist')
    .and('be.visible')
    .first()
    .then($shape => {
      const x = Number($shape.attr('x'))
      const y = Number($shape.attr('y'))

      expect(x).to.be.greaterThan(0)
      expect(y).to.be.greaterThan(0)
    })
}

export const moveShape = () => {
  let initialBox

  cy.get('g[style*="cursor: move"] rect', { timeout: 100000 })
    .first()
    .then($el => {
      initialBox = $el[0].getBoundingClientRect()
    })

  cy.get('g[style*="cursor: move"] rect')
    .first()
    .then($el => {
      const rect = $el[0].getBoundingClientRect()
      const startX = rect.left + rect.width / 2
      const startY = rect.top + rect.height / 2

      cy.wrap($el)
        .realMouseMove(startX, startY)
        .realMouseDown()
        .then(() => {
          cy.get('body')
            .realMouseMove(startX + 150, startY + 50, { steps: 10 })
            .realMouseUp()
        })
    })

  cy.wait(300)

  cy.get('g[style*="cursor: move"] rect')
    .first()
    .then($el => {
      const updatedBox = $el[0].getBoundingClientRect()
      expect(Math.abs(updatedBox.left - initialBox.left)).to.be.greaterThan(20)
      expect(Math.abs(updatedBox.top - initialBox.top)).to.be.greaterThan(20)
    })
}

export const resizeShape = () => {
  let initialBBox, initialWidth, initialHeight

  cy.get('g[style*="cursor: move"] rect')
    .first()
    .then($rect => {
      initialBBox = $rect[0].getBoundingClientRect()
      initialWidth = Number($rect.attr('width'))
      initialHeight = Number($rect.attr('height'))
    })

  cy.get('g[style*="cursor: nw-resize"] image')
    .first()
    .then($handle => {
      const box = $handle[0].getBoundingClientRect()

      cy.wrap($handle)
        .realMouseMove(box.left + box.width / 2, box.top + box.height / 2)
        .realMouseDown()
        .then(() => {
          cy.get('body')
            .realMouseMove(box.left - 90, box.top - 90, { steps: 15 })
            .realMouseUp()
        })
    })

  cy.wait(1000)

  cy.get('g[style*="cursor: move"] rect')
    .first()
    .then($rect => {
      const updatedBBox = $rect[0].getBoundingClientRect()
      expect(Math.abs(updatedBBox.width - initialBBox.width)).to.be.greaterThan(10)
      expect(Math.abs(updatedBBox.height - initialBBox.height)).to.be.greaterThan(10)
    })
}
