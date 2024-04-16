import React, { useEffect } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected }) => {
    useEffect(() => {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner-container'),
                constraints: {
                    width: 480,
                    height: 320,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: ["code_128_reader"] // Specify barcode formats here
            },
        }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(onDetected);

        return () => {
            Quagga.offDetected(onDetected);
            Quagga.stop();
        };
    }, [onDetected]);

    return <div id="scanner-container" />;
};

export default BarcodeScanner;
