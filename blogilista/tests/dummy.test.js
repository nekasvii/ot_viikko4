// teht 4.3 teht 4.3 apufunktioita ja yksikkötestejä step1
// dummy funktion testaus
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})