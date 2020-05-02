const express = require('express');
const multer = require('multer');

const {plainAddPlaceholder} = require('node-signpdf/dist/helpers');
const signer = require("node-signpdf").default;

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const documentSignFiles = upload.fields([{name: 'document', maxCount: 1}, {name: 'key', maxCount: 1}]);

router.post('/sign', documentSignFiles, async function (req, res) {
    let pdfBuffer = req.files.document[0].buffer;
    const p12Buffer = req.files.key[0].buffer;

    const dateNow = new Date().toUTCString();

    pdfBuffer = plainAddPlaceholder({
        pdfBuffer,
        reason: 'Signed for user at ' + dateNow,
        signatureLength: 8000,
    });

    let pdfSigned = signer.sign(pdfBuffer, p12Buffer, {passphrase: 'oFnvgdP1234!'});

    console.log(pdfSigned);

    //todo: return pdf to user
    await res.json({
        'message': 'pdf was signed!',
        'data': {
          'link': 'http://localhost:3000/signed/file.pdf',
          'expired_in' : 1234567890
        }
    })
});

module.exports = router;
