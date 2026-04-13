import { BiPlus } from "react-icons/bi";
import styles from "./AddEventButton.module.css";

interface AddEventButtonProps {
  handleClick: () => void;
}

const AddEventButton = ({ handleClick }: AddEventButtonProps) => {
  return (
    <button onClick={handleClick} className={styles.addEventButton}>
      <BiPlus /> <span>Eveniment</span>
    </button>
  );
};

export default AddEventButton;
