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
                  className={
                    selectedRequest?._id === req._id ? "active" : ""
                  }
                  onClick={() => setSelectedRequest(req)}
                >
                  {req.user.name}
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
