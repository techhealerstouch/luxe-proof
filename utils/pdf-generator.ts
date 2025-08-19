// utils/pdf-generator.ts
import { WatchAuthentication } from "@/types/watch-authentication";

export const generateAuthenticationPDF = (
  watchData: WatchAuthentication
): void => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Could not open print window");
    return;
  }

  const htmlContent = createCertificateHTML(watchData);

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};

const createCertificateHTML = (watchData: WatchAuthentication): string => {
  const isAuthentic =
    watchData.authenticity_verdict?.toLowerCase() === "authentic" ||
    watchData.authenticity_verdict?.toLowerCase() === "genuine";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Watch Authentication Report</title>
      <style>
        ${getCertificateStyles(isAuthentic)}
      </style>
    </head>
    <body>
      <div class="certificate">
        ${createHeader()}
        ${createReportMeta(watchData)}
        ${createContentGrid(watchData)}
        ${createVerdictSection(watchData)}
        ${createCertification(watchData)}
      </div>
    </body>
    </html>
  `;
};

const getCertificateStyles = (isAuthentic: boolean): string => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Times, "Times New Roman", serif;
    line-height: 1.4;
    color: #000;
    background: white;
    padding: 1rem;
    font-size: 12px;
  }
  
  .certificate {
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    padding: 2rem;
  }
  
  .header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #000;
    padding-bottom: 1rem;
  }
  
  .company-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    letter-spacing: 2px;
  }
  
  .company-info {
    font-size: 10px;
    line-height: 1.3;
    margin-bottom: 1rem;
  }
  
  .report-title {
    font-size: 18px;
    font-weight: bold;
    margin: 1rem 0;
    letter-spacing: 1px;
  }
  
  .report-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    font-size: 11px;
    font-weight: bold;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .left-column {
    border-right: 1px solid #ccc;
    padding-right: 2rem;
  }
  
  .right-column {
    text-align: center;
  }
  
  .watch-image-placeholder {
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    margin: 0 auto 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #666;
    background: #f9f9f9;
  }
  
  .section-title {
    font-weight: bold;
    font-size: 12px;
    margin: 1rem 0 0.5rem 0;
    text-transform: uppercase;
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
  }
  
  .detail-row {
    display: flex;
    margin-bottom: 0.3rem;
    font-size: 11px;
  }
  
  .detail-label {
    font-weight: bold;
    width: 140px;
    flex-shrink: 0;
  }
  
  .detail-value {
    flex: 1;
  }
  
  .description {
    text-align: justify;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 11px;
  }
  
  .verdict-section {
    margin: 2rem 0;
    text-align: center;
    padding: 1rem;
    border: 2px solid #000;
  }
  
  .verdict-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 0.5rem;
  }
  
  .verdict-value {
    font-size: 16px;
    font-weight: bold;
    ${isAuthentic ? "color: #006600;" : "color: #cc0000;"}
  }
  
  .footer {
    margin-top: 3rem;
    text-align: center;
    border-top: 1px solid #000;
    padding-top: 1rem;
  }
  
  .certification {
    margin-top: 2rem;
    text-align: center;
  }
  
  .cert-seal {
    width: 80px;
    height: 80px;
    border: 3px solid #DAA520;
    border-radius: 50%;
    margin: 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFACD;
    font-size: 10px;
    font-weight: bold;
    color: #B8860B;
  }
  
  .appraiser-info {
    font-size: 11px;
    margin-top: 1rem;
  }
  
  .signature-line {
    border-bottom: 1px solid #000;
    width: 200px;
    margin: 2rem auto 0.5rem auto;
  }
  
  @media print {
    body { 
      padding: 0.5rem; 
    }
    .certificate { 
      padding: 1rem;
    }
  }
  
  @page {
    margin: 1cm;
    size: A4;
  }
`;

const createHeader = (): string => `
  <div class="header">
    <div class="company-name">WATCH AUTHENTICATION</div>
    <div class="company-info">
      Professional Watch Appraisal Services<br>
      Email: info@watchauth.com<br>
      Phone: (555) 123-4567<br>
      www.watchauthentication.com
    </div>
    <div class="report-title">WATCH AUTHENTICATION REPORT</div>
  </div>
`;

const createReportMeta = (watchData: WatchAuthentication): string => `
  <div class="report-meta">
    <div><strong>REPORT NUMBER:</strong> AUTH${watchData.id}</div>
    <div><strong>DATE:</strong> ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</div>
  </div>
`;

const createContentGrid = (watchData: WatchAuthentication): string => `
  <div class="content-grid">
    <div class="left-column">
      ${createDescription(watchData)}
      ${createSpecifications(watchData)}
    </div>
    <div class="right-column">
      <div class="watch-image-placeholder">
        Watch Image<br>
        ${watchData.name || "N/A"}
      </div>
    </div>
  </div>
`;

const createDescription = (watchData: WatchAuthentication): string => `
  <div class="section-title">Description</div>
  <div class="description">
    ${watchData.brand || "Unknown Brand"} ${watchData.name || "Watch"} with 
    ${
      watchData.serial_and_model_number_cross_reference?.model_number
        ? `model number ${watchData.serial_and_model_number_cross_reference.model_number}`
        : "unspecified model"
    }.
    ${
      watchData.estimated_production_year
        ? `Estimated production year: ${watchData.estimated_production_year}.`
        : ""
    }
    ${
      watchData.final_summary ||
      "Complete authentication analysis performed according to industry standards."
    }
  </div>
`;

const createSpecifications = (watchData: WatchAuthentication): string => `
  <div class="section-title">Specifications</div>
  
  <div class="detail-row">
    <span class="detail-label">BRAND:</span>
    <span class="detail-value">${watchData.brand || "N/A"}</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">MODEL:</span>
    <span class="detail-value">${watchData.name || "N/A"}</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">SERIAL NUMBER:</span>
    <span class="detail-value">${
      watchData.serial_and_model_number_cross_reference?.serial_number || "N/A"
    }</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">MODEL NUMBER:</span>
    <span class="detail-value">${
      watchData.serial_and_model_number_cross_reference?.model_number || "N/A"
    }</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">CASE MATERIAL:</span>
    <span class="detail-value">${
      watchData.case_bezel_and_crystal_analysis?.case_material_verified
        ? "Verified Authentic"
        : "Not Verified"
    }</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">CRYSTAL:</span>
    <span class="detail-value">${
      watchData.case_bezel_and_crystal_analysis?.crystal_type || "N/A"
    }</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">MOVEMENT:</span>
    <span class="detail-value">${
      watchData.movement_examination?.movement_caliber || "N/A"
    }</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">CONDITION:</span>
    <span class="detail-value">${
      watchData.performance_and_function_test?.time_setting_works
        ? "Excellent"
        : "Fair"
    }</span>
  </div>
  
  <div class="detail-row">
    <span class="detail-label">PRODUCTION YEAR:</span>
    <span class="detail-value">${
      watchData.estimated_production_year || "N/A"
    }</span>
  </div>
`;

const createVerdictSection = (watchData: WatchAuthentication): string => `
  <div class="verdict-section">
    <div class="verdict-title">AUTHENTICITY VERDICT</div>
    <div class="verdict-value">${
      watchData.authenticity_verdict?.toUpperCase() || "PENDING REVIEW"
    }</div>
  </div>
`;

const createCertification = (watchData: WatchAuthentication): string => `
  <div class="certification">
    <div class="cert-seal">
      CERTIFIED
    </div>
    <div class="signature-line"></div>
    <div class="appraiser-info">
      <strong>Certified Watchmaker</strong><br>
      Watch Authentication Specialist<br>
      License #WA-2024-001
    </div>
  </div>
  
  <div class="footer">
    This report represents the professional opinion of a certified watch authentication specialist.
    Report ID: AUTH${
      watchData.id
    } | Generated: ${new Date().toLocaleDateString()}
  </div>
`;
