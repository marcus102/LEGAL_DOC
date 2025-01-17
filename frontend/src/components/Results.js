import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument } from "../api/apiClient";

const Results = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDocument();
  }, [docId]);

  const loadDocument = async () => {
    try {
      const data = await getDocument(docId);
      setDocument(data);
    } catch (error) {
      console.error("Failed to load document:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 16px",
    },
    header: {
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "12px",
      marginBottom: "24px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    breadcrumb: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "16px",
      color: "#64748b",
      fontSize: "14px",
    },
    breadcrumbLink: {
      color: "#3b82f6",
      cursor: "pointer",
      textDecoration: "none",
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "8px",
    },
    metadata: {
      display: "flex",
      gap: "24px",
      marginTop: "16px",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#64748b",
      fontSize: "14px",
    },
    tabs: {
      display: "flex",
      gap: "2px",
      marginBottom: "24px",
      borderBottom: "1px solid #e2e8f0",
    },
    tab: {
      padding: "12px 24px",
      cursor: "pointer",
      borderBottom: "2px solid transparent",
      color: "#64748b",
      transition: "all 0.2s ease",
    },
    activeTab: {
      color: "#3b82f6",
      borderBottom: "2px solid #3b82f6",
      fontWeight: "500",
    },
    contentSection: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "16px",
      paddingBottom: "8px",
      borderBottom: "1px solid #e2e8f0",
    },
    entityTag: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "16px",
      margin: "4px",
      fontSize: "14px",
    },
    section: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
      border: "1px solid #e2e8f0",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    confidenceBar: {
      height: "4px",
      backgroundColor: "#e2e8f0",
      borderRadius: "2px",
      overflow: "hidden",
    },
    confidenceFill: {
      height: "100%",
      backgroundColor: "#3b82f6",
      transition: "width 0.3s ease",
    },
  };

  const getEntityColor = (label) => {
    const colors = {
      PERSON: { bg: "#e3f2fd", text: "#1976d2" },
      ORG: { bg: "#f3e5f5", text: "#7b1fa2" },
      DATE: { bg: "#e8f5e9", text: "#388e3c" },
      MONEY: { bg: "#fff3e0", text: "#f57c00" },
      GPE: { bg: "#f3e5f5", text: "#7b1fa2" },
    };
    return colors[label] || { bg: "#f5f5f5", text: "#616161" };
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!document) {
    return <div style={styles.container}>Document not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbLink} onClick={() => navigate("/")}>
            Documents
          </span>
          <span>›</span>
          <span>{document.title}</span>
        </div>
        <h1 style={styles.title}>{document.title}</h1>
        <div style={styles.metadata}>
          <div style={styles.metaItem}>
            <span>Type:</span>
            <span>{document.document_type}</span>
          </div>
          <div style={styles.metaItem}>
            <span>Uploaded:</span>
            <span>{new Date(document.upload_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "overview" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "entities" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("entities")}
        >
          Entities
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "sections" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("sections")}
        >
          Sections
        </div>
      </div>

      {activeTab === "overview" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Document Overview</h2>
          <div style={styles.metadata}>
            <div style={styles.metaItem}>
              <span>Total Sections:</span>
              <span>{document.processed_content?.sections?.length || 0}</span>
            </div>
            <div style={styles.metaItem}>
              <span>Total Entities:</span>
              <span>{document.processed_content?.entities?.length || 0}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "entities" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Extracted Entities</h2>
          <div>
            {document.processed_content?.entities.map((entity, index) => {
              const color = getEntityColor(entity.label);
              return (
                <span
                  key={index}
                  style={{
                    ...styles.entityTag,
                    backgroundColor: color.bg,
                    color: color.text,
                  }}
                >
                  {entity.text}
                  <small style={{ marginLeft: "4px", opacity: 0.7 }}>
                    {entity.label}
                  </small>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "sections" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Document Sections</h2>
          {document.processed_content?.sections.map((section, index) => (
            <div key={index} style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={{ fontWeight: "500", color: "#1e293b" }}>
                  {section.title}
                </h3>
                <span style={{ fontSize: "14px", color: "#64748b" }}>
                  {section.classification}
                </span>
              </div>
              <div style={styles.confidenceBar}>
                <div
                  style={{
                    ...styles.confidenceFill,
                    width: `${section.confidence_score * 100}%`,
                  }}
                />
              </div>
              <p style={{ marginTop: "12px", color: "#475569" }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
