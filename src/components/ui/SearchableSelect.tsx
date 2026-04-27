import { useState, useRef, useEffect, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./SearchableSelect.module.css";

interface SearchableSelectProps<T> {
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeholder: string;
  value?: string | number;
  onChange: (value: number | null) => void;
}

const SearchableSelect = <T,>({
  options,
  getLabel,
  getValue,
  placeholder,
  value,
  onChange,
}: SearchableSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(() => {
    if (!value) return null;
    const selected = options.find(
      (item) => getValue(item).toString() === value.toString(),
    );
    return selected ? getLabel(selected) : null;
  }, [value, options, getLabel, getValue]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter((item) => getLabel(item).toLowerCase().includes(lower));
  }, [options, search, getLabel]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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

  const handleSelect = (val: number | null) => {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`${styles.triggerText} ${!selectedLabel ? styles.placeholder : ""}`}
        >
          {selectedLabel || placeholder}
        </span>
        <FiChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

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
            {!search && (
              <div
                className={`${styles.option} ${styles.clearOption} ${!value ? styles.optionSelected : ""}`}
                onClick={() => handleSelect(null)}
              >
                {placeholder}
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const itemValue = getValue(item);
                const isSelected = value?.toString() === itemValue.toString();
                return (
                  <div
                    key={itemValue}
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    onClick={() => handleSelect(Number(itemValue))}
                  >
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

export default SearchableSelect;

