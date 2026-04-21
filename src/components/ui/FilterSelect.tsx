import styles from "./Filters.module.css";

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
      <select
        className={styles.select}
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? null : parseInt(val, 10));
        }}
      >
        <option value={""}>{placeHolder}</option>
        {options.map((item) => (
          <option key={getValue(item)} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
