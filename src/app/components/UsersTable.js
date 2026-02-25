import { useState, useEffect, useRef } from "react";
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

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className={styles.box}>
      <div className={styles.filterWrapper}>
        <div className={styles.filtersContainer}>
          <div className={styles.buttonRow}>
            <button
              className={styles.btn}
              onClick={() =>
                setFilters([
                  ...filters,
                  { key: "practice_name", operator: "contains", value: "" }
                ])
              }
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
          </div>          {filters.map((f, idx) => (
            <div key={idx} className={styles.filterRow}>
              <select
                value={f.key}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx].key = e.target.value;
                  setFilters(newFilters);
                }}
              >

                <option value="practice_name">Name</option>
                <option value="patient_name">Patient</option>
                <option value="date_created">Created on</option>
                <option value="provider_name">Provider</option>
                <option value="status">Rating</option>
              </select>

              <select
                value={f.operator}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx].operator = e.target.value;
                  setFilters(newFilters);
                }}
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

              <input
                type="text"
                value={f.value}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx].value = e.target.value;
                  setFilters(newFilters);
                }}
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
                <BsThreeDotsVertical />
                {activeDropdown === "practice_name" && (
                  <div className={styles.dropdownMenu}>
                    <div onClick={() => handleSort("status", "asc")}>
                      <GoArrowUp />&nbsp;Sort by ASC
                    </div>
                    <div onClick={() => handleSort("status", "desc")}>
                      <GoArrowDown />&nbsp;Sort by DESC
                    </div>
                    <div><TiPin />&nbsp;Pin to left</div>
                    <div><SiPinboard />&nbsp;Pin to right</div>
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
                    <div><TiPin />&nbsp;Pin to left</div>
                    <div><SiPinboard />&nbsp;Pin to right</div>
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
                    <div><TiPin />&nbsp;Pin to left</div>
                    <div><SiPinboard />&nbsp;Pin to right</div>
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
                    <div><TiPin />&nbsp;Pin to left</div>
                    <div><SiPinboard />&nbsp;Pin to right</div>
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
                    <div><TiPin />&nbsp;Pin to left</div>
                    <div><SiPinboard />&nbsp;Pin to right</div>
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
          {paginatedUsers.map((user, index) => (
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
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &lt;
        </button>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}


