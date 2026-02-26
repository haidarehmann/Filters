import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./UserTable.module.css";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiPin } from "react-icons/ti";
import { SiPinboard } from "react-icons/si";
import { MdFilterAlt } from "react-icons/md";
import { BiSolidHide } from "react-icons/bi";
import { HiViewColumns } from "react-icons/hi2";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

export default function UsersTable({ users, onOpenFilter, onOpenColumns }) {
  const tableContainerRef = useRef();

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState([]);

  const handleSort = (key, direction = null) => {
    let dir = "asc";

    if (direction) {
      dir = direction;
    } else {
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        dir = "desc";
      }
    }

    setSortConfig({ key, direction: dir });
  };

  const [visibleUsers, setVisibleUsers] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(20);


  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return filters.every((f) => {
        const fieldValue = user[f.key]
          ? user[f.key].toString().toLowerCase().trim()
          : "";

        const filterValue = f.value.toLowerCase().trim();

        switch (f.operator) {
          case "contains":

            if (!f.value) return true;

            if (f.key === "date_created") {
              const userDate = new Name(user[f.key])
                .toISOString()
                .split("T")[0];

              return userName === f.value;
            }

            return (
              user[f.key]?.toString().toLowerCase().trim() ===
              f.value.toString().toLowerCase().trim()
            );


          case "equals":
            if (!f.value) return true;

            if (f.key === "date_created") {
              const userDate = new Date(user[f.key])
                .toISOString()
                .split("T")[0];

              return userDate === f.value;
            }

            return (
              user[f.key]?.toString().toLowerCase().trim() ===
              f.value.toString().toLowerCase().trim()
            );

          case "startsWith":
            return fieldValue.startsWith(filterValue);

          case "endsWith":
            return fieldValue.endsWith(filterValue);

          case "isEmpty":
            return fieldValue === "";

          case "isNotEmpty":
            return fieldValue !== "";

          default:
            return true;
        }
      });
    });
  }, [users, filters]);

  const sortedUsers = useMemo(() => {
    if (!filteredUsers) return [];
    return [...filteredUsers].sort((a, b) => {
      if (!sortConfig.key) return 0;
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  useEffect(() => {
    setVisibleUsers(sortedUsers.slice(0, itemsToShow));
  }, [sortedUsers, itemsToShow]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setItemsToShow((prev) => prev + 20);
    }
  };

  const isOperatorUsed = (operator, currentIndex) => {
    return filters.some((item, index) => index !== currentIndex && item.operator === operator);
  };

  const columns = [
    { key: "practice_name", label: "Name" },
    { key: "patient_name", label: "Patient" },
    { key: "date_created", label: "Created on" },
    { key: "provider_name", label: "Provider" },
    { key: "status", label: "Rating" }
  ];

  const isColumnUsed = (columnKey, currentIndex) => {
    return filters.some(
      (item, index) =>
        index !== currentIndex && item.key === columnKey
    );
  };
  return (

    <div className={styles.box}>
      <div className={styles.filterWrapper}>

        <div className={styles.filtersContainer}>

          <div className={styles.buttonRow}>
            <button
              className={styles.btn}
              onClick={() => {
                if (filters.length < 5) {
                  setFilters([
                    ...filters,
                    { key: "practice_name", operator: "contains", value: "" }
                  ]);
                } else {
                  alert("Maximum 5 filters allowed");
                }
              }}
            >
              <IoIosAdd /> Add Filter
            </button>
            {filters.length > 0 && (
              <button
                className={styles.resetBtn}
                onClick={() => setFilters([])}
              >
                Reset
              </button>
            )}
          </div>
          {filters.map((f, idx) => (
            <div key={idx} className={styles.filterRow}>

              <select
                value={f.key}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx].key = e.target.value;
                  setFilters(newFilters);
                }}
              >
                {columns.map((col) => (
                  <option
                    key={col.key}
                    value={col.key}
                    disabled={isColumnUsed(col.key, idx)}
                  >
                    {col.label}
                  </option>
                ))}


              </select>

              <select
                value={f.operator}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx].operator = e.target.value;
                  setFilters(newFilters);
                }}
              >
                <option value="contains" disabled={isOperatorUsed("contains", idx)}>contains</option>
                <option value="equals" disabled={isOperatorUsed("equals", idx)}>equals</option>
                <option value="startsWith" disabled={isOperatorUsed("startsWith", idx)}>starts with</option>
                <option value="endsWith" disabled={isOperatorUsed("endsWith", idx)}>ends with</option>
                <option value="isEmpty" disabled={isOperatorUsed("isEmpty", idx)}>is empty</option>
                <option value="isNotEmpty" disabled={isOperatorUsed("isNotEmpty", idx)}>is not empty</option>
              </select>

              <input
                type="text"
                value={f.value}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx].value = e.target.value;
                  setFilters(newFilters);
                }}
                disabled={f.operator === "isEmpty" || f.operator === "isNotEmpty"}
              />

              <button
                onClick={() => {
                  const newFilters = [...filters];
                  newFilters.splice(idx, 1);
                  setFilters(newFilters);
                }}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
        className={styles.containerbar}
        ref={tableContainerRef}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("practice_name")}
                className={styles.sortable}
              >
                Name
                <span className={styles.icon}>
                  {sortConfig.key === "practice_name" &&
                    (sortConfig.direction === "asc" ? (
                      <GoArrowUp />
                    ) : (
                      <GoArrowDown />
                    ))}
                  <BsThreeDotsVertical
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown === "practice_name" ? null : "practice_name"
                      );
                    }}
                  />
                  {activeDropdown === "practice_name" && (
                    <div className={styles.dropdownMenu}>
                      <div onClick={() => handleSort("status", "asc")}>
                        <GoArrowUp />&nbsp;Sort by ASC
                      </div>
                      <div onClick={() => handleSort("status", "desc")}>
                        <GoArrowDown />&nbsp;Sort by DESC
                      </div>
                      <div onClick={(e) => e.stopPropagation()}><TiPin />&nbsp;Pin to left</div>
                      <div onClick={(e) => e.stopPropagation()}><SiPinboard />&nbsp;Pin to right</div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenFilter(); }}>
                        <MdFilterAlt />&nbsp;Filter
                      </div>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        setHiddenColumns(prev => [...prev, "practice_name"]);
                      }}>
                        <BiSolidHide />&nbsp;Hide column
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenColumns(); }}>
                        <HiViewColumns />&nbsp;&nbsp;Manage columns
                      </div>
                    </div>
                  )}
                </span>
              </th>

              <th
                onClick={() => handleSort("patient_name")}
                className={styles.sortable}
              >
                Patient
                <span className={styles.icon}>
                  {sortConfig.key === "patient_name" &&
                    (sortConfig.direction === "asc" ? (
                      <GoArrowUp />
                    ) : (
                      <GoArrowDown />
                    ))}
                  <BsThreeDotsVertical
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "patient_name" ? null : "patient_name")
                    }
                  />
                  {activeDropdown === "patient_name" && (
                    <div className={styles.dropdownMenu}>
                      <div onClick={() => handleSort("status", "asc")}> <GoArrowUp />&nbsp;Sort by ASC</div>
                      <div onClick={() => handleSort("status", "desc")}> <GoArrowDown />&nbsp;Sort by DESC</div>
                      <div onClick={(e) => e.stopPropagation()}><TiPin />&nbsp;Pin to left</div>
                      <div onClick={(e) => e.stopPropagation()}><SiPinboard />&nbsp;Pin to right</div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenFilter(); }}>
                        <MdFilterAlt />&nbsp;Filter
                      </div>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        setHiddenColumns(prev => [...prev, "practice_name"]);
                      }}>
                        <BiSolidHide />&nbsp;Hide column
                      </div>
                      <div onClick={onOpenColumns}><HiViewColumns />&nbsp;&nbsp;Manage columns</div>
                    </div>
                  )}
                </span>
              </th>

              <th
                onClick={() => handleSort("date_created")}
                className={styles.sortable}
              >
                Created on
                <span className={styles.icon}>
                  {sortConfig.key === "date_created" &&
                    (sortConfig.direction === "asc" ? (
                      <GoArrowUp />
                    ) : (
                      <GoArrowDown />
                    ))}
                  <BsThreeDotsVertical
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "date_created" ? null : "date_created")
                    }
                  />
                  {activeDropdown === "date_created" && (
                    <div className={styles.dropdownMenu}>
                      <div onClick={() => handleSort("status", "asc")}> <GoArrowUp />&nbsp;Sort by ASC</div>
                      <div onClick={() => handleSort("status", "desc")}> <GoArrowDown />&nbsp;Sort by DESC</div>
                      <div onClick={(e) => e.stopPropagation()}><TiPin />&nbsp;Pin to left</div>
                      <div onClick={(e) => e.stopPropagation()}><SiPinboard />&nbsp;Pin to right</div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenFilter(); }}>
                        <MdFilterAlt />&nbsp;Filter
                      </div>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        setHiddenColumns(prev => [...prev, "date_created"]);
                      }}>
                        <BiSolidHide />&nbsp;Hide column
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenColumns(); }}>
                        <HiViewColumns />&nbsp;&nbsp;Manage columns
                      </div>
                    </div>
                  )}
                </span>
              </th>

              <th
                onClick={() => handleSort("provider_name")}
                className={styles.sortable}
              >
                Provider
                <span className={styles.icon}>
                  {sortConfig.key === "provider_name" &&
                    (sortConfig.direction === "asc" ? (
                      <GoArrowUp />
                    ) : (
                      <GoArrowDown />
                    ))}
                  <BsThreeDotsVertical
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "provider_name" ? null : "provider_name")
                    }
                  />
                  {activeDropdown === "provider_name" && (
                    <div className={styles.dropdownMenu}>
                      <div onClick={() => handleSort("status", "asc")}> <GoArrowUp />&nbsp;Sort by ASC</div>
                      <div onClick={() => handleSort("status", "desc")}> <GoArrowDown />&nbsp;Sort by DESC</div>
                      <div onClick={(e) => e.stopPropagation()}><TiPin />&nbsp;Pin to left</div>
                      <div onClick={(e) => e.stopPropagation()}><SiPinboard />&nbsp;Pin to right</div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenFilter(); }}>
                        <MdFilterAlt />&nbsp;Filter
                      </div>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        setHiddenColumns(prev => [...prev, "provider_name"]);
                      }}>
                        <BiSolidHide />&nbsp;Hide column
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenColumns(); }}>
                        <HiViewColumns />&nbsp;&nbsp;Manage columns
                      </div>
                    </div>
                  )}
                </span>
              </th>

              <th
                onClick={() => handleSort("status")}
                className={styles.sortable}
              >
                Rating
                <span className={styles.icon}>
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? (
                      <GoArrowUp />
                    ) : (
                      <GoArrowDown />
                    ))}
                  <BsThreeDotsVertical
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "status" ? null : "status")
                    }
                  />
                  {activeDropdown === "status" && (
                    <div className={styles.dropdownMenu}>
                      <div onClick={() => handleSort("status", "asc")}> <GoArrowUp />&nbsp;Sort by ASC</div>
                      <div onClick={() => handleSort("status", "desc")}> <GoArrowDown />&nbsp;Sort by DESC</div>
                      <div onClick={(e) => e.stopPropagation()}><TiPin />&nbsp;Pin to left</div>
                      <div onClick={(e) => e.stopPropagation()}><SiPinboard />&nbsp;Pin to right</div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenFilter(); }}>
                        <MdFilterAlt />&nbsp;Filter
                      </div>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        setHiddenColumns(prev => [...prev, "status"]);
                      }}>
                        <BiSolidHide />&nbsp;Hide column
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); onOpenColumns(); }}>
                        <HiViewColumns />&nbsp;&nbsp;Manage columns
                      </div>
                    </div>
                  )}
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.practice_name}</td>
                <td>{user.patient_name}</td>
                <td>{user.date_created}</td>
                <td>{user.provider_name}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


