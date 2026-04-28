import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ScheduleEvent } from "@/types/ScheduleEvent.types";
import { DAYS } from "@/constants/timetable.constants";
import { formatHour, generateSortedTimeSlots } from "@/utils/timetableUtils";
import { TIME_SLOTS } from "@/constants/timetable.constants";
import robotoBase64 from "@/utils/robotoFont";

const ACTIVITY_COLORS: Record<string, [number, number, number]> = {
  Curs: [219, 234, 254],       // light blue
  Laborator: [220, 252, 231],  // light green
  Seminar: [254, 249, 195],    // light yellow
  Proiect: [243, 232, 255],    // light purple
};

const FREQUENCY_LABELS: Record<string, string> = {
  PARA: " (P)",
  INPARA: " (I)",
  SAPTAMANAL: "",
};

export const exportSchedulePdf = (
  events: ScheduleEvent[],
  title?: string,
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Register Roboto font for Romanian diacritics support
  doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFont("Roboto-Regular.ttf", "Roboto", "bold");

  // Title
  const pdfTitle = title || "Orar";
  doc.setFontSize(16);
  doc.setFont("Roboto", "bold");
  doc.text(pdfTitle, doc.internal.pageSize.getWidth() / 2, 14, {
    align: "center",
  });

  // Build time slots from events
  const timeSlots = generateSortedTimeSlots(events, TIME_SLOTS);

  // Group events by day+time
  const groupedEvents: Record<string, ScheduleEvent[]> = {};
  events.forEach((event) => {
    const timeKey = `${formatHour(event.startingHour)} - ${formatHour(event.endingHour)}`;
    const key = `${event.scheduleDay}-${timeKey}`;
    if (!groupedEvents[key]) groupedEvents[key] = [];
    groupedEvents[key].push(event);
  });

  // Build table data
  const tableHead = [["Ora", ...DAYS]];
  const tableBody: string[][] = [];
  // Store per-cell event info for split coloring
  const cellEventTypes: Record<string, string[]> = {};

  timeSlots.forEach((time, rowIdx) => {
    const row: string[] = [time];

    DAYS.forEach((day, colIdx) => {
      const key = `${day}-${time}`;
      const cellEvents = groupedEvents[key] || [];

      if (cellEvents.length === 0) {
        row.push("");
      } else {
        const cellText = cellEvents
          .map((e) => {
            const freq = FREQUENCY_LABELS[e.frequency] || "";
            return [
              `${e.subjectDTO.activityType}${freq}`,
              e.subjectDTO.name,
              `${e.professorDTO.lastName} ${e.professorDTO.firstName}`,
              `Gr: ${e.groups?.map((g) => g.identifier).join(", ") || ""}`,
              `Sala: ${e.roomDTO.name}`,
            ].join("\n");
          })
          .join("\n\n");
        row.push(cellText);

        // Store activity types for each event in this cell
        cellEventTypes[`${rowIdx}-${colIdx}`] = cellEvents.map(
          (e) => e.subjectDTO.activityType,
        );
      }
    });

    tableBody.push(row);
  });

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 20,
    theme: "grid",
    styles: {
      fontSize: 6,
      cellPadding: 1.5,
      valign: "middle",
      lineColor: [200, 200, 200],
      lineWidth: 0.3,
      font: "Roboto",
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
      font: "Roboto",
    },
    columnStyles: {
      0: { cellWidth: 22, halign: "center", fontStyle: "bold", fontSize: 7 },
    },
    didDrawCell: (data) => {
      if (data.section !== "body" || data.column.index === 0) return;

      const cellKey = `${data.row.index}-${data.column.index - 1}`;
      const types = cellEventTypes[cellKey];
      if (!types || types.length === 0) return;

      const cell = data.cell;
      const x = cell.x;
      const y = cell.y;
      const w = cell.width;
      const h = cell.height;

      if (types.length === 1) {
        // Single event — fill entire cell
        const color = ACTIVITY_COLORS[types[0]];
        if (color) {
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(x, y, w, h, "F");
        }
      } else {
        // Multiple events — split cell into equal vertical bands
        const bandHeight = h / types.length;
        types.forEach((type, i) => {
          const color = ACTIVITY_COLORS[type];
          if (color) {
            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(x, y + i * bandHeight, w, bandHeight, "F");
          }
        });

        // Draw a thin separator line between event blocks
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.2);
        for (let i = 1; i < types.length; i++) {
          const sepY = y + i * bandHeight;
          doc.line(x, sepY, x + w, sepY);
        }
      }

      // Redraw the cell border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.rect(x, y, w, h, "S");

      // Redraw the text on top of the colored background
      const textLines = cell.text;
      if (textLines && textLines.length > 0) {
        doc.setFont("Roboto", "normal");
        doc.setFontSize(6);
        doc.setTextColor(0, 0, 0);
        const padding = cell.padding("left") || 1.5;
        const lineHeight = doc.getFontSize() * 0.4; // approx mm per line
        let textY = y + padding + lineHeight;
        textLines.forEach((line: string) => {
          doc.text(line, x + padding, textY);
          textY += lineHeight;
        });
      }
    },
  });

  // Legend at bottom
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 180;
  const legendY = Math.min(finalY + 8, doc.internal.pageSize.getHeight() - 12);

  doc.setFontSize(7);
  doc.setFont("Roboto", "normal");

  const legendItems = [
    { label: "Curs", color: ACTIVITY_COLORS.Curs },
    { label: "Laborator", color: ACTIVITY_COLORS.Laborator },
    { label: "Seminar", color: ACTIVITY_COLORS.Seminar },
    { label: "Proiect", color: ACTIVITY_COLORS.Proiect },
  ];

  let legendX = 14;
  legendItems.forEach(({ label, color }) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(legendX, legendY, 4, 3, "F");
    doc.setDrawColor(180, 180, 180);
    doc.rect(legendX, legendY, 4, 3, "S");
    doc.text(label, legendX + 5.5, legendY + 2.3);
    legendX += doc.getTextWidth(label) + 10;
  });

  doc.text("(P) = Pară   (I) = Impară", legendX + 2, legendY + 2.3);

  // Save
  const filename = pdfTitle.replace(/[^a-zA-Z0-9\-_ ]/g, "").trim();
  doc.save(`${filename || "orar"}.pdf`);
};



