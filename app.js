const http = require('http');
const fs = require('fs');
const { watermarkPdf } = require('./modifyPdf/dist/watermarkPdf-commonjs');
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const axios = require('axios');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const hostname = 'localhost';
const port = 3000;

const urlToBuffer = async (url) => {
  return await fetch(url, {
    mode: "no-cors"
  }).then(res => {
    console.log(res.data)
    return res.arrayBuffer()
  })
}
// async function watermarkPdf(file) {
//   if (file) {
//     const pdfDoc = await PDFDocument.load(file)
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
//     const dateNow = new Date().toLocaleString('vi')
//     const text = `Võ Trí Luân - ${dateNow}    `
//     const pages = pdfDoc.getPages()
//     const numberOfPages = pages.length;

//     // loop throgh all pages
//     if (text) {
//       for (let i = 0; i < numberOfPages; i++) {
//         const page = pages[i];
//         const { width, height } = page.getSize();

//         await page.drawText(
//           `${text.repeat(4)} 
//           ${text.repeat(4)} 
//           ${text.repeat(3)} `, {
//           x: width / 2 - text.length * 14,
//           y: height / 2 - 300,
//           size: 16,
//           font: helveticaFont,
//           color: rgb(0., 0.05, 0.05),
//           opacity: 0.2,
//           lineHeight: 250,
//           rotate: degrees(55),
//         })

//       }
//     }

//     const pdfBytes = await pdfDoc.save()

//     return pdfBytes.buffer
//   }
// }
const server = http.createServer(async (req, res) => {
  try {
    const arrayBuffer = await fetch('https://vbinfostatic.vietbank.com.vn/quanlytotrinh/votriluan@vietbank.com.vn/2023/7/7/16913782975340.7573088960999725_98892.2023.pdf', { mode: 'no-cors' }).then(res => res.arrayBuffer())
    console.log({ watermark: watermarkPdf })
    const pdfBytes = await watermarkPdf({ arrayBuffer, fullname: "Võ Trí Luân" })

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.end(Buffer.from(pdfBytes))
  } catch (error) {
    console.log(error)
    res.statusCode = 400;
    res.statusMessage = "Bad Request";
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
