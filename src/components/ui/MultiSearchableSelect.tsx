import { useState, useRef, useEffect, useMemo } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import styles from "./MultiSearchableSelect.module.css";

interface MultiSearchableSelectProps<T> {
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeholder: string;
  values: (string | number)[];
  onChange: (values: (number | string)[]) => void;
}

const MultiSearchableSelect = <T,>({
  options,
  getLabel,
  getValue,
  placeholder,
  values,
  onChange,
}: MultiSearchableSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLabels = useMemo(() => {
    return values
      .map((v) => {
        const item = options.find(
          (opt) => getValue(opt).toString() === v.toString(),
        );
        return item ? { value: v, label: getLabel(item) } : null;
      })
      .filter(Boolean) as { value: string | number; label: string }[];
  }, [values, options, getLabel, getValue]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter((item) =>
      getLabel(item).toLowerCase().includes(lower),
    );
  }, [options, search, getLabel]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = (val: number | string) => {
    const strVal = val.toString();
    if (values.some((v) => v.toString() === strVal)) {
      onChange(values.filter((v) => v.toString() !== strVal));
    } else {
      onChange([...values, val]);
    }
  };

  const handleRemove = (val: number | string) => {
    onChange(values.filter((v) => v.toString() !== val.toString()));
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`${styles.triggerText} ${selectedLabels.length === 0 ? styles.placeholder : ""}`}
        >
          {selectedLabels.length === 0
            ? placeholder
            : `${selectedLabels.length} grupă(e) selectată(e)`}
        </span>
        <FiChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {selectedLabels.length > 0 && (
        <div className={styles.tagsContainer}>
          {selectedLabels.map((item) => (
            <span key={item.value} className={styles.tag}>
              {item.label}
              <FiX
                className={styles.tagRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.value);
                }}
              />
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Caută..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.optionsList}>
            {!search && values.length > 0 && (
              <div
                className={`${styles.option} ${styles.clearOption}`}
                onClick={() => onChange([])}
              >
                Șterge selecția
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const itemValue = getValue(item);
                const isSelected = values.some(
                  (v) => v.toString() === itemValue.toString(),
                );
                return (
                  <div
                    key={itemValue}
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    onClick={() => handleToggle(itemValue)}
                  >
                    <span className={styles.checkbox}>
                      {isSelected ? "☑" : "☐"}
                    </span>
                    {getLabel(item)}
                  </div>
                );
              })
            ) : (
              <div className={styles.noResults}>Niciun rezultat</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSearchableSelect;

