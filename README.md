Here’s the updated `README.md` with an added section on how to install, create, and activate a virtual environment in the backend. Additionally, I’ve made some minor improvements for clarity and completeness:

---

# Legal Document Processing System

## Overview

The **Legal Document Processing System** is a web-based application designed to help legal professionals efficiently upload, analyze, and extract insights from legal documents such as contracts. The system leverages machine learning models to classify clauses, extract key information (like dates, names, and financial terms), and organize documents for easy search and retrieval.

### **Features:**

- **Document Upload:** Upload documents (PDF or Word) through the web interface.
- **Document Conversion:** Extracts plain text from uploaded documents while preserving structure.
- **Clause Classification:** Classifies document sections (e.g., Confidentiality, Termination, etc.).
- **Key Information Extraction:** Detects entities such as party names, dates, and financial terms.
- **Document Clustering:** Groups related documents based on semantic similarity.
- **Search & Filter:** Search documents by clause or keyword, and filter based on document type or date.
- **Structured Output & Reporting:** Export summary reports highlighting identified clauses and entities.

---

## Installation & Setup

### 1. **Clone the Repository**

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/legal-docs-system.git
cd legal-docs-system
```

---

### 2. **Backend Setup (API)**

#### 2.1 **Create and Activate a Virtual Environment**

It’s recommended to use a virtual environment to manage dependencies for the backend. Here’s how to set it up:

1. **Install `virtualenv`** (if not already installed):

   ```bash
   pip install virtualenv
   ```

2. **Create a virtual environment** in the `backend` directory:

   ```bash
   cd backend
   virtualenv venv
   ```

3. **Activate the virtual environment**:

   - On **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - On **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Deactivate the virtual environment** (when you’re done):

   ```bash
   deactivate
   ```

#### 2.2 **Install Backend Requirements**

With the virtual environment activated, install the necessary Python dependencies:

```bash
pip install -r requirements.txt
```

#### 2.3 **Set Up Environment Variables**

Create a `.env` file in the `backend` directory to define the MongoDB URL:

```env
DATABASE_URL=mongodb://127.0.0.1:27017/LEGAL
```

#### 2.4 **Run the Backend Server**

Start the backend server using:

```bash
uvicorn app.main:app --reload
```

This will start the backend API locally on `http://127.0.0.1:8000`.

---

### 3. **Frontend Setup (React App)**

#### 3.1 **Install Frontend Requirements**

Navigate to the frontend directory and install the necessary Node.js dependencies:

```bash
cd frontend
npm install
```

#### 3.2 **Set Up Environment Variables**

Create a `.env` file in the `frontend` directory to specify the backend API URL:

```env
REACT_APP_API_BASE_URL=https://your-ngrok-url.ngrok.io
```

Replace `https://your-ngrok-url.ngrok.io` with your actual ngrok URL.

#### 3.3 **Run the Frontend Server**

Start the React development server:

```bash
npm start
```

This will launch the frontend locally on `http://localhost:3000`.

---

### 4. **Expose Local Servers with Ngrok (Optional)**

If you want to expose both the frontend and backend to the public internet using **ngrok**, follow these steps:

#### 4.1 **Start Ngrok for Backend**

In a separate terminal window, run ngrok to expose the backend API:

```bash
ngrok http 8000
```

#### 4.2 **Start Ngrok for Frontend**

Run another ngrok tunnel for the frontend:

```bash
ngrok http 3000
```

This will give you a public URL for your frontend and backend, which you can replace in your `.env` files.

---

## How the Project Works

### **Document Upload & Processing**

1. **Users** (e.g., lawyers, paralegals) upload legal documents (PDF or Word) via the **frontend**.
2. The **backend** receives the document and uses libraries (like PyMuPDF) to **extract plain text** while preserving the document's structure and formatting.
3. The extracted text is then processed to identify meaningful sections using patterns, keywords, and regular expressions.

### **Clause Classification & Key Information Extraction**

1. **Machine learning models** (like LegalBERT) classify each section of the document (e.g., Confidentiality, Termination, etc.).
2. A **Named Entity Recognition (NER)** model extracts key information such as party names, dates, and financial terms.

### **Search & Filter**

- Users can **search for specific clauses or keywords** across documents.
- Filters allow searching by **document type**, **date range**, or specific **entities**.

### **Document Clustering**

- Documents are clustered based on their **semantic similarity**, grouping related contracts together (e.g., employment contracts, sales agreements).

### **Export & Reporting**

- The system generates downloadable reports that summarize:
  - **Clauses and entities** found in the documents.
  - **Missing or high-risk clauses** that need attention.

---

## Conclusion

This system enhances productivity for legal professionals by automating the extraction of valuable insights from legal documents, making contract review and analysis faster and more efficient.

---

## Troubleshooting

If you encounter any issues:

1. Make sure both frontend and backend servers are running.
2. Verify that the correct ngrok URLs are used in the `.env` files for both frontend and backend.
3. Check the browser console or backend logs for detailed error messages.
4. Ensure the virtual environment is activated when running the backend server.

---