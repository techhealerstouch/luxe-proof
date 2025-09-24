// utils/pdf-generator.ts
import { WatchAuthentication } from "@/types/watch-authentication";
// Note: Logo component should be rendered at the React component level before calling this function

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
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Luxe Proof Authentication Report</title>
      <style>
        ${getCertificateStyles()}
      </style>
    </head>
    <body>
      <div class="certificate page-1">
        ${createHeader(watchData)}
        ${createMainContent(watchData)}
        ${createFooter(watchData)}
      </div>
      <div class="certificate page-2">
        ${createPageHeader("Serial Information")}
        ${createSerialInformationContent(watchData)}
        ${createPageFooter("Serial Information - Page 2")}
      </div>
      <div class="certificate page-3">
        ${createPageHeader("Case, Bezel, and Crystal Analysis")}
        ${createCaseBezelCrystalContent(watchData)}
        ${createPageFooter("Case Analysis - Page 3")}
      </div>
      <div class="certificate page-4">
        ${createPageHeader("Dial, Hands, and Date Scrutiny")}
        ${createDialHandsDateContent(watchData)}
        ${createPageFooter("Dial Analysis - Page 4")}
      </div>
      <div class="certificate page-5">
        ${createPageHeader("Bracelet/Strap and Clasp Inspection")}
        ${createBraceletClaspContent(watchData)}
        ${createPageFooter("Bracelet Analysis - Page 5")}
      </div>
      <div class="certificate page-6">
        ${createPageHeader("Movement Examination")}
        ${createMovementContent(watchData)}
        ${createPageFooter("Movement Analysis - Page 6")}
      </div>
      <div class="certificate page-7">
        ${createPageHeader("Performance & Function Test")}
        ${createPerformanceContent(watchData)}
        ${createPageFooter("Performance Analysis - Page 7")}
      </div>
      <div class="certificate page-8">
        ${createPageHeader("Final Condition & Grading")}
        ${createFinalConditionContent(watchData)}
        ${createPageFooter("Final Report - Page 8")}
      </div>
    </body>
    </html>
  `;
};

const getCertificateStyles = (): string => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    background: white;
    padding: 0;
    color: #1f2937;
    font-size: 12px;
  }
  
  .certificate {
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    background: white;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    border: 2px solid #233252;
    margin:5px;
    overflow: hidden;
    page-break-after: always;
  }
  
  .certificate.page-2,
  .certificate.page-3,
  .certificate.page-4,
  .certificate.page-5,
  .certificate.page-6,
  .certificate.page-7,
  .certificate.page-8 {
    page-break-before: always;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    flex-shrink: 0;
  }
  
  .logo-container {
    width: 100px;
    height: 100px;
    margin-right: 2rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .shield-logo {
    width: 80px;
    height: 100px;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #d97706;
  }
  
  .shield-inner {
    width: 80%;
    height: 80%;
    background: rgba(217, 119, 6, 0.1);
    clip-path: polygon(50% 5%, 95% 25%, 95% 75%, 50% 95%, 5% 75%, 5% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    font-weight: 700;
  }
  
  .brand-title {
    flex: 1;
    text-align: left;
  }
  
  .brand-name {
    font-size: 56px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 4px;
  }
  
  .luxe {
    color: #1e3a8a;
  }
  
  .proof {
    color: #d97706;
  }
  
  .report-meta {
    display: flex;
    padding: 5px 2rem;
      flex-shrink: 0;
      justify-content: space-between;
       margin: 0 30px;
  }
  
  .meta-group {
    text-align: left;
  }
  
  .meta-label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
  }
  
  .meta-value {
    font-size: 12px;
    font-weight: 700;
    color: #1e2d4e;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    flex: 1;
    min-height: 0;
    margin: 0 30px;
    position:relative;
    overflow:hidden;
  }
  
  .left-section {
    padding: 1.5rem 2rem;
  }
  
  .right-section {
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .details-grid {
    display: grid;
    gap: 0.1rem;
    margin-bottom: 1.5rem;
  }
  
  .detail-row {
    display: grid;
    grid-template-columns: 180px 1fr;
    align-items: start;
    padding: 0.02rem 0;
  }
  
  .detail-label {
    font-size: 9px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .detail-value {
    font-size: 9px;
    font-weight: bold;
    color: #1e2d4e;
    line-height: 1.4;
  
  }
  
  .description-section {
    margin-top: 0.75rem;
  }
  
  .description-text {
    font-size: 11px;
    line-height: 1.5;
    color: #4b5563;
    text-align: justify;
  }
  
  .image-placeholder img{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
  .image-placeholder p {
    margin-bottom:10px;
  }
  
 
  .signature-line {
    width: 180px;
    height: 1px;
    background: #1f2937;
    margin: 0 auto 0.5rem auto;
  }
  
  .signature-title {
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }
  
  .signature-subtitle {
    font-size: 10px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
 
  .report-number {
    font-size: 12px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .report-date {
    font-size: 10px;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .assessment-label {
    font-size: 10px;
    font-weight: 600;
    color: #1f2937;
    text-transform: uppercase;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 60px 20px 60px;
    overflow:hidden;
  }
  .signature-section {
    text-align: center;}

  .footer-info {
    text-align: right;
  }
  .footer-icon{
    position: absolute;
    bottom:-150px;
    right:-160px;
     opacity:0.05;
    overflow:hidden;
  }
  
  /* Page header styles for pages 2-8 */
  .page-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #233252;
    margin: 0 30px;
    flex-shrink: 0;
  }
  
  .page-logo {
    height: 60px;
    flex-shrink: 0;
  }
  
  .page-title-container {
    flex: 1;
    text-align: center;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.25rem;
  }
  
  .page-subtitle {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  /* Content area styles for pages 2-8 */
  .page-content {
    flex: 1;
    padding: 2rem;
    margin: 0 30px;
  }
  .info-section {
    margin-bottom: 5px;
  }
  
  .info-section h4 {
    font-size: 12px;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  /* Enhanced detail rows for individual pages */
  .page-detail-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    align-items: start;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .page-detail-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .page-detail-value {
    font-size: 12px;
    font-weight: 500;
    color: #1e2d4e;
    line-height: 1.5;
  }
  
  .notes-section {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-left: 4px solid #d97706;
  }
  
  .notes-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }
  
  .notes-content {
    font-size: 11px;
    line-height: 1.6;
    color: #4b5563;
  }
  
  /* Narrative styles for pages 2-8 */
  .professional-narrative {
    font-family: 'Inter', sans-serif;
  }
  
  .narrative-paragraph {
    margin-bottom: 1.5rem;
  }
  
  .detailed-notes {
    border-radius: 6px;
  }
  
  .comprehensive-summary {
    border-radius: 6px;
  }
  
  .final-verdict {
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  @media print {
    body {
      padding: 0;
      margin: 0;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    .certificate {
      width: 210mm;
      height: 297mm;
      border: 3px solid #000;
      page-break-inside: avoid;
    }
    
    .shield-logo {
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
  }
  
  @page {
    margin: 0;
    size: A4;
  }
`;

const createHeader = (watchData: WatchAuthentication): string => `
  <div class="header">
        <img style="height:100px;" src="_next/static/media/logo.280af7fc.svg"/>
  </div>
`;

const createPageHeader = (title: string): string => `
  <div class="page-header">
    <img class="page-logo" src="_next/static/media/logo.280af7fc.svg"/>
  </div>
`;

const createMainContent = (watchData: WatchAuthentication): string => `
  <div class="report-meta" >
  <div class="meta-group" style="text-align: left;">
    <div class="meta-label">Customer</div>
    <div class="meta-value">${watchData.name}</div>
  </div>
  <div class="meta-group" style="text-align: center;">
    <div class="meta-label">Date Issued</div>
    <div class="meta-value">${
      watchData.created_at
        ? new Date(watchData.created_at)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toUpperCase()
        : "N/A"
    }</div>
  </div>
  <div class="meta-group" style="text-align: right;">
  <div class="meta-label">Status</div>
  <div class="meta-value" style="color: ${
    watchData?.authenticity_verdict?.toLowerCase().includes("genuine")
      ? "#16a34a"
      : watchData?.authenticity_verdict?.toLowerCase().includes("counterfeit")
      ? "#dc2626"
      : watchData?.authenticity_verdict
          ?.toLowerCase()
          .includes("genuine_with_aftermarket_parts")
      ? "#d97706"
      : "#6b7280"
  }; font-weight: 700;">${watchData?.authenticity_verdict}</div>
</div>
</div>

<div class="report-meta">
  <div class="meta-group" style="text-align: left;">
    <div class="meta-label">Model</div>
    <div class="meta-value">${watchData.model}</div>
  </div>
  <div class="meta-group" style="text-align: center;">
    <div class="meta-label">Reference Number</div>
    <div class="meta-value">${
      watchData.serial_and_model_number_cross_reference?.serial_number
    }</div>
  </div>
  <div class="meta-group" style="text-align: right;">
    <div class="meta-label">Serial Number</div>
    <div class="meta-value">${
      watchData.serial_and_model_number_cross_reference?.serial_number
    }</div>
  </div>
</div>
  <div class="main-content">
    <div class="left-section">
      <div class="details-grid">
        <div class="info-section">
        <h4 style="margin:4px 0px;">Serial & Model Information</h4>
        <div class="detail-row">
            <div class="detail-label">Serial Found Location:</div>
            <div class="detail-value" id="serial_found_location">
                ${
                  watchData?.serial_and_model_number_cross_reference
                    ?.serial_found_location
                }
            </div>
        </div>
        
        <div class="detail-row">
            <div class="detail-label">Matches Documents:</div>
            <div class="detail-value" id="matches_documents">
                ${
                  watchData?.serial_and_model_number_cross_reference
                    ?.matches_documents
                }
            </div>
        </div>
        
        <div class="detail-row">
            <div class="detail-label">Engraving Quality:</div>
            <div class="detail-value" id="engraving_quality">
               ${
                 watchData?.serial_and_model_number_cross_reference
                   ?.engraving_quality
               }
            </div>
        </div>
       
    </div>
<div class="info-section">
    <h4 style="margin:4px 0px;">Case, Bezel, and Crystal Analysis</h4>
    
    <div class="detail-row">
        <div class="detail-label">Case Material Verified:</div>
        <div class="detail-value" id="case_material_verified">
            ${
              watchData?.case_bezel_and_crystal_analysis?.case_material_verified
            }
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Case Weight Feel:</div>
        <div class="detail-value" id="case_weight_feel">
            ${watchData?.case_bezel_and_crystal_analysis?.case_weight_feel}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Finishing Transitions:</div>
        <div class="detail-value" id="finishing_transitions">
            ${watchData?.case_bezel_and_crystal_analysis?.finishing_transitions}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Bezel Action:</div>
        <div class="detail-value" id="bezel_action">
            ${watchData?.case_bezel_and_crystal_analysis?.bezel_action}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Crystal Type:</div>
        <div class="detail-value" id="crystal_type">
            ${watchData?.case_bezel_and_crystal_analysis?.crystal_type}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Laser Etched Crown:</div>
        <div class="detail-value" id="laser_etched_crown">
            ${watchData?.case_bezel_and_crystal_analysis?.laser_etched_crown}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Crown Logo Sharpness:</div>
        <div class="detail-value" id="crown_logo_sharpness">
            ${watchData?.case_bezel_and_crystal_analysis?.crown_logo_sharpness}
        </div>
    </div>
  
</div>


<div class="info-section">
    <h4 style="margin:4px 0px;">Dial, Hands, and Date Scrutiny</h4>
    
    <div class="detail-row">
        <div class="detail-label">Dial Text Quality:</div>
        <div class="detail-value" id="dial_text_quality">
            ${watchData?.dial_hands_and_date_scrutiny?.dial_text_quality}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Lume Application:</div>
        <div class="detail-value" id="lume_application">
            ${watchData?.dial_hands_and_date_scrutiny?.lume_application}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Cyclops Magnification:</div>
        <div class="detail-value" id="cyclops_magnification">
            ${watchData?.dial_hands_and_date_scrutiny?.cyclops_magnification}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Date Alignment:</div>
        <div class="detail-value" id="date_alignment">
            ${watchData?.dial_hands_and_date_scrutiny?.date_alignment}
        </div>
    </div>
    
</div>

<div class="info-section">
    <h4 style="margin:4px 0px;">Bracelet/Strap and Clasp Inspection</h4>
    
    <div class="detail-row">
        <div class="detail-label">Bracelet Link Type:</div>
        <div class="detail-value" id="bracelet_link_type">
            ${
              watchData?.bracelet_strap_and_clasp_inspection?.bracelet_link_type
            }
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Connection Type:</div>
        <div class="detail-value" id="connection_type">
            ${watchData?.bracelet_strap_and_clasp_inspection?.connection_type}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Clasp Action:</div>
        <div class="detail-value" id="clasp_action">
            ${watchData?.bracelet_strap_and_clasp_inspection?.clasp_action}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Micro Adjustment Functioning:</div>
        <div class="detail-value" id="micro_adjustment_functioning">
            ${
              watchData?.bracelet_strap_and_clasp_inspection
                ?.micro_adjustment_functioning
            }
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Clasp Engravings:</div>
        <div class="detail-value" id="clasp_engravings">
            ${watchData?.bracelet_strap_and_clasp_inspection?.clasp_engravings}
        </div>
    </div>
   
</div>


<div class="info-section">
    <h4 style="margin:4px 0px;">Movement Examination</h4>
    
    <div class="detail-row">
        <div class="detail-label">Movement Caliber:</div>
        <div class="detail-value" id="movement_caliber">
            ${watchData?.movement_examination?.movement_caliber}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Movement Engraving Quality:</div>
        <div class="detail-value" id="movement_engraving_quality">
            ${watchData?.movement_examination?.movement_engraving_quality}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Movement Other:</div>
        <div class="detail-value" id="movement_other">
            ${watchData?.movement_examination?.movement_notes}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Has Purple Reversing Wheels:</div>
        <div class="detail-value" id="has_purple_reversing_wheels">
            ${watchData?.movement_examination?.has_purple_reversing_wheels}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Has Blue Parachrom Hairspring:</div>
        <div class="detail-value" id="has_blue_parachrom_hairspring">
            ${watchData?.movement_examination?.has_blue_parachrom_hairspring}
        </div>
    </div>
    
</div>
<div class="info-section">
    <h4 style="margin:4px 0px;">Performance & Function Test</h4>
    
    <div class="detail-row">
        <div class="detail-label">Amplitude Degrees:</div>
        <div class="detail-value" id="amplitude_degrees">
            ${watchData?.performance_and_function_test?.amplitude_degrees}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Beat Error MS:</div>
        <div class="detail-value" id="beat_error_ms">
            ${watchData?.performance_and_function_test?.beat_error_ms}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Chronograph Works:</div>
        <div class="detail-value" id="chronograph_works">
            ${watchData?.performance_and_function_test?.chronograph_works}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Date Change Works:</div>
        <div class="detail-value" id="date_change_works">
            ${watchData?.performance_and_function_test?.date_change_works}
        </div>
    </div>
    
  
    <div class="detail-row">
        <div class="detail-label">Power Reserve Test Result:</div>
        <div class="detail-value" id="power_reserve_test_result">
            ${
              watchData?.performance_and_function_test
                ?.power_reserve_test_result
            }
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Rate Seconds Per Day:</div>
        <div class="detail-value" id="rate_seconds_per_day">
            ${watchData?.performance_and_function_test?.rate_seconds_per_day}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Time Setting Works:</div>
        <div class="detail-value" id="time_setting_works">
            ${watchData?.performance_and_function_test?.time_setting_works}
        </div>
    </div>
</div>
<div class="info-section">
   <h4 style="margin:4px 0px;">Final Condition & Grading</h4>
    
    <div class="detail-row">
        <div class="detail-label">Authenticity Verdict:</div>
        <div class="detail-value" id="authenticity_verdict">
            ${watchData?.authenticity_verdict}
        </div>
    </div>
    
    <div class="detail-row">
        <div class="detail-label">Final Summary:</div>
        <div class="detail-value notes" id="final_summary">
           ${watchData?.final_summary}
        </div>
    </div>
    <div class="detail-row">
        <div class="detail-label">Estimated Production Year:</div>
        <div class="detail-value" id="estimated_production_year">
            ${watchData?.estimated_production_year}
        </div>
    </div>
</div>
      </div>
    </div>
    
    <div class="right-section">

   
    <div class="image-placeholder">
    <div style={{ textAlign: 'center' }}>
      <p style="text-align:center;">Front View</p>
      <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.provenance_documentation_audit?.watch_image_front_path}`}
        alt="Watch front view"
      />
      </div>
    </div>

        <div class="image-placeholder">
    <div style={{ textAlign: 'center' }}>
       <p style="text-align:center;">Back View</p>

      <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.provenance_documentation_audit?.watch_image_back_path}`}
        alt="Watch back view"
      />
      </div>
    </div>
        <div class="image-placeholder">
    <div style={{ textAlign: 'center' }}>
           <p style="text-align:center;">Side View</p>

      <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.provenance_documentation_audit?.watch_image_side_path}`}
        alt="Watch side view"
      />
      </div>
    </div>
    </div>
  </div>
`;

const createFooter = (watchData: WatchAuthentication): string => `
  <div class="footer">
    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-title">Master Watchmaker</div>
      <div class="signature-subtitle">CWA License #2025-001</div>
    </div>
    <div class="footer-info">
      <img class="footer-icon" style="height:500px;" src="_next/static/media/icon.e4d18100.svg"/>
      <div class="report-number">AUTH-00005053</div>
      <div class="report-date">08/8/2025</div>
      <div class="assessment-label">Professional Assessment</div>
    </div>
  </div>
`;

const createPageFooter = (pageLabel: string): string => `
  <div class="footer">
    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-title">Master Watchmaker</div>
      <div class="signature-subtitle">CWA License #2025-001</div>
    </div>
    <div class="footer-info">
      <img class="footer-icon" style="height:500px;" src="_next/static/media/icon.e4d18100.svg"/>
      <div class="report-number">AUTH-00005053</div>
      <div class="report-date">08/8/2025</div>
      <div class="assessment-label">${pageLabel}</div>
    </div>
  </div>
`;

// Page 2: Serial Information
const createSerialInformationContent = (
  watchData: WatchAuthentication
): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">SERIAL & MODEL CROSS REFERENCE ANALYSIS</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          The timepiece under examination bears the serial number <strong>${
            watchData?.serial_and_model_number_cross_reference?.serial_number ||
            "N/A"
          }</strong>, which corresponds to model number <strong>${
  watchData?.serial_and_model_number_cross_reference?.model_number || "N/A"
}</strong>. This serial identifier was located at <strong>${
  watchData?.serial_and_model_number_cross_reference?.serial_found_location ||
  "the standard position"
}</strong>, demonstrating proper placement consistent with authentic manufacturing protocols. The engraving quality exhibits <strong>${
  watchData?.serial_and_model_number_cross_reference?.engraving_quality ||
  "standard"
}</strong> characteristics, which aligns with expected production standards for this model line.
        </p>
      </div>

      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Documentation verification reveals that the serial number <strong>${
            watchData?.serial_and_model_number_cross_reference
              ?.matches_documents || "requires verification"
          }</strong> with the provided authentication documents. This cross-reference check is crucial for establishing the timepiece's provenance and manufacturing authenticity. The serial number's format, depth of engraving, and positioning all contribute to the overall authentication assessment, providing critical data points for determining the watch's legitimacy within the manufacturer's production records.
        </p>
      </div>

      ${
        watchData?.serial_and_model_number_cross_reference?.notes
          ? `
        <div class="detailed-notes" style="background: #fef3c7; padding: 1.5rem; border-left: 4px solid #f59e0b; margin-top: 2rem;">
          <h4 style="color: #92400e; margin-bottom: 1rem; font-size: 14px;">DETAILED SERIAL ANALYSIS NOTES</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #78350f; text-align: justify;">
            ${watchData.serial_and_model_number_cross_reference.notes}
          </p>
        </div>
      `
          : ""
      }
    </div>
    <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.serial_and_model_number_cross_reference?.watch_serial_info_image_path}`}
      />
  </div>
`;

// Page 3: Case, Bezel, and Crystal Analysis
const createCaseBezelCrystalContent = (
  watchData: WatchAuthentication
): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">CASE, BEZEL & CRYSTAL CONSTRUCTION ANALYSIS</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          The case construction has been meticulously examined, with material verification confirming <strong>${
            watchData?.case_bezel_and_crystal_analysis
              ?.case_material_verified || "standard specifications"
          }</strong>. The overall weight characteristics present a <strong>${
  watchData?.case_bezel_and_crystal_analysis?.case_weight_feel || "typical"
}</strong> sensation when handled, which aligns with authentic manufacturing densities. Finishing transitions demonstrate <strong>${
  watchData?.case_bezel_and_crystal_analysis?.finishing_transitions ||
  "standard"
}</strong> quality, indicating proper machining and polishing techniques consistent with factory production standards.
        </p>
      </div>

      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Bezel functionality exhibits <strong>${
            watchData?.case_bezel_and_crystal_analysis?.bezel_action ||
            "appropriate"
          }</strong> operation characteristics, with rotation mechanics functioning within expected parameters. The crystal assembly is confirmed as <strong>${
  watchData?.case_bezel_and_crystal_analysis?.crystal_type || "sapphire glass"
}</strong> construction, providing optimal clarity and scratch resistance. Laser etching of the crown logo is <strong>${
  watchData?.case_bezel_and_crystal_analysis?.laser_etched_crown || "present"
}</strong>, demonstrating <strong>${
  watchData?.case_bezel_and_crystal_analysis?.crown_logo_sharpness || "adequate"
}</strong> definition and precision typical of authentic production methods.
        </p>
      </div>

      ${
        watchData?.case_bezel_and_crystal_analysis?.notes
          ? `
        <div class="detailed-notes" style="background: #e0f2fe; padding: 1.5rem; border-left: 4px solid #0288d1; margin-top: 2rem;">
          <h4 style="color: #01579b; margin-bottom: 1rem; font-size: 14px;">DETAILED CASE CONSTRUCTION NOTES</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #0277bd; text-align: justify;">
            ${watchData.case_bezel_and_crystal_analysis.notes}
          </p>
        </div>
      `
          : ""
      }
      
    </div>
    <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.case_bezel_and_crystal_analysis?.watch_product_case_analysis_image_path}`}
      />
  </div>
`;

// Page 4: Dial, Hands, and Date Scrutiny
const createDialHandsDateContent = (watchData: WatchAuthentication): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">DIAL, HANDS & DATE MECHANISM ANALYSIS</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          The dial examination reveals <strong>${
            watchData?.dial_hands_and_date_scrutiny?.dial_text_quality ||
            "standard"
          }</strong> text quality, with printing characteristics that demonstrate proper ink density and character definition. Luminous material application exhibits <strong>${
  watchData?.dial_hands_and_date_scrutiny?.lume_application || "typical"
}</strong> distribution patterns, indicating consistent manufacturing processes. The luminous compound's color consistency, edge definition, and overall application quality align with authentic production standards, providing both functional visibility and aesthetic authenticity.
        </p>
      </div>

      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Date display functionality demonstrates <strong>${
            watchData?.dial_hands_and_date_scrutiny?.cyclops_magnification ||
            "appropriate"
          }</strong> cyclops magnification properties, with optical clarity and distortion characteristics consistent with genuine crystal assemblies. The date wheel alignment shows <strong>${
  watchData?.dial_hands_and_date_scrutiny?.date_alignment || "proper"
}</strong> positioning within the aperture window. This precise alignment, combined with the cyclops lens performance, indicates proper assembly tolerances and quality control measures throughout the manufacturing process.
        </p>
      </div>

      ${
        watchData?.dial_hands_and_date_scrutiny?.notes
          ? `
        <div class="detailed-notes" style="background: #f0fdf4; padding: 1.5rem; border-left: 4px solid #16a34a; margin-top: 2rem;">
          <h4 style="color: #15803d; margin-bottom: 1rem; font-size: 14px;">DETAILED DIAL ANALYSIS NOTES</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #166534; text-align: justify;">
            ${watchData.dial_hands_and_date_scrutiny.notes}
          </p>
        </div>
      `
          : ""
      }
    </div>
    <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.dial_hands_and_date_scrutiny?.watch_product_dial_analysis_image_path}`}
      />
  </div>
`;

// Page 5: Bracelet/Strap and Clasp Inspection
const createBraceletClaspContent = (watchData: WatchAuthentication): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">BRACELET & CLASP MECHANISM ANALYSIS</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          The bracelet construction features <strong>${
            watchData?.bracelet_strap_and_clasp_inspection
              ?.bracelet_link_type || "standard"
          }</strong> link architecture, utilizing <strong>${
  watchData?.bracelet_strap_and_clasp_inspection?.connection_type ||
  "traditional"
}</strong> connection methodology between individual segments. This construction approach demonstrates manufacturing consistency with authentic production specifications. The link finishing, dimensional accuracy, and material density all contribute to the overall assessment of bracelet authenticity and manufacturing origin.
        </p>
      </div>

      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Clasp mechanism evaluation reveals <strong>${
            watchData?.bracelet_strap_and_clasp_inspection?.clasp_action ||
            "proper"
          }</strong> operational characteristics, with spring tension and engagement tolerances within expected parameters. The micro-adjustment system demonstrates <strong>${
  watchData?.bracelet_strap_and_clasp_inspection
    ?.micro_adjustment_functioning || "appropriate"
}</strong> functionality, providing incremental sizing capabilities. Engraving quality on clasp components exhibits <strong>${
  watchData?.bracelet_strap_and_clasp_inspection?.clasp_engravings || "standard"
}</strong> definition, indicating proper manufacturing techniques and quality control measures.
        </p>

        
      </div>

      ${
        watchData?.bracelet_strap_and_clasp_inspection?.notes
          ? `
        <div class="detailed-notes" style="background: #fdf4ff; padding: 1.5rem; border-left: 4px solid #a855f7; margin-top: 2rem;">
          <h4 style="color: #7c3aed; margin-bottom: 1rem; font-size: 14px;">DETAILED BRACELET ANALYSIS NOTES</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #6b21a8; text-align: justify;">
            ${watchData.bracelet_strap_and_clasp_inspection.notes}
          </p>
        </div>
      `
          : ""
      }
    </div>
     <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.bracelet_strap_and_clasp_inspection?.watch_product_bracelet_analysis_image_path}`}
        alt="Watch side view"
      />
  </div>
`;

// Page 6: Movement Examination
const createMovementContent = (watchData: WatchAuthentication): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">MOVEMENT TECHNICAL EXAMINATION</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          The mechanical movement houses caliber <strong>${
            watchData?.movement_examination?.movement_caliber || "N/A"
          }</strong>, with engraving quality demonstrating <strong>${
  watchData?.movement_examination?.movement_engraving_quality || "standard"
}</strong> characteristics throughout the visible components. The movement architecture displays proper component layout and finishing techniques consistent with authentic manufacturing processes. Rotor decoration, bridge finishing, and screw head quality all contribute to the comprehensive movement authentication assessment.
        </p>
      </div>

      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Technical specifications reveal that purple reversing wheels are <strong>${
            watchData?.movement_examination?.has_purple_reversing_wheels ||
            "not present"
          }</strong>, while the blue Parachrom hairspring is <strong>${
  watchData?.movement_examination?.has_blue_parachrom_hairspring ||
  "not confirmed"
}</strong>. These distinctive technical features serve as critical authentication markers, as their presence or absence directly correlates with specific production periods and caliber variations. The combination of these technical elements provides definitive evidence regarding the movement's authenticity and manufacturing origin.
        </p>
      </div>

      ${
        watchData?.movement_examination?.movement_notes
          ? `
        <div class="detailed-notes" style="background: #f3e5f5; padding: 1.5rem; border-left: 4px solid #7b1fa2; margin-top: 2rem;">
          <h4 style="color: #4a148c; margin-bottom: 1rem; font-size: 14px;">DETAILED MOVEMENT ANALYSIS NOTES</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #6a1b9a; text-align: justify;">
            ${watchData.movement_examination.movement_notes}
          </p>
        </div>
      `
          : ""
      }
    </div>
      <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.movement_examination?.watch_movement_analysis_image_path}`}
        alt="Watch side view"
      />
  </div>
`;

// Page 7: Performance & Function Test
const createPerformanceContent = (watchData: WatchAuthentication): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">PERFORMANCE & FUNCTION VERIFICATION</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Precision timing analysis reveals an amplitude measurement of <strong>${
            watchData?.performance_and_function_test?.amplitude_degrees || "N/A"
          }</strong> degrees, with beat error registering <strong>${
  watchData?.performance_and_function_test?.beat_error_ms || "N/A"
}</strong> milliseconds. The daily rate accuracy demonstrates <strong>${
  watchData?.performance_and_function_test?.rate_seconds_per_day || "N/A"
}</strong> seconds per day deviation. These technical measurements provide quantitative assessment of the movement's regulatory performance and overall mechanical condition.
        </p>
      </div>

      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Functional testing confirms that power reserve performance indicates <strong>${
            watchData?.performance_and_function_test
              ?.power_reserve_test_result || "standard duration"
          }</strong>. Chronograph functionality is <strong>${
  watchData?.performance_and_function_test?.chronograph_works ||
  "not applicable"
}</strong>, while date change mechanism operates <strong>${
  watchData?.performance_and_function_test?.date_change_works || "properly"
}</strong>. Time setting functions demonstrate <strong>${
  watchData?.performance_and_function_test?.time_setting_works || "normal"
}</strong> operation. These comprehensive functional assessments verify the movement's operational integrity and manufacturing quality.
        </p>
      </div>

      ${
        watchData?.performance_and_function_test?.notes
          ? `
        <div class="detailed-notes" style="background: #fef2f2; padding: 1.5rem; border-left: 4px solid #ef4444; margin-top: 2rem;">
          <h4 style="color: #dc2626; margin-bottom: 1rem; font-size: 14px;">DETAILED PERFORMANCE ANALYSIS NOTES</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #991b1b; text-align: justify;">
            ${watchData.performance_and_function_test.notes}
          </p>
        </div>
      `
          : ""
      }
    </div>
      <img 
        style="width: 240px; height: 240px; object-fit: cover;"
        src=${`http://localhost:8000/storage/${watchData?.performance_and_function_test?.watch_performance_tests_image_path}`}
        alt="Watch side view"
      />
  </div>
`;

// Page 8: Final Condition & Grading
const createFinalConditionContent = (
  watchData: WatchAuthentication
): string => `
  <div class="page-content">
    <div class="professional-narrative">
      <h3 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 18px; border-bottom: 2px solid #d97706; padding-bottom: 0.5rem;">FINAL AUTHENTICATION ASSESSMENT</h3>
      
      <div class="narrative-paragraph" style="margin-bottom: 1.5rem;">
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #1f2937;">
          Based on comprehensive multi-point analysis encompassing serial verification, case construction, dial examination, bracelet assessment, movement inspection, and performance testing, the authenticity determination for this <strong>${
            watchData?.brand?.toUpperCase() || "TIMEPIECE"
          }</strong> is conclusively established as <strong>${
  watchData?.authenticity_verdict || "PENDING VERIFICATION"
}</strong>. The estimated production year is determined to be <strong>${
  watchData?.estimated_production_year || "requiring further analysis"
}</strong>, based on serial number correlation and technical specification matching.
        </p>
      </div>

      <div class="final-verdict" style="text-align: center; padding: 2rem; background: ${
        watchData?.authenticity_verdict?.toLowerCase().includes("authentic")
          ? "#f0f9ff"
          : "#fef2f2"
      }; border: 2px solid ${
  watchData?.authenticity_verdict?.toLowerCase().includes("authentic")
    ? "#3b82f6"
    : "#ef4444"
}; border-radius: 8px; margin: 2rem 0;">
        <div style="font-size: 28px; font-weight: 700; color: ${
          watchData?.authenticity_verdict?.toLowerCase().includes("authentic")
            ? "#1e3a8a"
            : "#dc2626"
        }; margin-bottom: 0.5rem;">
          ${watchData?.authenticity_verdict || "VERIFICATION PENDING"}
        </div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">
          OFFICIAL AUTHENTICATION STATUS
        </div>
      </div>

      ${
        watchData?.final_summary
          ? `
        <div class="comprehensive-summary" style="background: #f8fafc; padding: 1.5rem; border-left: 4px solid #d97706; margin-top: 2rem;">
          <h4 style="color: #1e3a8a; margin-bottom: 1rem; font-size: 14px;">COMPREHENSIVE FINAL SUMMARY</h4>
          <p style="font-size: 11px; line-height: 1.5; color: #1f2937; text-align: justify;">
            ${watchData.final_summary}
          </p>
        </div>
      `
          : ""
      }
    </div>
  </div>
`;
