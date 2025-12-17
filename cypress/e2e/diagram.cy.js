import DiagramPage from '../support/sections/pages/diagramPage'

describe('Shape Test', () => {

  const diagram = new DiagramPage()

  it('Complete assignment of app.diagrams.net', () => {

    diagram.open()

    diagram.dragShapeByIndex(15)
    diagram.verifyAndModifyShape()

    diagram.dragShapeByIndex(12)

    diagram.connectShapes(
      'g[style*="cursor: e-resize"] image',
      'g[style*="cursor: s-resize"] image'
    )

    diagram.editShapeText('g > ellipse[cx="1196"]', 'I am a QA!')
    diagram.undoRedo('g > rect')
    diagram.deleteElements()
  })
})
