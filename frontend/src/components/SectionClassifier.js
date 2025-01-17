import React from 'react';

export const SectionClassifier = ({ sections }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Document Sections</h2>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="border rounded p-4">
            <h3 className="font-bold text-lg">{section.title}</h3>
            <div className="text-sm text-gray-600 mb-2">
              Classification: {section.classification} 
              (Confidence: {Math.round(section.confidence_score * 100)}%)
            </div>
            <p className="text-gray-800">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};