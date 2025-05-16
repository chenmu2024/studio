"use client";

import type { Dictionary } from '@/lib/dictionaries';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { Download, RefreshCw, Palette, Text, Zap, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BarcodeGeneratorProps = {
  dictionary: Dictionary;
};

type BarcodeType = "ean13" | "ean8" | "upca" | "upce" | "code128" | "code39" | "qrcode";

const initialBarcodeOptions = {
  format: "code128" as BarcodeType,
  lineColor: "#000000",
  background: "#ffffff",
  width: 2, // module width for 1D, or pixel size for QR
  height: 100,
  displayValue: true, // Show text below barcode
  textMargin: 2,
  fontSize: 16,
  margin: 10,
  transparentBackground: false,
  qrErrorCorrectionLevel: "M" as QRCode.QRCodeErrorCorrectionLevel,
};

export function BarcodeGenerator({ dictionary }: BarcodeGeneratorProps) {
  const [data, setData] = useState<string>("Example 12345");
  const [options, setOptions] = useState(initialBarcodeOptions);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const barcodeRef = useRef<SVGSVGElement | HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  const barcodeTypes = [
    { value: "code128", label: dictionary.barcodeTypes.code128, description: dictionary.barcodeTypes.code128Description, validationKey: "code128" },
    { value: "ean13", label: dictionary.barcodeTypes.ean13, description: dictionary.barcodeTypes.ean13Description, validationKey: "ean13" },
    { value: "ean8", label: dictionary.barcodeTypes.ean8, description: dictionary.barcodeTypes.ean8Description, validationKey: "ean8" },
    { value: "upca", label: dictionary.barcodeTypes.upca, description: dictionary.barcodeTypes.upcaDescription, validationKey: "upca" },
    { value: "upce", label: dictionary.barcodeTypes.upce, description: dictionary.barcodeTypes.upceDescription, validationKey: "upca" }, // UPC-E often derives from UPC-A
    { value: "code39", label: dictionary.barcodeTypes.code39, description: dictionary.barcodeTypes.code39Description, validationKey: "code39" },
    { value: "qrcode", label: dictionary.barcodeTypes.qrcode, description: dictionary.barcodeTypes.qrcodeDescription, validationKey: "qrcode" },
  ] as const;
  
  const currentBarcodeTypeInfo = barcodeTypes.find(bt => bt.value === options.format);
  const dataInputHint = currentBarcodeTypeInfo ? dictionary.validation[currentBarcodeTypeInfo.validationKey as keyof typeof dictionary.validation] : "";


  const generateBarcode = useCallback(() => {
    if (!barcodeRef.current) return;
    setValidationMessage('');

    try {
      if (options.format === "qrcode") {
        const canvas = barcodeRef.current as HTMLCanvasElement;
        QRCode.toCanvas(canvas, data || " ", { // Provide a space if data is empty to avoid error
          width: options.width * 50 > 100 ? options.width * 50 : 200, // QR size derived from 'width' slider
          errorCorrectionLevel: options.qrErrorCorrectionLevel,
          color: {
            dark: options.lineColor,
            light: options.transparentBackground ? "#00000000" : options.background,
          },
          margin: options.margin / 10, // QR Code margin is smaller unit
        }, (error) => {
          if (error) {
            console.error("QR Code generation error:", error);
            setValidationMessage(dictionary.errorGenerationFailed);
            toast({ title: dictionary.errorGenerationFailed, description: error.message, variant: "destructive" });
          }
        });
      } else {
        // For JsBarcode, ensure the element is clean or use a new one
        const svgContainer = barcodeRef.current.parentElement;
        if (svgContainer) {
            // Remove previous SVG if it exists
            const oldSvg = svgContainer.querySelector('svg');
            if (oldSvg) oldSvg.remove();
        }

        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.id = "barcode-svg"; 
        barcodeRef.current = svgElement; // Update ref to the new SVG
        if (svgContainer) svgContainer.appendChild(svgElement);

        JsBarcode(svgElement, data, {
          format: options.format.toUpperCase(),
          lineColor: options.lineColor,
          background: options.transparentBackground ? "#00000000" : options.background,
          width: options.width,
          height: options.height,
          displayValue: options.displayValue,
          textMargin: options.textMargin,
          fontSize: options.fontSize,
          margin: options.margin,
          font: "Open Sans, sans-serif", // Match body font
          valid: (valid: boolean) => {
            if (!valid) {
              setValidationMessage(dictionary.errorInvalidData);
               toast({ title: dictionary.errorInvalidData, variant: "destructive" });
            }
          },
        });
      }
    } catch (e: any) {
      console.error("Barcode generation error:", e);
      setValidationMessage(dictionary.errorGenerationFailed);
      toast({ title: dictionary.errorGenerationFailed, description: e.message, variant: "destructive" });
      // Clear the barcode preview on error
      if (barcodeRef.current) {
        if (options.format === 'qrcode' && barcodeRef.current instanceof HTMLCanvasElement) {
          const ctx = barcodeRef.current.getContext('2d');
          ctx?.clearRect(0, 0, barcodeRef.current.width, barcodeRef.current.height);
        } else if (barcodeRef.current instanceof SVGSVGElement) {
          barcodeRef.current.innerHTML = '';
        }
      }
    }
  }, [data, options, dictionary.errorInvalidData, dictionary.errorGenerationFailed, toast]);

  useEffect(() => {
    generateBarcode();
  }, [generateBarcode]);

  const handleOptionChange = (key: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDownload = (format: 'png' | 'jpeg' | 'svg') => {
    const barcodeElement = barcodeRef.current;
    if (!barcodeElement) return;

    const safeData = data.replace(/[^a-z0-9]/gi, '_').slice(0, 20) || "barcode";
    const filenameBase = dictionary.siteName.toLowerCase().replace(/\./g, '_');
    const filename = `${filenameBase}_${safeData}_${options.format}.${format}`;

    if (options.format === 'qrcode') {
        const canvas = barcodeElement as HTMLCanvasElement;
        if (format === 'svg') {
            // QR Code to SVG is more complex, typically libraries like qrcode-svg are used.
            // For simplicity, we'll note this limitation or use a workaround if available.
            QRCode.toString(data || " ", { 
                type: 'svg',
                errorCorrectionLevel: options.qrErrorCorrectionLevel,
                color: {
                    dark: options.lineColor,
                    light: options.transparentBackground ? "#00000000" : options.background,
                },
                margin: options.margin / 10,
             }, (err, svgString) => {
                if (err) {
                    toast({ title: "Error generating SVG", description: err.message, variant: "destructive"});
                    return;
                }
                const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
            return;
        }
        const url = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else { // JsBarcode (SVG)
        const svgElement = barcodeElement as SVGSVGElement;
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);

        // Add xmlns if missing
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        // Add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        if (format === 'svg') {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else { // PNG or JPEG from SVG
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Consider devicePixelRatio for sharper images
                const dpr = window.devicePixelRatio || 1;
                canvas.width = img.width * dpr;
                canvas.height = img.height * dpr;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.scale(dpr, dpr);
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL(`image/${format}`);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            img.src = url;
        }
    }
     toast({ title: "Téléchargement initié", description: `Fichier: ${filename}` });
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8">
      {/* Controls Column */}
      <Card className="md:col-span-1 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Zap className="mr-2 h-6 w-6 text-primary" />
            {dictionary.h1.split(" ").slice(0,3).join(" ")} {/* Shorten for card title */}
          </CardTitle>
          <CardDescription>{dictionary.introText.split(".").slice(0,1).join(".") + "."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Barcode Type */}
          <div>
            <Label htmlFor="barcodeType">{dictionary.barcodeTypeLabel}</Label>
            <Select
              value={options.format}
              onValueChange={(value) => handleOptionChange('format', value as BarcodeType)}
            >
              <SelectTrigger id="barcodeType">
                <SelectValue placeholder={dictionary.barcodeTypeLabel} />
              </SelectTrigger>
              <SelectContent>
                {barcodeTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentBarcodeTypeInfo && <p className="mt-1 text-xs text-muted-foreground">{currentBarcodeTypeInfo.description}</p>}
          </div>

          {/* Data Input */}
          <div>
            <Label htmlFor="dataInput">{dictionary.dataInputLabel}</Label>
            <Input
              id="dataInput"
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder={dictionary.dataInputPlaceholder}
              className="mt-1"
            />
             {dataInputHint && <p className="mt-1 text-xs text-muted-foreground">{dataInputHint}</p>}
             {validationMessage && <p className="mt-1 text-sm text-destructive">{validationMessage}</p>}
          </div>
          
          {/* Customization Section */}
          <Card className="bg-background/50">
             <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center"><Palette className="mr-2 h-5 w-5 text-accent"/>Apparence</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-2">
                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label htmlFor="lineColor">{dictionary.barcodeColorLabel}</Label>
                    <Input id="lineColor" type="color" value={options.lineColor} onChange={(e) => handleOptionChange('lineColor', e.target.value)} className="w-full h-10 p-1 mt-1" />
                    </div>
                    <div>
                    <Label htmlFor="backgroundColor">{dictionary.backgroundColorLabel}</Label>
                    <Input id="backgroundColor" type="color" value={options.background} onChange={(e) => handleOptionChange('background', e.target.value)} className="w-full h-10 p-1 mt-1" disabled={options.transparentBackground} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="transparentBackground" checked={options.transparentBackground} onCheckedChange={(checked) => handleOptionChange('transparentBackground', !!checked)} />
                    <Label htmlFor="transparentBackground" className="text-sm font-normal">{dictionary.transparentBackgroundLabel}</Label>
                </div>

                {/* Text Display */}
                {options.format !== 'qrcode' && (
                <div className="flex items-center space-x-2">
                    <Checkbox id="displayValue" checked={options.displayValue} onCheckedChange={(checked) => handleOptionChange('displayValue', !!checked)} />
                    <Label htmlFor="displayValue" className="text-sm font-normal">{dictionary.showDataTextLabel}</Label>
                </div>
                )}
             </CardContent>
          </Card>

         <Card className="bg-background/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center"><Text className="mr-2 h-5 w-5 text-accent"/>Dimensions & Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                 {/* Height & Width */}
                {options.format !== 'qrcode' ? (
                    <>
                    <div>
                        <Label htmlFor="barcodeHeight">{dictionary.barcodeHeightLabel} ({options.height}px)</Label>
                        <Slider id="barcodeHeight" min={20} max={200} step={1} value={[options.height]} onValueChange={([val]) => handleOptionChange('height', val)} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="moduleWidth">{dictionary.moduleWidthLabel} ({options.width}px)</Label>
                        <Slider id="moduleWidth" min={1} max={5} step={0.5} value={[options.width]} onValueChange={([val]) => handleOptionChange('width', val)} className="mt-1" />
                    </div>
                    </>
                ) : (
                     <div>
                        <Label htmlFor="qrCodeSize">Taille du QR Code ({options.width})</Label>
                        <Slider id="qrCodeSize" min={2} max={10} step={1} value={[options.width]} onValueChange={([val]) => handleOptionChange('width', val)} className="mt-1" />
                    </div>
                )}


                {/* QR Error Correction */}
                {options.format === 'qrcode' && (
                    <div>
                    <Label htmlFor="qrErrorCorrection">{dictionary.qrErrorCorrectionLabel}</Label>
                    <Select value={options.qrErrorCorrectionLevel} onValueChange={(value) => handleOptionChange('qrErrorCorrectionLevel', value as QRCode.QRCodeErrorCorrectionLevel)}>
                        <SelectTrigger id="qrErrorCorrection" className="mt-1">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {(Object.keys(dictionary.qrErrorCorrectionLevels) as Array<keyof typeof dictionary.qrErrorCorrectionLevels>).map(level => (
                            <SelectItem key={level} value={level}>{dictionary.qrErrorCorrectionLevels[level]}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                )}
            </CardContent>
         </Card>
        </CardContent>
      </Card>

      {/* Preview and Download Column */}
      <Card className="md:col-span-2 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
             <ImageIcon className="mr-2 h-6 w-6 text-primary" />
            {dictionary.previewLabel}
          </CardTitle>
          <CardDescription>Votre code-barres généré apparaîtra ici. Téléchargez-le dans votre format préféré.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px] bg-muted/30 p-6 rounded-lg">
          <div className="p-4 bg-white shadow-md rounded max-w-full overflow-x-auto" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {options.format === 'qrcode' ? (
              <canvas ref={el => barcodeRef.current = el} id="barcode-canvas" />
            ) : (
              // SVG will be appended here by JsBarcode
              <div ref={el => { if (el) barcodeRef.current = el.querySelector('svg') || el; }} id="barcode-svg-container" className="flex items-center justify-center">
                 {/* JsBarcode will inject SVG here, or use a placeholder if needed */}
                 {!data && <p className="text-muted-foreground">{dictionary.previewLoading}</p>}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => handleDownload('png')} variant="default">
              <Download className="mr-2 h-4 w-4" /> {dictionary.downloadPNG}
            </Button>
            <Button onClick={() => handleDownload('jpeg')} variant="secondary">
              <Download className="mr-2 h-4 w-4" /> {dictionary.downloadJPEG}
            </Button>
            <Button onClick={() => handleDownload('svg')} variant="outline">
              <Download className="mr-2 h-4 w-4" /> {dictionary.downloadSVG}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
