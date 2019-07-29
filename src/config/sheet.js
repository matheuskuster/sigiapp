const excel = require('excel4node')
const path = require('path')
const Sheet = require('../app/models/Sheet')

class SheetController {
  async createSheet (committe, users) {
    const workbook = new excel.Workbook()

    const options = {
      sheetFormat: {
        defaultColWidth: 30
      }
    }

    const worksheet = workbook.addWorksheet('Usuários', options)

    const titleStyle = workbook.createStyle({
      font: {
        color: '#000000',
        size: 12,
        bold: true
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -'
    })

    const defaultStyle = workbook.createStyle({
      font: {
        color: '#000000',
        size: 12,
        bold: false
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -'
    })

    worksheet
      .cell(1, 1)
      .string('DELEGAÇÃO')
      .style(titleStyle)
    worksheet
      .cell(1, 2)
      .string('LOGIN')
      .style(titleStyle)
    worksheet
      .cell(1, 3)
      .string('SENHA')
      .style(titleStyle)

    users.map((user, index) => {
      const line = index + 2

      worksheet
        .cell(line, 1)
        .string(user.delegation.name.toUpperCase())
        .style(defaultStyle)
      worksheet
        .cell(line, 2)
        .string(user.login)
        .style(defaultStyle)
      worksheet
        .cell(line, 3)
        .string(user.password)
        .style(defaultStyle)
    })

    const name = `${committe.organ.alias}${committe.year}.xls`
    const sheetPath = path.resolve(__dirname, '..', 'public', 'sheets', name)

    await workbook.write(sheetPath)
    return await Sheet.create({
      committe,
      path: name
    })
  }
}

module.exports = new SheetController()
