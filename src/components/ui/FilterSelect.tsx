import styles from "./Filters.module.css";
import SearchableSelect from "./SearchableSelect";

interface FilterSelectProps<T> {
  label: string;
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeHolder: string;
  value?: string | number;
  onChange: (value: number | null) => void;
}

const FilterSelect = <T,>({
  label,
  options,
  getLabel,
  getValue,
  placeHolder,
  value,
  onChange,
}: FilterSelectProps<T>) => {
  return (
    <div className={styles.filterField}>
      <label className={styles.filterLabel}>{label}</label>
      <SearchableSelect
        options={options}
        getLabel={getLabel}
        getValue={getValue}
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FilterSelect;
