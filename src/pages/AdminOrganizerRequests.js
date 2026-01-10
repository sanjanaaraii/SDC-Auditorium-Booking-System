import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h2>Organizer Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", gap: "2rem" }}>
          
          {/* LEFT: List of applicants */}
          <ul style={{ width: "30%" }}>
            {requests.map((req) => (
              <li
                key={req._id}
                style={{ cursor: "pointer", marginBottom: "0.5rem" }}
                onClick={() => setSelectedRequest(req)}
              >
                {req.user.name}
              </li>
            ))}
          </ul>

          {/* RIGHT: Details */}
          <div style={{ width: "70%" }}>
            {selectedRequest ? (
              <>
                <h3>Event Details</h3>
                <p><strong>User:</strong> {selectedRequest.user.name}</p>
                <p><strong>Event:</strong> {selectedRequest.eventName}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              </>
            ) : (
              <p>Select a request to view details</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminOrganizerRequests;
