// QR Code generation Web Worker
self.importScripts('https://unpkg.com/qrcode@1.5.4/build/qrcode.min.js');

self.onmessage = async function(e) {
  const { id, type, data } = e.data;

  try {
    switch (type) {
      case 'GENERATE_QR_CANVAS':
        // Canvas operations need to be done on main thread
        // This worker generates data URL
        const dataURL = await QRCode.toDataURL(data.text, {
          width: data.size,
          errorCorrectionLevel: data.errorCorrectionLevel,
          color: {
            dark: data.foregroundColor,
            light: data.backgroundColor,
          },
          margin: 2,
        });
        
        self.postMessage({
          id,
          type: 'QR_GENERATED',
          result: dataURL
        });
        break;
        
      case 'GENERATE_QR_HIGH_RES':
        const highResDataURL = await QRCode.toDataURL(data.text, {
          width: data.size * 2,
          errorCorrectionLevel: data.errorCorrectionLevel,
          color: {
            dark: data.foregroundColor,
            light: data.backgroundColor,
          },
          margin: 2,
        });
        
        self.postMessage({
          id,
          type: 'QR_HIGH_RES_GENERATED',
          result: highResDataURL
        });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'ERROR',
      error: error.message
    });
  }
};