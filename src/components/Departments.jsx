import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import Swal from "sweetalert2";
import "./Departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newDepartment, setNewDepartment] = useState({
    departmentName: "",
    hodName: "",
    courseId: "",
  });

  useEffect(() => {
    const fetchDepartmentsAndCourses = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          axiosInstance.get("/department/get"),
          axiosInstance.get("/course/get"),
        ]);
        setDepartments(deptRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        setError("Failed to load departments or courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentsAndCourses();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchByName = async () => {
        try {
          if (searchTerm.trim()) {
            const response = await axiosInstance.post(
              `/department/getByName/${searchTerm}`
            );
            setDepartments(response.data);
          } else {
            const res = await axiosInstance.get("/department/get");
            setDepartments(res.data);
          }
        } catch (err) {
          setDepartments([]);
        }
      };
      fetchByName();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const openAddPopup = () => {
    setIsEditing(false);
    setNewDepartment({ departmentName: "", hodName: "", courseId: "" });
    setShowPopup(true);
  };

  const openEditPopup = (department) => {
    setIsEditing(true);
    setCurrentDepartmentId(department.deptId);
    setNewDepartment({
      departmentName: department.departmentName,
      hodName: department.hodName,
      courseId: department.course?.id || "",
    });
    setShowPopup(true);
  };

  const handleAddOrUpdateDepartment = async (e) => {
    e.preventDefault();
    const payload = {
      departmentName: newDepartment.departmentName,
      hodName: newDepartment.hodName,
      course: { id: newDepartment.courseId },
    };

    try {
      if (isEditing) {
        const response = await axiosInstance.put(
          `/department/update/${currentDepartmentId}`,
          payload
        );
        setDepartments((prev) =>
          prev.map((d) =>
            d.deptId === currentDepartmentId ? response.data : d
          )
        );
        Swal.fire("Updated", "Department updated successfully!", "success");
      } else {
        const response = await axiosInstance.post("/department/add", payload);
        setDepartments((prev) => [...prev, response.data]);
        Swal.fire("Added", "Department added successfully!", "success");
      }

      setShowPopup(false);
      setNewDepartment({ departmentName: "", hodName: "", courseId: "" });
      setCurrentDepartmentId(null);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleDeleteDepartment = async (id) => {
    const result = await Swal.fire({
      title: "Delete Department?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/department/delete/${id}`);
        setDepartments((prev) => prev.filter((d) => d.deptId !== id));
        Swal.fire("Deleted!", "Department has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete department!", "error");
      }
    }
  };

  return (
    <div className="departments-container">
      <h1 className="departments-title">Departments</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by department name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="add-button" onClick={openAddPopup}>
        Add Department
      </button>

      {loading ? (
        <p className="loading">Loading departments...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : departments.length === 0 ? (
        <p className="no-courses">No departments found</p>
      ) : (
        <div className="table-container">
          <table className="departments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>HOD</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.deptId}>
                  <td>{d.deptId}</td>
                  <td>{d.departmentName}</td>
                  <td>{d.hodName}</td>
                  <td>{d.course?.name || "N/A"}</td> 
                  {/* <td>
                    {d.course?.name ||
                      courses.find((c) => c.id === (d.course?.id || d.courseId))
                        ?.name ||
                      "N/A"}
                  </td> */}

                  <td>
                    <button
                      className="edit-button"
                      onClick={() => openEditPopup(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteDepartment(d.deptId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{isEditing ? "Update Department" : "Add Department"}</h2>
            <form onSubmit={handleAddOrUpdateDepartment}>
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment.departmentName}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    departmentName: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="HOD Name"
                value={newDepartment.hodName}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    hodName: e.target.value,
                  })
                }
                required
              />
              <select
                value={newDepartment.courseId}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    courseId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="button-group">
                <button type="submit" className="save-button">
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
