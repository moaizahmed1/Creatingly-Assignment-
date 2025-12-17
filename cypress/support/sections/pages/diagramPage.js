import { DiagramLocators } from '../shape'
import {
  verifyShape,
  moveShape,
  resizeShape
} from '../shape'

export default class DiagramPage {

  open() {
    cy.VisitApp({ timeout: 100000 })
    cy.runRoutes('route')
  }

  dragShapeByIndex(index) {
    cy.dragElementToCenter(
      DiagramLocators.leftPanelShape,
      index,
      DiagramLocators.leftPanelShape,
      DiagramLocators.canvas
    )
  }

  verifyAndModifyShape() {
    verifyShape()
    moveShape()
    resizeShape()
  }

  connectShapes(sourceHandle, targetHandle) {
    cy.connectViaArrow(sourceHandle, targetHandle)
  }

  editShapeText(selector, text) {
    cy.editShapeText(selector, text)
  }

  undoRedo(selector) {
    cy.undoRedoMxGraph(selector)
  }

  deleteElements() {
    cy.verifyDeleteButton()
  }
}
