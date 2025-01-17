import React from 'react';

export const EntityViewer = ({ entities }) => {
  const getEntityColor = (label) => {
    const colors = {
      PERSON: 'bg-blue-200',
      ORG: 'bg-green-200',
      DATE: 'bg-yellow-200',
      MONEY: 'bg-red-200',
      GPE: 'bg-purple-200',
    };
    return colors[label] || 'bg-gray-200';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Extracted Entities</h2>
      <div className="space-y-2">
        {entities.map((entity, index) => (
          <div
            key={index}
            className={`inline-block mr-2 mb-2 px-2 py-1 rounded ${getEntityColor(entity.label)}`}
          >
            <span className="font-medium">{entity.text}</span>
            <span className="text-xs ml-1 text-gray-600">({entity.label})</span>
          </div>
        ))}
      </div>
    </div>
  );
};