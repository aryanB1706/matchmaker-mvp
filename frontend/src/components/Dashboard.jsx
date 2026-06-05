import React, { useState, useEffect } from 'react';
import { 
  LogOut, Search, RefreshCw, Heart, Users, Info, 
  DollarSign, ShieldAlert
} from 'lucide-react';
import CustomerList from './CustomerList';
import CustomerDetailedView from './CustomerDetailedView';

const Dashboard = ({ onLogout }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [religionFilter, setReligionFilter] = useState('All');
  const [dietFilter, setDietFilter] = useState('All');
  const [familyFilter, setFamilyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Selected Profile state
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch profiles from backend
  const fetchProfiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setCustomers(data.data);
        setFilteredCustomers(data.data);
      } else {
        setError(data.message || 'Failed to fetch matchmaking profiles.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter application
  useEffect(() => {
    let result = customers;

    // Search term (searches first name, last name, designation, company, college)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        (c.designation && c.designation.toLowerCase().includes(term)) ||
        (c.currentCompany && c.currentCompany.toLowerCase().includes(term)) ||
        (c.undergraduateCollege && c.undergraduateCollege.toLowerCase().includes(term))
      );
    }

    // Gender Filter
    if (genderFilter !== 'All') {
      result = result.filter(c => c.gender === genderFilter);
    }

    // Religion Filter
    if (religionFilter !== 'All') {
      result = result.filter(c => c.religion === religionFilter);
    }

    // Diet Filter
    if (dietFilter !== 'All') {
      result = result.filter(c => c.dietaryPreferences === dietFilter);
    }

    // Family Structure Filter
    if (familyFilter !== 'All') {
      result = result.filter(c => c.familyStructure === familyFilter);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    setFilteredCustomers(result);
  }, [searchTerm, genderFilter, religionFilter, dietFilter, familyFilter, statusFilter, customers]);

  // Callback to sync notes with backend updates
  const handleNotesSaved = (updatedCustomer) => {
    setCustomers(prev => prev.map(c => c._id === updatedCustomer._id ? updatedCustomer : c));
    setSelectedProfile(updatedCustomer);
  };

  // Format income in LPA
  const formatIncome = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return `₹${(val / 100000).toFixed(1)} LPA`;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setGenderFilter('All');
    setReligionFilter('All');
    setDietFilter('All');
    setFamilyFilter('All');
    setStatusFilter('All');
  };

  // Unique lists for dropdowns
  const uniqueReligions = Array.from(new Set(customers.map(c => c.religion))).filter(Boolean);

  // Statistics calculations
  const totalCount = customers.length;
  const maleCount = customers.filter(c => c.gender === 'Male').length;
  const femaleCount = customers.filter(c => c.gender === 'Female').length;
  const avgIncome = customers.length 
    ? Math.round(customers.reduce((acc, c) => acc + (c.income || 0), 0) / customers.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Milan Matchmaking</h1>
              <p className="text-xs text-slate-500 font-medium">Internal Portal — Admin Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchProfiles} 
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-rose-500' : ''}`} />
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-semibold flex items-center justify-center text-sm">
                AD
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Admin User</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Profiles</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : totalCount}</h3>
            </div>
          </div>

          {/* Card 2: Males */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-600 mr-0.5"></div>
              <span className="font-extrabold text-xs -ml-1">♂</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Male Profiles</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : maleCount}</h3>
            </div>
          </div>

          {/* Card 3: Females */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-600 mr-0.5"></div>
              <span className="font-extrabold text-xs -ml-1">♀</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Female Profiles</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : femaleCount}</h3>
            </div>
          </div>

          {/* Card 4: Avg Income */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Annual Income</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : formatIncome(avgIncome)}</h3>
            </div>
          </div>

        </section>

        {/* Filters and search panel */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search profiles by name, profession, company, or college..."
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || genderFilter !== 'All' || religionFilter !== 'All' || dietFilter !== 'All' || familyFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}

          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
            
            {/* Gender Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all duration-200"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Religion Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Religion</label>
              <select
                value={religionFilter}
                onChange={(e) => setReligionFilter(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all duration-200"
              >
                <option value="All">All Religions</option>
                {uniqueReligions.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            {/* Dietary Preference Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Dietary preference</label>
              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all duration-200"
              >
                <option value="All">All Diets</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain</option>
              </select>
            </div>

            {/* Family Structure Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Family Structure</label>
              <select
                value={familyFilter}
                onChange={(e) => setFamilyFilter(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all duration-200"
              >
                <option value="All">All Structures</option>
                <option value="Nuclear">Nuclear</option>
                <option value="Joint">Joint</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="Searching">Searching</option>
                <option value="Matched">Matched</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

          </div>
        </section>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800">
            <ShieldAlert className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Status Update</h4>
              <p className="text-xs mt-0.5 text-amber-700">{error}</p>
            </div>
          </div>
        )}

        {/* Profiles Customer List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">
              Profiles Listed ({filteredCustomers.length})
            </h2>
            <p className="text-xs text-slate-500">Click any card to inspect the full 25-field profile</p>
          </div>

          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white h-48 border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-200 rounded-md w-full"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xs text-center text-slate-500">
              <Info className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold">No matches found</p>
              <p className="text-xs mt-1">Try adjusting your keyword searches or filters.</p>
            </div>
          ) : (
            <CustomerList customers={filteredCustomers} onSelectCustomer={setSelectedProfile} />
          )}
        </section>
      </main>

      {/* Customer Detailed View Modal */}
      {selectedProfile && (
        <CustomerDetailedView 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
          onNotesSaved={handleNotesSaved} 
          onSelectProfile={setSelectedProfile}
        />
      )}
    </div>
  );
};

export default Dashboard;
