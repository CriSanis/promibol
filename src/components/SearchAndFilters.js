import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setFilterCategory } from '../store/slices/artistsSlice';
import { setSearchTerm as setEventsSearchTerm, setFilterCategory as setEventsFilterCategory, setFilterDate as setEventsFilterDate } from '../store/slices/eventsSlice';

const SearchAndFilters = ({ type = 'artists' }) => {
  const dispatch = useDispatch();
  const { searchTerm, filterCategory, filterDate } = useSelector((state) => 
    type === 'artists' ? state.artists : state.events
  );

  const artistCategories = [
    'all', 'Música', 'Danza', 'Pintura', 'Artesanía', 'Literatura', 'Teatro'
  ];

  const eventCategories = [
    'all', 'Música', 'Danza', 'Pintura', 'Artesanía', 'Literatura', 'Teatro', 'Festival'
  ];

  const dateFilters = [
    { value: 'all', label: 'Todas las fechas' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'past', label: 'Pasados' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (type === 'artists') {
      dispatch(setSearchTerm(value));
    } else {
      dispatch(setEventsSearchTerm(value));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (type === 'artists') {
      dispatch(setFilterCategory(value));
    } else {
      dispatch(setEventsFilterCategory(value));
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (type === 'events') {
      dispatch(setEventsFilterDate(value));
    }
  };

  const categories = type === 'artists' ? artistCategories : eventCategories;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar {type === 'artists' ? 'artistas' : 'eventos'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={`Buscar ${type === 'artists' ? 'artistas' : 'eventos'}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por fecha (solo para eventos) */}
        {type === 'events' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <select
              value={filterDate}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
            >
              {dateFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Mostrar filtros activos */}
      {(searchTerm || filterCategory !== 'all' || (type === 'events' && filterDate !== 'all')) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => {
                    if (type === 'artists') {
                      dispatch(setSearchTerm(''));
                    } else {
                      dispatch(setEventsSearchTerm(''));
                    }
                  }}
                  className="ml-2 text-pink-600 hover:text-pink-800"
                >
                  ×
                </button>
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Categoría: {filterCategory}
                <button
                  onClick={() => {
                    if (type === 'artists') {
                      dispatch(setFilterCategory('all'));
                    } else {
                      dispatch(setEventsFilterCategory('all'));
                    }
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {type === 'events' && filterDate !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Fecha: {dateFilters.find(f => f.value === filterDate)?.label}
                <button
                  onClick={() => dispatch(setEventsFilterDate('all'))}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                if (type === 'artists') {
                  dispatch(setSearchTerm(''));
                  dispatch(setFilterCategory('all'));
                } else {
                  dispatch(setEventsSearchTerm(''));
                  dispatch(setEventsFilterCategory('all'));
                  dispatch(setEventsFilterDate('all'));
                }
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters; 