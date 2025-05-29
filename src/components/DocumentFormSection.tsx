import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import jsPDF from "jspdf";

const fileFields = [
  { name: "photo", label: "Photo" },
  { name: "pancard", label: "PAN Card" },
  { name: "aadharcard", label: "Aadhar Card" },
  { name: "passport", label: "Passport" },
  { name: "visa", label: "Visa" },
  { name: "cdc", label: "CDC" },
  { name: "rentagreement", label: "Rent Agreement" },
  { name: "salaryslip", label: "Salary Slip" },
  { name: "bankstatement", label: "Bank Statement" },
  { name: "form16", label: "Form 16" },
  { name: "itr", label: "ITR" },
  { name: "saleagreement", label: "Sale Agreement" },
  { name: "sharecertificate", label: "Share Certificate" },
  { name: "electricitybill", label: "Electricity Bill" },
  { name: "maintenancebill", label: "Maintenance Bill" },
  { name: "housetaxbill", label: "House Tax Bill" },
  { name: "noc", label: "NOC" },
  { name: "marraigecertificate", label: "Marriage Certificate" },
  { name: "birthcertificate", label: "Birth Certificate" },
  { name: "qualificationcertificate", label: "Qualification Certificate" },
];

const locations = ["Mumbai"];

const DocumentFormSection = ({
  handleChange,
  formData,
  setIsAgreed,
  isAgreed,
}) => {
  const [selectedDoc, setSelectedDoc] = useState("");
  const [customDocName, setCustomDocName] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const normalizeDocName = (name) => name.toLowerCase().replace(/\s+/g, "");

  // Load PDF.js library dynamically
  const loadPdfJs = async () => {
    // @ts-expect-error err
    if (window.pdfjsLib) return window.pdfjsLib;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        // @ts-expect-error err
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        // @ts-expect-error err
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Compress PDF file
  const compressPdf = async (file) => {
    try {
      // For PDFs, we'll use a simple approach to reduce file size
      // by creating a new PDF with reduced quality
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const newPdf = new jsPDF();
      const pageCount = pdf.numPages;
      
      // Process each page
      for (let i = 1; i <= Math.min(pageCount, 10); i++) { // Limit to first 10 pages
        const page = await pdf.getPage(i);
        const scale = 1.2; // Reduced scale for compression
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imgData = canvas.toDataURL("image/jpeg", 0.7); // Lower quality for compression
        
        if (i > 1) {
          newPdf.addPage();
        }
        
        const pageWidth = newPdf.internal.pageSize.getWidth();
        const pageHeight = newPdf.internal.pageSize.getHeight();
        
        // Calculate dimensions to fit page
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;
        
        newPdf.addImage(imgData, "JPEG", x, y, width, height);
      }
      
      // Convert to blob
      const pdfBlob = newPdf.output('blob');
      return pdfBlob;
    } catch (error) {
      console.error("Error compressing PDF:", error);
      // If compression fails, return original file with size check
      if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
        throw new Error("PDF file is too large. Please use a smaller file or compress it manually.");
      }
      return file;
    }
  };

  const handleFileChange = async (e) => {
    const { files } = e.target;
    const file = files[0];
    if (!file) return;

    // Validate custom document name if "other" is selected
    if (selectedDoc === "other" && !customDocName.trim()) {
      setError("Please enter a document name.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      let processedFile = file;
      let base64;

      // Handle PDF files differently
      if (file.type === "application/pdf") {
        // Compress PDF and convert to base64
        processedFile = await compressPdf(file);
        base64 = await convertToBase64(processedFile);
      } else {
        // For images, compress as before
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        processedFile = await imageCompression(file, options);
        base64 = await convertToBase64(processedFile);
      }

      let fieldName =
        selectedDoc === "other" ? normalizeDocName(customDocName) : selectedDoc;

      // Check for conflict with predefined fields
      if (
        selectedDoc === "other" &&
        fileFields.some((f) => f.name === fieldName)
      ) {
        fieldName = `${fieldName}_custom_${Date.now()}`; // Append unique suffix
      }

      // Store file info including type
      const fileData = {
        content: base64,
        type: file.type,
        name: file.name,
        size: processedFile.size
      };

      handleChange({ target: { name: fieldName, value: fileData } });
      
      if (selectedDoc === "other") {
        setCustomDocName("");
        setSelectedDoc("");
      }
    } catch (error) {
      console.error("Error processing file", error);
      setError(error.message || "Error processing file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const isImageField = (value) => {
    if (typeof value === "object" && value.content) {
      return value.type && value.type.startsWith("image/");
    }
    return (
      typeof value === "string" &&
      (value.startsWith("data:image") ||
        value.startsWith("http://") ||
        value.startsWith("https://"))
    );
  };

  const isPdfField = (value) => {
    if (typeof value === "object" && value.content) {
      return value.type === "application/pdf";
    }
    return false;
  };

  const downloadFile = (fileData, label) => {
    if (typeof fileData === "object" && fileData.content) {
      // Create download link
      const link = document.createElement('a');
      link.href = fileData.content;
      
      if (fileData.type === "application/pdf") {
        link.download = `${label.replace(/ /g, "_")}.pdf`;
      } else {
        link.download = `${label.replace(/ /g, "_")}.${fileData.type.split('/')[1]}`;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Legacy support for old image format
      downloadPDF(fileData, label);
    }
  };

  const downloadPDF = (imgUrl, label) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const padding = 15;
      const maxWidth = pageWidth - padding * 2;
      const maxHeight = pageHeight - 40 - padding * 2;

      const imgWidth = img.width;
      const imgHeight = img.height;

      // Maintain aspect ratio
      let renderWidth = maxWidth;
      let renderHeight = (imgHeight * maxWidth) / imgWidth;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = (imgWidth * maxHeight) / imgHeight;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = 30;

      pdf.addImage(img, "JPEG", x, y, renderWidth, renderHeight);
      pdf.save(`${label.replace(/ /g, "_")}.pdf`);
    };

    img.onerror = () => {
      console.error("Image loading failed:", imgUrl);
      alert("Failed to load image for download.");
    };
  };

  const DownloadIcon = ({ fileData, label }) => {
    return (
      <svg
        width={20}
        fill="#0F172A"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        onClick={() => downloadFile(fileData, label)}
        className="cursor-pointer hover:fill-blue-600"
      >
        <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM216 232l0 102.1 31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31L168 232c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
      </svg>
    );
  };

  const FilePreview = ({ value, label }) => {
    if (isImageField(value)) {
      const imgSrc = typeof value === "object" ? value.content : value;
      return (
        <img
          src={imgSrc}
          alt={label}
          className="w-32 h-32 object-cover border"
          onError={(e) =>
            console.error(`Failed to load image for ${label}:`, value)
          }
        />
      );
    } else if (isPdfField(value)) {
      return (
        <div className="w-32 h-32 border border-gray-300 bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <svg
              width={40}
              height={40}
              fill="#DC2626"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="mx-auto mb-2"
            >
              <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0z"/>
            </svg>
            <span className="text-xs text-red-600 font-medium">PDF</span>
            <div className="text-xs text-gray-500">
              {Math.round(value.size / 1024)}KB
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 bg-[#E9E5DA] p-4 rounded-lg">
      <h2 className="text-lg font-semibold">Upload Documents</h2>

      <div>
        <label className="block font-medium mb-1">Select Document Type</label>
        <select
          className="border p-2 w-full rounded"
          value={selectedDoc}
          onChange={(e) => {
            setSelectedDoc(e.target.value);
            setError("");
          }}
        >
          <option value="">-- Choose Document --</option>
          {fileFields.map(({ name, label }) => (
            <option key={name} value={name}>
              {formData[name] ? `✅ ${label}` : label}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
      </div>

      {selectedDoc === "other" && (
        <div>
          <label className="block font-medium mb-1">Enter Document Name</label>
          <input
            type="text"
            value={customDocName}
            onChange={(e) => {
              setCustomDocName(e.target.value);
              setError("");
            }}
            className="border p-2 w-full rounded"
            placeholder="Enter custom document name"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}

      {selectedDoc && (selectedDoc !== "other" || customDocName.trim()) && (
        <div>
          <label className="block font-medium mb-1">
            Upload{" "}
            {selectedDoc === "other"
              ? customDocName
              : fileFields.find((f) => f.name === selectedDoc)?.label}
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="border p-2 w-full"
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="mt-2 text-blue-600 text-sm flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing file...
            </div>
          )}
          {formData[selectedDoc] && selectedDoc !== "other" && (
            <div className="mt-2">
              <FilePreview 
                value={formData[selectedDoc]} 
                label={fileFields.find((f) => f.name === selectedDoc)?.label}
              />
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="font-medium">Uploaded Documents</h3>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {Object.entries(formData).map(([key, value]) => {
            if (value && (isImageField(value) || isPdfField(value))) {
              const label =
                fileFields.find((f) => f.name === key)?.label ||
                key.replace(/_custom_\d+$/, "");
              return (
                <div key={key}>
                  <div className="flex gap-2">
                    <FilePreview value={value} label={label} />
                    <DownloadIcon label={label} fileData={value} />
                  </div>
                  <p className="text-sm mt-1">{label}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="w-full flex gap-2 items-center">
        <label className="font-semibold" htmlFor="">
          Location:{" "}
        </label>
        <select className="w-full py-1" name="" id="">
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2">
        <input
          type="checkbox"
          id="declaration"
          checked={isAgreed}
          onChange={(e) => {
            setIsAgreed(e.target.checked);
            setError("");
          }}
          className="h-8 w-8 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
        />
        <label htmlFor="declaration" className="text-sm text-gray-700">
          <span className="text-base text-black font-semibold">
            Consent cum Terms & Conditions
          </span>{" "}
          I hereby consent to the Company's storage of my documents and
          information for the purpose of providing current and future services.
          I declare that all information provided herein is true and accurate.
        </label>
      </div>
    </div>
  );
};

export default DocumentFormSection;