// components/watch-details/detail-sections.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image } from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";

// Helper function to get file icon based on file path
const getFileIcon = (filePath: string | null) => {
  if (!filePath) return <FileText className="h-4 w-4" />;

  const extension = filePath.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
    return <Image className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
};

interface DocumentDownloadButtonProps {
  filePath: string | null;
  label: string;
  baseUrl?: string;
}

const DocumentDownloadButton: React.FC<DocumentDownloadButtonProps> = ({
  filePath,
  label,
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
}) => {
  if (!filePath) {
    return (
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Badge variant="secondary" className="text-xs">
          Not Available
        </Badge>
      </div>
    );
  }

  // Use API route for download instead of direct storage access
  const fullUrl = `${baseUrl}/download/${filePath}`;
  const filename =
    filePath.split("/").pop() || label.toLowerCase().replace(/\s+/g, "_");

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob with proper content type
      const contentType =
        response.headers.get("content-type") || "application/octet-stream";
      const blob = await response.blob();
      // Create blob with correct MIME type
      const properBlob = new Blob([blob], { type: contentType });

      const downloadUrl = window.URL.createObjectURL(properBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup after download
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      alert(
        `Download failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDownload}
        className="mt-1 h-8 px-3"
      >
        {getFileIcon(filePath)}
        <span className="ml-2">Download</span>
        <Download className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string | number | boolean | null | undefined;
  type?: "text" | "boolean" | "number";
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  type = "text",
}) => {
  const formatValue = () => {
    if (value === null || value === undefined) return "N/A";

    switch (type) {
      case "boolean":
        return value ? "Yes" : "No";
      case "number":
        return value.toString();
      default:
        return value.toString();
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={type === "number" ? "text-lg font-mono" : ""}>
        {formatValue()}
      </p>
    </div>
  );
};

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  children,
  className = "",
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </CardContent>
  </Card>
);

interface BasicInfoSectionProps {
  watchData: WatchAuthentication;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  watchData,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>{watchData.name}</span>
        <Badge
          className={
            watchData.authenticity_verdict?.toLowerCase() === "authentic" ||
            watchData.authenticity_verdict?.toLowerCase() === "genuine"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }
        >
          {watchData.authenticity_verdict || "Pending"}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Brand" value={watchData.brand} />
        <DetailItem
          label="Production Year"
          value={watchData.estimated_production_year}
        />

        <DetailItem label="Phone" value={watchData.phone} />
        <DetailItem label="Email" value={watchData.email} />
        <DetailItem label="Date of Sale" value={watchData.date_of_sale} />
        <DetailItem
          label="Preffered Contact Method"
          value={watchData.contact_method}
        />
        <DetailItem label="Company Name" value={watchData.company_name} />
        <DetailItem label="Company Address" value={watchData.company_address} />

        <DetailItem label="Final Summary" value={watchData.final_summary} />
      </div>
    </CardContent>
  </Card>
);

export const SerialInfoSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const serialInfo = watchData.serial_and_model_number_cross_reference;

  if (!serialInfo) return null;

  return (
    <DetailSection title="Serial & Model Information">
      <DocumentDownloadButton
        filePath={serialInfo.watch_serial_info_image_path}
        label="Image Serial number"
      />
      <DetailItem label="Serial Number" value={serialInfo.serial_number} />
      <DetailItem label="Model Number" value={serialInfo.model_number} />
      <DetailItem
        label="Serial Found Location"
        value={serialInfo.serial_found_location}
      />
      <DetailItem
        label="Matches Documents"
        value={serialInfo.matches_documents}
        type="boolean"
      />
      <DetailItem
        label="Engraving Quality"
        value={serialInfo.engraving_quality}
      />
      {serialInfo.notes && (
        <div className="col-span-2">
          <DetailItem label="Notes" value={serialInfo.notes} />
        </div>
      )}
    </DetailSection>
  );
};

export const CaseAnalysisSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const caseAnalysis = watchData.case_bezel_and_crystal_analysis;

  if (!caseAnalysis) return null;

  return (
    <DetailSection title="Case, Bezel & Crystal Analysis">
      <DocumentDownloadButton
        filePath={caseAnalysis.watch_product_case_analysis_image_path}
        label="Image Case,Bezel and Crystal"
      />
      <DetailItem
        label="Material Verified"
        value={caseAnalysis.case_material_verified}
        type="boolean"
      />
      <DetailItem label="Weight & Feel" value={caseAnalysis.case_weight_feel} />
      <DetailItem
        label="Finishing Transitions"
        value={caseAnalysis.finishing_transitions}
      />
      <DetailItem label="Bezel Action" value={caseAnalysis.bezel_action} />
      <DetailItem label="Crystal Type" value={caseAnalysis.crystal_type} />
      <DetailItem
        label="Laser Etched Crown"
        value={caseAnalysis.laser_etched_crown}
        type="boolean"
      />
      <DetailItem
        label="Crown Logo Sharpness"
        value={caseAnalysis.crown_logo_sharpness}
      />
      {caseAnalysis.notes && (
        <div className="col-span-2">
          <DetailItem label="Notes" value={caseAnalysis.notes} />
        </div>
      )}
    </DetailSection>
  );
};

export const DialAnalysisSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const dialAnalysis = watchData.dial_hands_and_date_scrutiny;

  if (!dialAnalysis) return null;

  return (
    <DetailSection title="Dial, Hands & Date Scrutiny">
      <DocumentDownloadButton
        filePath={dialAnalysis.watch_product_dial_analysis_image_path}
        label="Image Case,Bezel and Crystal"
      />
      <DetailItem label="Text Quality" value={dialAnalysis.dial_text_quality} />
      <DetailItem
        label="Lume Application"
        value={dialAnalysis.lume_application}
      />
      <DetailItem
        label="Cyclops Magnification"
        value={dialAnalysis.cyclops_magnification}
      />
      <DetailItem
        label="Date Alignment"
        value={dialAnalysis.date_alignment}
        type="boolean"
      />
      {dialAnalysis.notes && (
        <div className="col-span-2">
          <DetailItem label="Notes" value={dialAnalysis.notes} />
        </div>
      )}
    </DetailSection>
  );
};

export const BraceletAnalysisSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const braceletAnalysis = watchData.bracelet_strap_and_clasp_inspection;

  if (!braceletAnalysis) return null;

  return (
    <DetailSection title="Bracelet, Strap & Clasp Inspection">
      <DocumentDownloadButton
        filePath={braceletAnalysis.watch_product_bracelet_analysis_image_path}
        label="Image Case,Bezel and Crystal"
      />
      <DetailItem
        label="Link Type"
        value={braceletAnalysis.bracelet_link_type}
      />
      <DetailItem
        label="Connection Type"
        value={braceletAnalysis.connection_type}
      />
      <DetailItem label="Clasp Action" value={braceletAnalysis.clasp_action} />
      <DetailItem
        label="Micro Adjustment"
        value={braceletAnalysis.micro_adjustment_functioning}
        type="boolean"
      />
      <DetailItem
        label="Clasp Engravings"
        value={braceletAnalysis.clasp_engravings}
      />
      {braceletAnalysis.notes && (
        <div className="col-span-2">
          <DetailItem label="Notes" value={braceletAnalysis.notes} />
        </div>
      )}
    </DetailSection>
  );
};

export const MovementAnalysisSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const movementAnalysis = watchData.movement_examination;

  if (!movementAnalysis) return null;

  return (
    <DetailSection title="Movement Examination">
      <DocumentDownloadButton
        filePath={movementAnalysis.watch_movement_analysis_image_path}
        label="Image Case,Bezel and Crystal"
      />
      <DetailItem label="Caliber" value={movementAnalysis.movement_caliber} />
      <DetailItem
        label="Engraving Quality"
        value={movementAnalysis.movement_engraving_quality}
      />
      <DetailItem
        label="Côtes de Genève"
        value={movementAnalysis.has_cotes_de_geneve}
        type="boolean"
      />
      <DetailItem
        label="Perlage"
        value={movementAnalysis.has_perlage}
        type="boolean"
      />
      <DetailItem
        label="Purple Reversing Wheels"
        value={movementAnalysis.has_purple_reversing_wheels}
        type="boolean"
      />
      <DetailItem
        label="Blue Parachrom Hairspring"
        value={movementAnalysis.has_blue_parachrom_hairspring}
        type="boolean"
      />
      <DetailItem
        label="Other Features"
        value={movementAnalysis.movement_other}
      />
      {movementAnalysis.movement_notes && (
        <div className="col-span-2">
          <DetailItem label="Notes" value={movementAnalysis.movement_notes} />
        </div>
      )}
    </DetailSection>
  );
};

export const PerformanceTestSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const performanceTest = watchData.performance_and_function_test;

  if (!performanceTest) return null;

  return (
    <DetailSection title="Performance & Function Test">
      <DocumentDownloadButton
        filePath={performanceTest.watch_performance_tests_image_path}
        label="Image Case,Bezel and Crystal"
      />
      <DetailItem
        label="Rate (seconds/day)"
        value={performanceTest.rate_seconds_per_day}
        type="number"
      />
      <DetailItem
        label="Amplitude (degrees)"
        value={performanceTest.amplitude_degrees}
        type="number"
      />
      <DetailItem
        label="Beat Error (ms)"
        value={performanceTest.beat_error_ms}
        type="number"
      />
      <DetailItem
        label="Power Reserve Test"
        value={performanceTest.power_reserve_test_result}
      />
      <DetailItem
        label="Time Setting"
        value={performanceTest.time_setting_works}
        type="boolean"
      />
      <DetailItem
        label="Date Change"
        value={performanceTest.date_change_works}
        type="boolean"
      />
      <DetailItem
        label="Chronograph"
        value={performanceTest.chronograph_works}
      />
      {performanceTest.notes && (
        <div className="col-span-2">
          <DetailItem label="Notes" value={performanceTest.notes} />
        </div>
      )}
    </DetailSection>
  );
};

export const DocumentationSection: React.FC<{
  watchData: WatchAuthentication;
}> = ({ watchData }) => {
  const documentation = watchData.provenance_documentation_audit;

  if (!documentation) return null;

  return (
    <DetailSection title="Provenance Documentation Audit">
      <DetailItem
        label="Authorized Dealer"
        value={documentation.is_authorized_dealer}
        type="boolean"
      />
      <DocumentDownloadButton
        filePath={documentation.warranty_card_path}
        label="Warranty Card"
      />
      <DocumentDownloadButton
        filePath={documentation.purchase_receipt_path}
        label="Purchase Receipt"
      />
      <DocumentDownloadButton
        filePath={documentation.service_records_path}
        label="Service Records"
      />
      <DocumentDownloadButton
        filePath={documentation.watch_image_front_path}
        label="Watch Front View"
      />
      <DocumentDownloadButton
        filePath={documentation.watch_image_back_path}
        label="Watch Back View"
      />
      <DocumentDownloadButton
        filePath={documentation.watch_image_side_path}
        label="Watch Side View"
      />
      {documentation.warranty_card_notes && (
        <div className="col-span-2">
          <DetailItem
            label="Warranty Card Notes"
            value={documentation.warranty_card_notes}
          />
        </div>
      )}
      {documentation.service_history_notes && (
        <div className="col-span-2">
          <DetailItem
            label="Service History Notes"
            value={documentation.service_history_notes}
          />
        </div>
      )}
    </DetailSection>
  );
};
