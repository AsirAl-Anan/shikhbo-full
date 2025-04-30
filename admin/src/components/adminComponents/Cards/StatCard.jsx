import React from 'react';

const StatCard = ({ title, value, change, icon, changeColor, changeIcon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {icon}
      </div>
      <div className={`flex items-center mt-4 ${changeColor}`}>
        {changeIcon}
        <span className="text-sm ml-1">{change}</span>
      </div>
    </div>
  );
};

export default StatCard;