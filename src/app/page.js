'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import UsersTable from "./components/UsersTable";
import styles from "./page.module.css";
import data from "./data/referrals.json";

// Icons
import { FaSearch } from "react-icons/fa";
import { HiViewColumns } from "react-icons/hi2";
import { BiImport } from "react-icons/bi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";

export default function Home() {
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [showFilter, setShowFilter] = useState(false);

  const [filterColumn, setFilterColumn] = useState("name");
  const [filterOperator, setFilterOperator] = useState("contains");
  const [filterValue, setFilterValue] = useState("");

  const filterRef = useRef(null);
  const columnsRef = useRef(null);
  const exportRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
      if (columnsRef.current && !columnsRef.current.contains(event.target)) {
        setShowColumns(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExport(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const [showColumns, setShowColumns] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const [columns, setColumns] = useState({
    name: true,
    patient: true,
    created: true,
    provider: true,
    rating: true,
  });

  const [searchColumn, setSearchColumn] = useState("");

  const columnList = [
    { key: "name", label: "Name" },
    { key: "patient", label: "Patient" },
    { key: "created", label: "Created on" },
    { key: "provider", label: "Provider" },
    { key: "rating", label: "Rating" },
  ];

  const columnKeyMap = {
    name: "practice_name",
    patient: "patient_name",
    created: "date_created",
    provider: "provider_name",
    rating: "status",
  };


  useEffect(() => {
    let filtered = data;

    if (filterValue.trim() !== "") {
      const key = columnKeyMap[filterColumn];
      const val = filterValue.toLowerCase();

      filtered = filtered.filter((item) => {
        const itemValue =
          item[key] !== undefined && item[key] !== null
            ? item[key].toString().toLowerCase()
            : "";

        switch (filterOperator) {
          case "contains":
            return itemValue.includes(val);
          case "doesNotContain":
            return !itemValue.includes(val);
          case "equal":
            return itemValue === val;
          case "notEqual":
            return itemValue !== val;
          case "startsWith":
            return itemValue.startsWith(val);
          case "endsWith":
            return itemValue.endsWith(val);
          case "isEmpty":
            return itemValue === "";
          case "isNotEmpty":
            return itemValue !== "";
          default:
            return true;
        }
      });
    }


    if (searchText.trim() !== "") {
      const val = searchText.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          (item.practice_name || "").toLowerCase().includes(val) ||
          (item.patient_name || "").toLowerCase().includes(val) ||
          (item.provider_name || "").toLowerCase().includes(val) ||
          (item.status || "").toLowerCase().includes(val)
        );
      });
    }

    setFilteredData(filtered);
  }, [filterColumn, filterOperator, filterValue, searchText]);



  return (
    <main>
      <div className={styles.containerBox}>

        <div className={styles.header}>

          
          <div ref={columnsRef}>
            <button
              className={styles.filterBtn}
              title="Columns"
              onClick={() => setShowColumns(!showColumns)}
            >
              <HiViewColumns />
            </button>
            {showColumns && (
              <div className={styles.columnsDropdown}>
                <input
                  type="text"
                  placeholder="🔍 Search columns..."
                  className={styles.columnSearch}
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                />
                {columnList
                  .filter((col) =>
                    col.label.toLowerCase().includes(searchColumn.toLowerCase())
                  )
                  .map((col) => (
                    <label key={col.key}>
                      <input
                        type="checkbox"
                        checked={columns[col.key]}
                        onChange={() =>
                          setColumns({ ...columns, [col.key]: !columns[col.key] })
                        }
                      />
                      {col.label}
                    </label>
                  ))}
              </div>
            )}
          </div>


          <div ref={filterRef}>
            <button
              className={styles.viewbtn}
              title="Filters"
              onClick={() => setShowFilter(!showFilter)}
            >
              <IoFilterSharp />
            </button>
            {showFilter && (
              <div className={styles.filtersDropdown}>
                <div className={styles.filtersItem}>
                  <label htmlFor="column">Column:</label>
                  <select
                    id="column"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="created">Created on</option>
                    <option value="provider">Provider</option>
                    <option value="rating">Rating</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>

                <div className={styles.filtersItem}>
                  <label htmlFor="operator">Operator:</label>
                  <select
                    id="operator"
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value)}
                  >
                    <option value="contains">contains</option>
                    <option value="doesNotContain">does not contain</option>
                    <option value="equal">equal</option>
                    <option value="notEqual">does not equal</option>
                    <option value="startsWith">starts with</option>
                    <option value="endsWith">ends with</option>
                    <option value="isEmpty">is empty</option>
                    <option value="isNotEmpty">is not empty</option>
                  </select>
                </div>

                <div className={styles.filtersItem}>
                  <label htmlFor="value">Value:</label>
                  <input
                    id="value"
                    type="text"
                    placeholder="Filter value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

        
          <div ref={exportRef}>
            <button
              className={styles.importBtn}
              title="Export"
              onClick={() => setShowExport(!showExport)}
            >
              <BiImport />
            </button>
            {showExport && (
              <div className={styles.exportDropdown}>
                <div className={styles.exportItem} onClick={() => window.print()}>
                  Print
                </div>
                <div
                  className={styles.exportItem}
                  onClick={() => window.downloadCSV?.()}
                >
                  Download as CSV
                </div>
              </div>
            )}
          </div>

          
          <button
            className={styles.searchBtn}
            title="Search"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FaSearch />
          </button>
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);

                if (value.toLowerCase() === "bar") {
                  router.push("/foo/bar");
                }

                const filtered = data.filter((item) =>
                  item.practice_name.toLowerCase().includes(value.toLowerCase()) ||
                  item.patient_name.toLowerCase().includes(value.toLowerCase()) ||
                  item.provider_name.toLowerCase().includes(value.toLowerCase()) ||
                  item.status.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredData(filtered);
              }}
            />
          )}
        </div>
        
        
        <UsersTable
          columns={columns}
          searchText={searchText}
          filterText={showFilter}
          filterColumn={filterColumn}
          filterOperator={filterOperator}
          users={filteredData}
          onOpenFilter={() => setShowFilter(true)}
          onOpenColumns={() => setShowColumns(true)}
        />
      </div>
    </main>
      );
}
