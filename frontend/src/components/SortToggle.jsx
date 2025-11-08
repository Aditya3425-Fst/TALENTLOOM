const SortToggle = ({ sort, onSortChange }) => {
  return (
    <div className="flex gap-2 glass rounded-xl p-1 border border-white/30">
      <button
        onClick={() => onSortChange('recent')}
        className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
          sort === 'recent'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
            : 'text-gray-700 hover:bg-white/50'
        }`}
      >
        Recent
      </button>
      <button
        onClick={() => onSortChange('votes')}
        className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
          sort === 'votes'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
            : 'text-gray-700 hover:bg-white/50'
        }`}
      >
        Most Voted
      </button>
    </div>
  );
};

export default SortToggle;
