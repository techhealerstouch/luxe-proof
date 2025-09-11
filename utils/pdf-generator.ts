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
      <div class="certificate">
        ${createHeader(watchData)}
        ${createMainContent(watchData)}
        ${createFooter(watchData)}
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
    padding: 1rem 2rem;
      flex-shrink: 0;
      justify-content: space-between;
       margin: 0 30px;
  }
  
  .meta-group {
    text-align: left;
  }
  
  .meta-label {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.25rem;
  }
  
  .meta-value {
    font-size: 14px;
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
   
    margin-bottom: 1rem;
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

const createMainContent = (watchData: WatchAuthentication): string => `
  <div class="report-meta">
        <div class="meta-group">
          <div class="meta-label">Serial Number</div>
          <div class="meta-value">${
            watchData.serial_and_model_number_cross_reference?.serial_number
          }</div>
        </div>
        <div class="meta-group">
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
         }</div>   </div>
        <div class="meta-group">
          <div class="meta-label">Status</div>
          <div class="meta-value">${watchData?.authenticity_verdict}
    </div>
        </div>
  </div>

  <div class="main-content">
    <div class="left-section">
      <div class="details-grid">
        <div class="detail-row">
          <div class="detail-label">Brand:</div>
          <div class="detail-value">${
            watchData.brand?.toUpperCase() || "ROLEX"
          }</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Model:</div>
          <div class="detail-value">${
            watchData.serial_and_model_number_cross_reference?.model_number ||
            "00001"
          }</div>
        </div>
     
        
        <div class="detail-row">
          <div class="detail-label">Fina Summary:</div>
          <div class="detail-value">
        ${watchData.final_summary || "Rolex Submariner Date"}
          </div>
        </div>
        
        <div class="info-section">
        <h4 style="margin:4px 0px;">Serial & Model Information</h4>
        
        <div class="detail-row">
            <div class="detail-label">Serial Number:</div>
            <div class="detail-value" id="serial_number">
                ${
                  watchData?.serial_and_model_number_cross_reference
                    ?.serial_number
                }
            </div>
        </div>
        
        <div class="detail-row">
            <div class="detail-label">Model Number:</div>
            <div class="detail-value" id="model_number">
                ${
                  watchData?.serial_and_model_number_cross_reference
                    ?.model_number
                }
            </div>
        </div>
        
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
        
        <div class="detail-row">
            <div class="detail-label">Serial Notes:</div>
            <div class="detail-value notes" id="serial_notes">
               ${watchData?.serial_and_model_number_cross_reference?.notes}
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
    
    <div class="detail-row">
        <div class="detail-label">Case Notes:</div>
        <div class="detail-value notes" id="case_notes">
           ${watchData?.case_bezel_and_crystal_analysis?.notes}
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
    
    <div class="detail-row">
        <div class="detail-label">Dial Notes:</div>
        <div class="detail-value notes" id="dial_notes">
           ${watchData?.dial_hands_and_date_scrutiny?.notes}
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
    
    <div class="detail-row">
        <div class="detail-label">Bracelet Notes:</div>
        <div class="detail-value notes" id="bracelet_notes">
           ${watchData?.bracelet_strap_and_clasp_inspection?.notes}
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
    
    <div class="detail-row">
        <div class="detail-label">Movement Notes:</div>
        <div class="detail-value notes" id="movement_notes">
           ${watchData?.movement_examination?.movement_notes}
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
        <div class="detail-label">Performance Notes:</div>
        <div class="detail-value notes" id="performance_notes">
           ${watchData?.performance_and_function_test?.notes}
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
