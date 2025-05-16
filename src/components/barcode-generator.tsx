
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download, Palette, Text, Zap, Image as ImageIcon, HelpCircle, ThumbsUp, MessageCircleQuestion, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BarcodeGeneratorProps = {
  dictionary: Dictionary;
};

type BarcodeType = "ean13" | "ean8" | "upca" | "upce" | "code128" | "code39" | "qrcode";

const initialBarcodeOptions = {
  format: "code128" as BarcodeType,
  lineColor: "#000000",
  background: "#ffffff",
  width: 2, // module width for 1D, or pixel size factor for QR
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
    { value: "upce", label: dictionary.barcodeTypes.upce, description: dictionary.barcodeTypes.upceDescription, validationKey: "upce" },
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
        const qrCanvasSize = Math.max(150, options.width * 25); 
        QRCode.toCanvas(canvas, data || " ", { // Use " " for empty data to avoid QR lib errors
          width: qrCanvasSize, 
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
        
        jsBarcodeSvgRef.current.innerHTML = ''; // Clear previous SVG content

        if (data.trim() === "") { // Prevent JsBarcode call with empty data for 1D
          return; 
        }

        const numericFormats: BarcodeType[] = ["ean13", "ean8", "upca", "upce"];
        if (numericFormats.includes(options.format)) {
          if (!/^\d+$/.test(data)) { // Ensure data is numeric and not empty
            setValidationMessage(dictionary.errorInvalidData);
            return;
          }
        }
        
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
          valid: (validStatus: boolean) => {
            if (!validStatus) {
              setValidationMessage(dictionary.errorInvalidData);
              if (jsBarcodeSvgRef.current) {
                jsBarcodeSvgRef.current.innerHTML = ''; // Clear SVG on invalid data
              }
            }
          },
        });
      }
    } catch (e: any) {
      if (jsBarcodeSvgRef.current && options.format !== 'qrcode') {
        jsBarcodeSvgRef.current.innerHTML = ''; // Ensure preview is cleared on any error for 1D
      } else if (qrCanvasRef.current && options.format === 'qrcode') {
        const ctx = qrCanvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height); // Clear QR canvas
      }

      if (e && typeof e.message === 'string' && e.message.includes("api.options(...)[options.format] is not a function")) {
        // This specific error from JsBarcode often means the data is fundamentally wrong for the format (e.g., wrong length for EAN)
        setValidationMessage(dictionary.errorInvalidData); 
        toast({ 
          title: dictionary.errorInvalidDataTitle, 
          description: dictionary.errorInvalidDataDescription.replace('{format}', options.format).replace('{data}', data.substring(0,30)), 
          variant: "destructive" 
        });
      } else {
        console.error("Barcode generation error:", e); 
        setValidationMessage(dictionary.errorGenerationFailed);
        toast({ title: dictionary.errorGenerationFailed, description: e.message, variant: "destructive" });
      }
    }
  }, [data, options, dictionary, toast]);

  useEffect(() => {
    // This effect will regenerate the barcode whenever data or relevant options change.
    // It also handles clearing the preview if data is empty.
    if (data.trim() === "") { 
      setValidationMessage(''); 
      if (qrCanvasRef.current && options.format === 'qrcode') {
        const ctx = qrCanvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height);
      }
      if (jsBarcodeSvgRef.current && options.format !== 'qrcode') {
        jsBarcodeSvgRef.current.innerHTML = '';
      }
      return; 
    }
    generateBarcode();
  }, [data, options, generateBarcode]); // Rerun when data or any option changes

  const handleFormatChange = (newFormat: BarcodeType) => {
    let newWidth = options.width;
    const isNewFormatQr = newFormat === 'qrcode';
    const isCurrentFormatQr = options.format === 'qrcode';

    if (isNewFormatQr && !isCurrentFormatQr) { // Switching from 1D to QR
      if (options.width < 2 || options.width > 10) { // If current 1D width is out of QR range
        newWidth = 4; // Default QR size
      }
    } else if (!isNewFormatQr && isCurrentFormatQr) { // Switching from QR to 1D
      if (options.width < 1 || options.width > 5) { // If current QR width is out of 1D range
        newWidth = 2; // Default 1D module width
      }
    }
    setOptions(prev => ({ ...prev, format: newFormat, width: newWidth }));
  };
  
  const handleOptionChange = (key: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDownload = (format: 'png' | 'jpeg' | 'svg') => {
    if (data.trim() === '' || validationMessage) {
        toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorInvalidDataForDownload, variant: "destructive"});
        return;
    }

    const safeData = data.replace(/[^a-z0-9]/gi, '_').slice(0, 20) || "barcode";
    const filenameBase = dictionary.siteName.toLowerCase().replace(/\./g, '_');
    const filename = `${filenameBase}_${safeData}_${options.format}.${format}`;

    if (options.format === 'qrcode') {
        if (!qrCanvasRef.current && format !== 'svg') { 
            toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorCanvasNotAvailable, variant: "destructive"});
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
                    toast({ title: dictionary.errorDownloadFailed, description: err.message, variant: "destructive"});
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
        } else if (canvas) { 
            // Check if canvas is blank (can happen if data is invalid for QR but not caught earlier)
            const blankCanvas = document.createElement('canvas');
            blankCanvas.width = canvas.width;
            blankCanvas.height = canvas.height;
            if (canvas.toDataURL() === blankCanvas.toDataURL()) { 
                 toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorQRCodePreviewEmpty, variant: "destructive"});
                 return;
            }
            const url = canvas.toDataURL(`image/${format}`);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } else { // For 1D barcodes (JsBarcode SVG)
        if (!jsBarcodeSvgRef.current?.childNodes.length && format !== 'svg') { 
             toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorSVGNotAvailable, variant: "destructive"});
            return;
        }
        const svgElement = jsBarcodeSvgRef.current;
        if (!svgElement) {
            toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorSVGNotAvailable, variant: "destructive"});
            return;
        }

        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);

        // Ensure xmlns attributes are present for proper rendering in some viewers/editors
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){ // though xlink might not be strictly needed by JsBarcode
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        const svgUrl = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        if (format === 'svg') {
            if (!svgElement.childNodes.length) { // Check if SVG is empty
                toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorSVGEmpty, variant: "destructive"});
                return;
            }
            const link = document.createElement('a');
            link.href = svgUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else { // For PNG/JPEG from SVG
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const dpr = window.devicePixelRatio || 1;
                
                // Attempt to get dimensions from SVG element attributes
                const svgWidthAttr = svgElement.getAttribute('width');
                const svgHeightAttr = svgElement.getAttribute('height');
                const viewBox = svgElement.getAttribute('viewBox');
                let svgWidth = parseFloat(svgWidthAttr || '0');
                let svgHeight = parseFloat(svgHeightAttr || '0');

                // If width/height attributes are missing or zero, try to use viewBox
                if ((!svgWidth || !svgHeight) && viewBox) {
                    const parts = viewBox.split(' ');
                    svgWidth = parseFloat(parts[2]);
                    svgHeight = parseFloat(parts[3]);
                }
                
                // Fallback if still no dimensions (e.g. style-defined dimensions)
                // This might be less accurate than direct attributes
                if (!svgWidth || !svgHeight) { 
                    const rect = svgElement.getBoundingClientRect();
                    svgWidth = rect.width;
                    svgHeight = rect.height;
                }

                // Ensure dimensions are valid before proceeding
                if (svgWidth === 0 || svgHeight === 0) {
                  toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorSVGDimensionsZero, variant: "destructive"});
                  return;
                }

                canvas.width = svgWidth * dpr;
                canvas.height = svgHeight * dpr;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorCanvasContext, variant: "destructive" });
                    return;
                }
                ctx.scale(dpr, dpr);
                ctx.drawImage(img, 0, 0, svgWidth, svgHeight); // Draw with original SVG dimensions
                const dataUrl = canvas.toDataURL(`image/${format}`);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            img.onerror = () => {
                 toast({ title: dictionary.errorDownloadFailed, description: dictionary.errorImageLoadFailed, variant: "destructive"});
            }
            img.src = svgUrl;
        }
    }
    if (!validationMessage) { // Only show success toast if no validation error was active
        toast({ title: dictionary.downloadInitiated, description: dictionary.downloadFile.replace('{filename}', filename) });
    }
  };


  return (
    <>
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
                onValueChange={(value) => handleFormatChange(value as BarcodeType)}
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
              {dataInputHint && !validationMessage && data.trim() !== '' && <p className="mt-1 text-xs text-muted-foreground">{dataInputHint}</p>}
            </div>
            
            <Card className="bg-background/50">
              <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center"><Palette className="mr-2 h-5 w-5 text-accent"/>{dictionary.appearanceLabel}</CardTitle>
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
                  <CardTitle className="text-lg flex items-center"><Text className="mr-2 h-5 w-5 text-accent"/>{dictionary.dimensionsAndOptionsLabel}</CardTitle>
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
                          <Label htmlFor="qrCodeSize">{dictionary.qrCodeSizeLabel} ({options.width})</Label>
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
            <CardDescription>{dictionary.previewDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px] bg-muted/30 p-6 rounded-lg">
            <div className="p-4 bg-white shadow-md rounded max-w-full overflow-x-auto flex items-center justify-center" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {data.trim() === '' ? (
                <p className="text-muted-foreground">{dictionary.enterDataToPreview}</p>
              ) : validationMessage ? (
                <p className="text-destructive">{validationMessage}</p>
              ) : options.format === 'qrcode' ? (
                <canvas ref={qrCanvasRef} id="barcode-canvas-preview" />
              ) : (
                <svg ref={jsBarcodeSvgRef} id="barcode-svg-preview" />
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => handleDownload('png')} variant="default" disabled={data.trim() === '' || !!validationMessage}>
                <Download className="mr-2 h-4 w-4" /> {dictionary.downloadPNG}
              </Button>
              <Button onClick={() => handleDownload('jpeg')} variant="secondary" disabled={data.trim() === '' || !!validationMessage}>
                <Download className="mr-2 h-4 w-4" /> {dictionary.downloadJPEG}
              </Button>
              <Button onClick={() => handleDownload('svg')} variant="outline" disabled={data.trim() === '' || !!validationMessage}>
                <Download className="mr-2 h-4 w-4" /> {dictionary.downloadSVG}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Use Section */}
      <section className="mt-12 p-4 md:p-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <HelpCircle className="mr-3 h-7 w-7 text-primary" />
              {dictionary.howToUseTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert space-y-4">
            {dictionary.howToUseIntro && <p>{dictionary.howToUseIntro}</p>}
            <ul className="list-disc pl-5 space-y-2">
              {dictionary.howToUseSteps.map((step, index) => (
                <li key={index}>
                  <h3 className="font-semibold text-lg mb-1 flex items-center">
                    <CheckCircle size={20} className="mr-2 text-green-500" />
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ul>
            {dictionary.howToUseOutro && <p>{dictionary.howToUseOutro}</p>}
          </CardContent>
        </Card>
      </section>

      {/* Why Choose Us Section */}
      <section className="mt-12 p-4 md:p-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <ThumbsUp className="mr-3 h-7 w-7 text-primary" />
              {dictionary.whyChooseUsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert space-y-4">
            {dictionary.whyChooseUsIntro && <p>{dictionary.whyChooseUsIntro}</p>}
            <div className="grid md:grid-cols-2 gap-6">
              {dictionary.whyChooseUsPoints.map((point, index) => (
                 <div key={index} className="p-4 border rounded-lg bg-background/30">
                    <h3 className="font-semibold text-lg mb-1 flex items-center">
                        <Zap size={20} className="mr-2 text-accent" />
                        {point.title}
                    </h3>
                    <p className="text-muted-foreground">{point.description}</p>
                 </div>
              ))}
            </div>
            {dictionary.whyChooseUsOutro && <p className="mt-4">{dictionary.whyChooseUsOutro}</p>}
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="mt-12 p-4 md:p-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <MessageCircleQuestion className="mr-3 h-7 w-7 text-primary" />
              {dictionary.faqTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dictionary.faqIntro && <p className="mb-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">{dictionary.faqIntro}</p>}
            <Accordion type="single" collapsible className="w-full">
              {dictionary.faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline text-base md:text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert text-muted-foreground">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {dictionary.faqOutro && <p className="mt-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">{dictionary.faqOutro}</p>}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
