export default function DiagnosisDetailsModal({ diagnosis, onClose }) {
    if (!diagnosis) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <h3>{diagnosis.title}</h3>
  
          <p><strong>Date:</strong> {diagnosis.date}</p>
          <p><strong>Doctor:</strong> Dr. {diagnosis.doctor?.name}</p>
          <p><strong>Severity:</strong> {diagnosis.severity}</p>
  
          <hr />
  
          <p><strong>Description</strong></p>
          <p>{diagnosis.description}</p>
  
          {diagnosis.notes && (
            <>
              <p><strong>Doctor Notes</strong></p>
              <p>{diagnosis.notes}</p>
            </>
          )}
  
          <button className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
  