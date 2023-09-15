const { PDFDocument, StandardFonts, degrees, rgb } = require("pdf-lib")
function isNegative(num) {
  if (typeof num === 'number' && Math.sign(num) === -1) {
    return true;
  }

  return false;
}
function colorRGB(red, green, blue,) {
  return () => rgb(red / 255, green / 255, blue / 255)
}
async function watermarkPdf({ url, text, rotate, color, opacity, fontSize }) {
  // const arrayBuffer = new File([file]).arrayBuffer()
  if (url) {
    const arrayBuffer = await fetch(url).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const dateNow = new Date().toLocaleString('vi')
    // const text = `${fullname} - ${dateNow}    `
    text = `${text}    `
    const pages = pdfDoc.getPages()
    const numberOfPages = pages.length;

    // loop throgh all pages
    if (text) {
      pages.forEach(page => {
        const { width, height } = page.getSize();
        const size = fontSize ?? 16
        const _rotate = rotate === 0 ? rotate : isNegative(rotate) ? -(Math.atan(height / width) * 180 / Math.PI) : Math.atan(height / width) * 180 / Math.PI

        const _color = color ? color() : rgb(0., 0.05, 0.05)
        const _opacity = opacity ?? 0.2

        const yWithRotateOtherThanZero = isNegative(rotate) ? height : 0
        const xWithRotateEqualZero = -width
        const yText1 = (height / 2) + ((height / 2) / 2)
        const yText2 = height / 2
        const yText3 = (height / 2) - ((height / 2) / 2)

        const xText1 = -(width / 2)
        const xText2 = 0
        const xText3 = width / 2

        page.drawText(
          `${text.repeat(10)}`, {
          x: rotate === 0 ? xWithRotateEqualZero : xText1,
          y: rotate === 0 ? yText1 : yWithRotateOtherThanZero,
          size,
          font: helveticaFont,
          color: _color,
          opacity: _opacity,
          // lineHeight: 250,
          rotate: degrees(_rotate),
        })
        page.drawText(
          `${text.repeat(10)}`, {
          x: rotate === 0 ? xWithRotateEqualZero : xText2,
          y: rotate === 0 ? yText2 : yWithRotateOtherThanZero,
          size,
          font: helveticaFont,
          color: _color,
          opacity: _opacity,
          // lineHeight: 250,
          rotate: degrees(_rotate),
        })
        page.drawText(
          `${text.repeat(10)}`, {
          x: rotate === 0 ? xWithRotateEqualZero : xText3,
          y: rotate === 0 ? yText3 : yWithRotateOtherThanZero,
          size,
          font: helveticaFont,
          color: _color,
          opacity: _opacity,
          // lineHeight: 250,
          rotate: degrees(_rotate),
        })
      })
    }

    const pdfBytes = await pdfDoc.save()

    return pdfBytes
  }
}
const Watermark = { watermarkPdf, colorRGB }
module.exports = Watermark;