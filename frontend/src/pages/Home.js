import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "../components/FileUpload";
import { listDocuments, searchDocuments } from "../api/apiClient";

const Home = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (result) => {
    loadDocuments();
    navigate(`/results/${result.id}`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDocuments();
      return;
    }

    try {
      setLoading(true);
      const results = await searchDocuments(
        searchQuery,
        searchType || undefined
      );
      setDocuments(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
    },
    content: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "40px",
      color: "#1e293b",
      textAlign: "center",
    },
    section: {
      marginBottom: "40px",
      padding: "24px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#334155",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    searchContainer: {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
    },
    searchInput: {
      flex: "1",
      padding: "12px 16px",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
      outline: "none",
    },
    select: {
      padding: "12px 16px",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      backgroundColor: "white",
      cursor: "pointer",
      fontSize: "16px",
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "background-color 0.3s ease",
    },
    // loadingText: {
    //   textAlign: "center",
    //   padding: "40px 0",
    //   color: "#64748b",
    //   fontSize: "18px",
    // },
    // emptyText: {
    //   textAlign: "center",
    //   padding: "40px 0",
    //   color: "#64748b",
    //   fontSize: "16px",
    // },
    documentsSection: {
      marginBottom: "32px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      padding: "24px",
    },
    documentsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "16px",
      borderBottom: "1px solid #eaeaea",
    },
    // sectionTitle: {
    //   fontSize: '22px',
    //   fontWeight: '600',
    //   color: '#2d3748',
    //   margin: 0
    // },
    documentCount: {
      fontSize: "14px",
      color: "#718096",
      fontWeight: "500",
    },
    documentGrid: {
      display: "grid",
      gap: "16px",
    },
    documentCard: {
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      position: "relative",
      overflow: "hidden",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    cardTitleContainer: {
      flex: "1",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1a202c",
      marginBottom: "6px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    documentIcon: {
      width: "20px",
      height: "20px",
      display: "inline-block",
      marginRight: "8px",
      color: "#4a5568",
    },
    cardType: {
      fontSize: "14px",
      color: "#718096",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    cardDate: {
      fontSize: "13px",
      color: "#a0aec0",
      fontWeight: "500",
      backgroundColor: "#f7fafc",
      padding: "4px 8px",
      borderRadius: "4px",
    },
    cardStats: {
      display: "flex",
      gap: "16px",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #f0f0f0",
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      color: "#718096",
    },
    statLabel: {
      fontWeight: "500",
    },
    statValue: {
      color: "#2d3748",
      fontWeight: "600",
    },
    loadingText: {
      textAlign: "center",
      padding: "40px 0",
      color: "#718096",
      fontSize: "16px",
    },
    emptyText: {
      textAlign: "center",
      padding: "40px 0",
      color: "#718096",
      fontSize: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
    },
    emptyIcon: {
      fontSize: "24px",
      color: "#cbd5e0",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Legal Document Processing System</h1>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Upload New Document</h2>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Search Documents</h2>
          <div style={styles.searchContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              style={styles.searchInput}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={styles.select}
            >
              <option value="">All Types</option>
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="policy">Policy</option>
            </select>
            <button
              onClick={handleSearch}
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              Search
            </button>
          </div>
        </div>

        <div style={styles.documentsSection}>
          <div style={styles.documentsHeader}>
            <h2 style={styles.sectionTitle}>Recent Documents</h2>
            <span style={styles.documentCount}>
              {documents.length}{" "}
              {documents.length === 1 ? "Document" : "Documents"}
            </span>
          </div>

          {loading ? (
            <div style={styles.loadingText}>Loading documents...</div>
          ) : documents.length === 0 ? (
            <div style={styles.emptyText}>
              <span style={styles.emptyIcon}>📄</span>
              <span>No documents found. Upload a document to get started.</span>
            </div>
          ) : (
            <div style={styles.documentGrid}>
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  style={styles.documentCard}
                  onClick={() => navigate(`/results/${doc._id}`)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.borderColor = "#cbd5e0";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitleContainer}>
                      <h3 style={styles.cardTitle}>
                        <span style={styles.documentIcon}>📄</span>
                        {doc.title}
                      </h3>
                      <p style={styles.cardType}>Type: {doc.document_type}</p>
                    </div>
                    <span style={styles.cardDate}>
                      {formatDate(doc.upload_date)}
                    </span>
                  </div>

                  {doc.processed_content && (
                    <div style={styles.cardStats}>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Sections:</span>
                        <span style={styles.statValue}>
                          {doc.processed_content.sections?.length || 0}
                        </span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Entities:</span>
                        <span style={styles.statValue}>
                          {doc.processed_content.entities?.length || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
