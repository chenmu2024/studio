declare module 'jsbarcode' {
  function JsBarcode(
    element: Element | string | null, // Allow null for initial render if element is not yet available
    data: string,
    options?: JsBarcode.Options
  ): void;

  namespace JsBarcode {
    interface Options {
      format?: string; // e.g. "CODE128", "EAN13", "UPCA", "QRCODE" (though qrcode handled separately usually)
      width?: number; // Width of a single bar.
      height?: number; // Height of the barcode.
      displayValue?: boolean; // Display human-readable text below the barcode.
      text?: string; // Custom text to display.
      fontOptions?: string; // e.g., "bold italic".
      font?: string; // Font family.
      textAlign?: "left" | "center" | "right";
      textPosition?: "top" | "bottom";
      textMargin?: number;
      fontSize?: number;
      background?: string; // CSS color for background.
      lineColor?: string; // CSS color for bars.
      margin?: number; // Margin around the barcode.
      marginTop?: number;
      marginBottom?: number;
      marginLeft?: number;
      marginRight?: number;
      valid?: (validStatus: boolean) => void; // Callback function to validate data.
      flat?: boolean; // For EAN13/UPC to render a flat design (no guard bars extending down).
      // Add more options as needed based on JsBarcode documentation
      // Example:
      // For EAN type barcodes, you might have:
      // lastChar?: string; // For EAN-13, if you want to provide the check digit manually

      // For Code39:
      // wide?: number; // Ratio of wide bar to narrow bar width (default 3)
      // quiteZone?: number; // Size of quiet zones (default 10)
    }
  }
  export = JsBarcode;
}
