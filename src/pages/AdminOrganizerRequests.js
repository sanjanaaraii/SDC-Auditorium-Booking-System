import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrganizerRequests.css";

const AdminOrganizerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/organizer-requests"
      );
      setRequests(res.data);
    } catch (err) {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/organizer-requests/${requestId}`,
        { status }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );

      if (selectedRequest?._id === requestId) {
        setSelectedRequest((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      alert("Failed to update request");
    }
  };

  return (
    <div className="organizer-requests-page">
      <h2 className="page-title">Organizer Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="requests-layout">

          {/* LEFT: Applicants */}
          <div className="requests-list">
            <h4>Applicants</h4>
            <ul>
              {requests.map((req) => (
                <li
                  key={req._id}
                  className={`
                    ${selectedRequest?._id === req._id ? "active" : ""}
                    ${req.status === "Approved" ? "approved" : ""}
                    ${req.status === "Rejected" ? "rejected" : ""}
                  `}
                  onClick={() => setSelectedRequest(req)}
                >
                  <div className="applicant-row">
                    <span>{req.user.name}</span>

                    {req.status === "Approved" && (
                      <span className="role-badge organizer">
                        Organizer
                      </span>
                    )}

                    {req.status === "Rejected" && (
                      <span className="role-badge rejected">
                        Rejected
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Details */}
          <div className="request-details">
            {selectedRequest ? (
              <>
                <h3>Request Details</h3>

                <div className="detail-row">
                  <span>User</span>
                  <p>{selectedRequest.user.name}</p>
                </div>

                <div className="detail-row">
                  <span>Event</span>
                  <p>{selectedRequest.eventName}</p>
                </div>

                <div className="detail-row">
                  <span>Reason</span>
                  <p>{selectedRequest.reason}</p>
                </div>

                {/* ✅ BUTTONS UNDER REASON */}
                {(!selectedRequest.status ||
                  selectedRequest.status === "Pending") && (
                  <div className="detail-actions">
                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(selectedRequest._id, "Approved")
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="decline-btn"
                      onClick={() =>
                        updateStatus(selectedRequest._id, "Rejected")
                      }
                    >
                      Decline
                    </button>
                  </div>
                )}

                {selectedRequest.status === "Approved" && (
                  <p className="status-text approved">
                    This user is now an Organizer.
                  </p>
                )}

                {selectedRequest.status === "Rejected" && (
                  <p className="status-text rejected">
                    This request was rejected.
                  </p>
                )}
              </>
            ) : (
              <p className="placeholder">
                Select a request to view details
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminOrganizerRequests;
