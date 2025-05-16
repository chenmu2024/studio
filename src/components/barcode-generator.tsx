
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
import { Download, Palette, Text, Zap, Image as ImageIcon } from 'lucide-react';
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
  
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const jsBarcodeSvgRef = useRef<SVGSVGElement | null>(null);
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
    setValidationMessage('');

    try {
      if (options.format === "qrcode") {
        if (!qrCanvasRef.current) return;
        const canvas = qrCanvasRef.current;
        QRCode.toCanvas(canvas, data || " ", { // Provide a space if data is empty to avoid error
          width: options.width * 50 > 100 ? options.width * 50 : 200, 
          errorCorrectionLevel: options.qrErrorCorrectionLevel,
          color: {
            dark: options.lineColor,
            light: options.transparentBackground ? "#00000000" : options.background,
          },
          margin: options.margin / 10, 
        }, (error) => {
          if (error) {
            console.error("QR Code generation error:", error);
            setValidationMessage(dictionary.errorGenerationFailed);
            toast({ title: dictionary.errorGenerationFailed, description: error.message, variant: "destructive" });
          }
        });
      } else {
        if (!jsBarcodeSvgRef.current) return;
        // JsBarcode modifies the SVG element in place, clearing previous content.
        JsBarcode(jsBarcodeSvgRef.current, data, {
          format: options.format.toUpperCase(),
          lineColor: options.lineColor,
          background: options.transparentBackground ? "#00000000" : options.background,
          width: options.width,
          height: options.height,
          displayValue: options.displayValue,
          textMargin: options.textMargin,
          fontSize: options.fontSize,
          margin: options.margin,
          font: "Open Sans, sans-serif",
          valid: (valid: boolean) => {
            if (!valid) {
              setValidationMessage(dictionary.errorInvalidData);
              // Do not toast here for invalid data, message is shown below input
            }
          },
        });
      }
    } catch (e: any) {
      console.error("Barcode generation error:", e);
      setValidationMessage(dictionary.errorGenerationFailed);
      toast({ title: dictionary.errorGenerationFailed, description: e.message, variant: "destructive" });
      // Clear the barcode preview on error by clearing the data, which will trigger re-render
       if (options.format === 'qrcode' && qrCanvasRef.current) {
          const ctx = qrCanvasRef.current.getContext('2d');
          ctx?.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height);
        } else if (jsBarcodeSvgRef.current) {
          jsBarcodeSvgRef.current.innerHTML = '';
        }
    }
  }, [data, options, dictionary, toast]);

  useEffect(() => {
    // If there's no data, don't attempt to generate.
    // The preview area will show "Enter data to preview" due to conditional rendering.
    if (!data) {
      setValidationMessage(''); // Clear any previous validation messages
       // Explicitly clear canvas/SVG if they exist from a previous render with data
      if (qrCanvasRef.current) {
        const ctx = qrCanvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height);
      }
      if (jsBarcodeSvgRef.current) {
        jsBarcodeSvgRef.current.innerHTML = '';
      }
      return;
    }
    generateBarcode();
  }, [data, generateBarcode]); // generateBarcode's own useCallback deps cover options, dictionary, toast

  const handleOptionChange = (key: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDownload = (format: 'png' | 'jpeg' | 'svg') => {
    const safeData = data.replace(/[^a-z0-9]/gi, '_').slice(0, 20) || "barcode";
    const filenameBase = dictionary.siteName.toLowerCase().replace(/\./g, '_');
    const filename = `${filenameBase}_${safeData}_${options.format}.${format}`;

    if (options.format === 'qrcode') {
        if (!qrCanvasRef.current && format !== 'svg') { // Need canvas for PNG/JPEG
            toast({ title: dictionary.errorGenerationFailed, description: "Canvas not available.", variant: "destructive"});
            return;
        }
        const canvas = qrCanvasRef.current;

        if (format === 'svg') {
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
                    toast({ title: dictionary.errorGenerationFailed, description: err.message, variant: "destructive"});
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
        } else if (canvas) { // PNG or JPEG from canvas
            const url = canvas.toDataURL(`image/${format}`);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } else { // JsBarcode (SVG)
        if (!jsBarcodeSvgRef.current) {
             toast({ title: dictionary.errorGenerationFailed, description: "SVG element not available.", variant: "destructive"});
            return;
        }
        const svgElement = jsBarcodeSvgRef.current;
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);

        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        const svgUrl = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        if (format === 'svg') {
            const link = document.createElement('a');
            link.href = svgUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else { // PNG or JPEG from SVG
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const dpr = window.devicePixelRatio || 1;
                // Ensure SVG has explicit width and height for canvas conversion
                const svgWidth = parseFloat(svgElement.getAttribute('width') || '0') || svgElement.getBoundingClientRect().width;
                const svgHeight = parseFloat(svgElement.getAttribute('height') || '0') || svgElement.getBoundingClientRect().height;
                
                if (svgWidth === 0 || svgHeight === 0) {
                  toast({ title: dictionary.errorGenerationFailed, description: "SVG dimensions are zero.", variant: "destructive"});
                  return;
                }

                canvas.width = svgWidth * dpr;
                canvas.height = svgHeight * dpr;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.scale(dpr, dpr);
                ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
                const dataUrl = canvas.toDataURL(`image/${format}`);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            img.onerror = () => {
                 toast({ title: dictionary.errorGenerationFailed, description: "Failed to load SVG into image for conversion.", variant: "destructive"});
            }
            img.src = svgUrl;
        }
    }
    toast({ title: dictionary.downloadInitiated, description: dictionary.downloadFile.replace('{filename}', filename) });
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8">
      {/* Controls Column */}
      <Card className="md:col-span-1 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Zap className="mr-2 h-6 w-6 text-primary" />
            {dictionary.h1.split(" ").slice(0,3).join(" ")}
          </CardTitle>
          <CardDescription>{dictionary.introText.split(".").slice(0,1).join(".") + "."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          
          <Card className="bg-background/50">
             <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center"><Palette className="mr-2 h-5 w-5 text-accent"/>{dictionary.appearanceLabel || "Apparence"}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-2">
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
                <CardTitle className="text-lg flex items-center"><Text className="mr-2 h-5 w-5 text-accent"/>{dictionary.dimensionsAndOptionsLabel || "Dimensions & Options"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
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
                        <Label htmlFor="qrCodeSize">{dictionary.qrCodeSizeLabel || "Taille du QR Code"} ({options.width})</Label>
                        <Slider id="qrCodeSize" min={2} max={10} step={1} value={[options.width]} onValueChange={([val]) => handleOptionChange('width', val)} className="mt-1" />
                    </div>
                )}

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
          <CardDescription>{dictionary.previewDescription || "Votre code-barres généré apparaîtra ici. Téléchargez-le dans votre format préféré."}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px] bg-muted/30 p-6 rounded-lg">
          <div className="p-4 bg-white shadow-md rounded max-w-full overflow-x-auto flex items-center justify-center" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!data ? (
              <p className="text-muted-foreground">{dictionary.enterDataToPreview}</p>
            ) : options.format === 'qrcode' ? (
              <canvas ref={qrCanvasRef} id="barcode-canvas-preview" />
            ) : (
              <svg ref={jsBarcodeSvgRef} id="barcode-svg-preview" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => handleDownload('png')} variant="default" disabled={!data}>
              <Download className="mr-2 h-4 w-4" /> {dictionary.downloadPNG}
            </Button>
            <Button onClick={() => handleDownload('jpeg')} variant="secondary" disabled={!data}>
              <Download className="mr-2 h-4 w-4" /> {dictionary.downloadJPEG}
            </Button>
            <Button onClick={() => handleDownload('svg')} variant="outline" disabled={!data}>
              <Download className="mr-2 h-4 w-4" /> {dictionary.downloadSVG}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
