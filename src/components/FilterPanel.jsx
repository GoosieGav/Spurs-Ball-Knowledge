import React, { useState } from 'react';
import { categories, difficulties, quizTypes } from '../data/quizzes';

const FilterPanel = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleDifficultyChange = (difficulty) => {
    onFiltersChange({
      ...filters,
      difficulty: filters.difficulty === difficulty ? '' : difficulty
    });
  };

  const handleTypeChange = (type) => {
    onFiltersChange({
      ...filters,
      type: filters.type === type ? '' : type
    });
  };

  const handleSpeedToggle = () => {
    onFiltersChange({
      ...filters,
      speedOnly: !filters.speedOnly
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      difficulty: '',
      type: '',
      speedOnly: false
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.difficulty || filters.type || filters.speedOnly;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-spurs-navy hover:text-spurs-blue font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Speed Quiz Toggle */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.speedOnly}
                onChange={handleSpeedToggle}
                className="w-4 h-4 text-spurs-navy focus:ring-spurs-navy border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <span className="mr-2">⚡</span>
                Speed Quizzes Only
              </span>
            </label>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`filter-button ${
                    filters.categories.includes(category)
                      ? 'filter-button-active'
                      : 'filter-button-inactive'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyChange(difficulty)}
                  className={`filter-button ${
                    filters.difficulty === difficulty
                      ? 'filter-button-active'
                      : 'filter-button-inactive'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Type */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quiz Type</h4>
            <div className="flex flex-wrap gap-2">
              {quizTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`filter-button ${
                    filters.type === type
                      ? 'filter-button-active'
                      : 'filter-button-inactive'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
