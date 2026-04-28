import { FiDownload } from "react-icons/fi";
import styles from "./ExportPdfButton.module.css";

interface ExportPdfButtonProps {
  handleClick: () => void;
}

const ExportPdfButton = ({ handleClick }: ExportPdfButtonProps) => {
  return (
    <button onClick={handleClick} className={styles.exportButton}>
      <FiDownload /> <span>Export PDF</span>
    </button>
  );
};

export default ExportPdfButton;

