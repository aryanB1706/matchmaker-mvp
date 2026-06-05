import React, { useState, useEffect } from 'react';
import { 
  X, User, Briefcase, Heart, MapPin, Star, Calendar, 
  MessageSquare, Save, Check, Loader2, BookOpen, AlertCircle,
  Clock, ArrowRight, Sparkles, AlertTriangle, Mail
} from 'lucide-react';

const CustomerDetailedView = ({ profile, onClose, onNotesSaved, onSelectProfile }) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Matching Logic state
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState('');

  // AI Intro Email state
  const [activeIntro, setActiveIntro] = useState(null); // stores { match, emailText }
  const [generatingIntroForId, setGeneratingIntroForId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [introError, setIntroError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Send Match Mock Action state
  const [sentMatchSuccess, setSentMatchSuccess] = useState(null); // stores matching info on success

  // Sync details when profile changes
  useEffect(() => {
    if (profile) {
      setNotes(profile.notes || '');
      setSaveSuccess(false);
      setSaveError('');
      setMatches([]);
      setActiveIntro(null);
      setIntroError('');
      setSentMatchSuccess(null);
      
      // Fetch compatible matches from backend matching logic
      const fetchMatches = async () => {
        setLoadingMatches(true);
        setMatchesError('');
        try {
          const res = await fetch(`/api/customers/${profile._id}/matches`);
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setMatches(data.data);
          } else {
            setMatchesError('Failed to fetch compatible matches.');
          }
        } catch (err) {
          console.error(err);
          setMatchesError('Connection to matching API failed.');
        } finally {
          setLoadingMatches(false);
        }
      };

      fetchMatches();
    }
  }, [profile]);

  if (!profile) return null;

  const isMale = profile.gender === 'Male';

  // Helper to calculate age
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Format height from cm to feet/inches
  const formatHeight = (cm) => {
    if (!cm) return 'N/A';
    const inchesTotal = cm / 2.54;
    const feet = Math.floor(inchesTotal / 12);
    const inches = Math.round(inchesTotal % 12);
    return `${cm} cm (${feet}'${inches}")`;
  };

  // Format income in LPA
  const formatIncome = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return `₹${(val / 100000).toFixed(1)} LPA`;
  };

  // Save notes to the database
  const handleSaveNotes = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/customers/${profile._id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);
        if (onNotesSaved) {
          onNotesSaved(data.data);
        }
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        setSaveError(data.message || 'Failed to save notes.');
      }
    } catch (err) {
      console.error(err);
      setSaveError('Could not save notes. Server connection lost.');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate intro email from AI agent
  const handleGenerateIntro = async (match) => {
    setIsLoading(true);
    setGeneratingIntroForId(match._id);
    setIntroError('');
    setActiveIntro(null);
    setCopySuccess(false);

    try {
      const res = await fetch(`/api/customers/${profile._id}/matches/${match._id}/intro`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setActiveIntro({
          match,
          emailText: data.email
        });
      } else {
        setIntroError(data.message || 'Failed to generate introduction email.');
      }
    } catch (err) {
      console.error(err);
      setIntroError('Could not connect to the generative AI server.');
    } finally {
      setGeneratingIntroForId(null);
      setIsLoading(false);
    }
  };

  // Copy email to clipboard
  const handleCopyClipboard = () => {
    if (activeIntro) {
      navigator.clipboard.writeText(activeIntro.emailText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Trigger mock email match action
  const handleSendMatch = (match) => {
    setSentMatchSuccess({
      name: `${match.firstName} ${match.lastName}`,
      gender: match.gender,
      age: calculateAge(match.dateOfBirth),
      city: match.city,
      designation: match.designation,
      company: match.currentCompany,
      status: match.status,
      email: match.email
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl z-10 border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col animate-scaleIn">
        
        {/* Modal Header */}
        <div className={`p-6 text-white flex justify-between items-start ${
          isMale 
            ? 'bg-gradient-to-r from-sky-500 to-indigo-600' 
            : 'bg-gradient-to-r from-pink-500 to-rose-600'
        }`}>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
              
              {/* Status Badge */}
              <span className="px-2.5 py-0.5 text-xs bg-white/20 border border-white/10 rounded-md font-bold tracking-wider uppercase flex items-center gap-1">
                {profile.status === 'Matched' && <Heart className="w-3.5 h-3.5 fill-white text-white" />}
                {profile.status === 'On Hold' && <Clock className="w-3.5 h-3.5 text-white" />}
                {profile.status === 'Searching' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                {profile.status}
              </span>

              <span className="px-2 py-0.5 text-xs bg-white/20 border border-white/10 rounded-md font-semibold tracking-wider uppercase">
                {profile.maritalStatus}
              </span>
            </div>
            <p className="text-white/80 text-sm mt-1">
              Profile ID: <code className="bg-white/10 px-1 py-0.5 rounded text-xs">{profile._id}</code>
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Header Banner Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Age & Gender</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {calculateAge(profile.dateOfBirth)} Years ({profile.gender})
              </span>
            </div>
            <div className="text-center border-l border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Height</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {formatHeight(profile.height)}
              </span>
            </div>
            <div className="text-center border-l border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Income</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {formatIncome(profile.income)}
              </span>
            </div>
            <div className="text-center border-l border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Diet Preference</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {profile.dietaryPreferences}
              </span>
            </div>
          </div>

          {/* Biodata grid columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <User className="w-4 h-4 text-rose-400" />
                Personal Info
              </h3>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-semibold text-slate-800 block">{profile.firstName} {profile.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                  <span className="font-semibold text-slate-800 block">
                    {new Date(profile.dateOfBirth).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Religion</span>
                  <span className="font-semibold text-slate-800 block">{profile.religion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Caste</span>
                  <span className="font-semibold text-slate-800 block">{profile.caste || 'Caste open'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Family Structure</span>
                  <span className="font-semibold text-slate-800 block">{profile.familyStructure} Family</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Siblings</span>
                  <span className="font-semibold text-slate-800 block">{profile.siblings} brother/sister(s)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-1">Languages Known</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.languagesKnown || []).map((lang, index) => (
                      <span key={index} className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/50 text-slate-700 rounded-md font-medium text-[10px]">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Career & Education */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Briefcase className="w-4 h-4 text-rose-400" />
                Career & Education
              </h3>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Undergraduate College</span>
                  <span className="font-semibold text-slate-800 block truncate" title={profile.undergraduateCollege}>{profile.undergraduateCollege || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Degree</span>
                  <span className="font-semibold text-slate-800 block">{profile.degree || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Current Company</span>
                  <span className="font-semibold text-slate-800 block truncate" title={profile.currentCompany}>{profile.currentCompany || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Designation</span>
                  <span className="font-semibold text-slate-800 block truncate" title={profile.designation}>{profile.designation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Annual Income</span>
                  <span className="font-semibold text-slate-800 block text-emerald-600 font-bold">{formatIncome(profile.income)}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle & Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Heart className="w-4 h-4 text-rose-400" />
                Lifestyle & Preferences
              </h3>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <a href={`mailto:${profile.email}`} className="font-semibold text-slate-800 hover:text-rose-500 transition-colors truncate block">{profile.email}</a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <a href={`tel:${profile.phoneNumber}`} className="font-semibold text-slate-800 hover:text-rose-500 transition-colors block">{profile.phoneNumber}</a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">City & Country</span>
                  <span className="font-semibold text-slate-800 block">{profile.city}, {profile.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Open to Relocate</span>
                  <span className={`font-semibold mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                    profile.openToRelocate === 'Yes' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : profile.openToRelocate === 'No'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {profile.openToRelocate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Want Kids</span>
                  <span className={`font-semibold mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                    profile.wantKids === 'Yes' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : profile.wantKids === 'No'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {profile.wantKids}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Open to Pets</span>
                  <span className={`font-semibold mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                    profile.openToPets === 'Yes' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : profile.openToPets === 'No'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {profile.openToPets}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Matchmaker Notes */}
            <div className="bg-slate-50 border border-slate-200/50 p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  Matchmaker Meeting Notes
                </h3>
                <p className="text-[11px] text-slate-400">Record quick call notes, family reviews, or match status notes.</p>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Spoke with mother on 5th June. Looking for matches within the Bangalore area only..."
                  className="w-full h-32 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Status messages & Save Button */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs">
                  {saveSuccess && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Notes saved successfully!
                    </span>
                  )}
                  {saveError && (
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {saveError}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 disabled:opacity-55 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Notes
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Section 5: Matching Logic (Potential Compatible Matches) */}
          <div className="border-t border-slate-100 pt-8 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Potential Compatible Matches ({matches.length})
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isMale 
                      ? "Algorithm: Opposite-gender matches who are younger, earn less, shorter, with matching views on kids."
                      : "Algorithm: Opposite-gender matches with professional alignment, matching values (diet/family style), and relocation preferences."
                    }
                  </p>
                </div>
              </div>
              
              <span className="text-[10px] text-slate-400 font-semibold self-start sm:self-center">
                Click a match card to inspect their profile
              </span>
            </div>

            {/* Error generating Intro */}
            {introError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {introError}
              </div>
            )}

            {loadingMatches ? (
              // Inline skeleton loading for matches
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 h-28 rounded-2xl p-4 space-y-3 animate-pulse">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-xl bg-slate-200"></div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-slate-200 rounded-md w-3/4"></div>
                        <div className="h-2 bg-slate-200 rounded-md w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-md w-full"></div>
                  </div>
                ))}
              </div>
            ) : matchesError ? (
              <div className="p-3 bg-amber-50 text-amber-700 text-xs border border-amber-200 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {matchesError}
              </div>
            ) : matches.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-slate-500 text-xs">
                No potential matches found meeting the exact matching logic criteria for {profile.firstName}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.slice(0, 6).map((match) => {
                  return (
                    <div
                      key={match._id}
                      onClick={() => {
                        if (onSelectProfile) {
                          onSelectProfile(match);
                        }
                      }}
                      className="group p-4 bg-slate-50 border border-slate-100 hover:border-pink-200/50 hover:bg-white rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        {/* Name and Tag */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-500 transition-colors">
                              {match.firstName} {match.lastName}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {calculateAge(match.dateOfBirth)} Yrs • {match.city}
                            </p>
                          </div>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            match.status === 'Searching'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : match.status === 'Matched'
                                ? 'bg-pink-50 text-pink-700 border border-pink-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {match.status}
                          </span>
                        </div>

                        {/* Professional details */}
                        <div className="text-[10px] text-slate-500 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{match.designation} at {match.currentCompany}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{match.religion} ({match.caste || 'Caste Open'})</span>
                          </div>
                        </div>
                      </div>

                      {/* Call to actions: AI Intro & Send Match */}
                      <div className="mt-3.5 flex gap-2 w-full">
                        {/* Draft AI Intro button */}
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid switching card profile
                            handleGenerateIntro(match);
                          }}
                          className="flex-1 py-1.5 bg-pink-50/50 hover:bg-pink-100 text-pink-600 disabled:opacity-50 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-pink-100/50"
                        >
                          {isLoading && generatingIntroForId === match._id ? (
                            '✨ Generating...'
                          ) : (
                            '✨ AI Intro'
                          )}
                        </button>

                        {/* Send Match mock action button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid switching card profile
                            handleSendMatch(match);
                          }}
                          className="flex-1 py-1.5 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-indigo-100/50"
                        >
                          <Mail className="w-3 h-3 text-indigo-500" />
                          Send Match
                        </button>
                      </div>

                      {/* Footer Info tags */}
                      <div className="flex justify-between items-center pt-2 mt-2.5 border-t border-slate-200/50 text-[10px] text-slate-600 font-semibold">
                        <span>{formatIncome(match.income)}</span>
                        <span>{match.height} cm</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

      {/* AI Intro Email Modal Overlay */}
      {activeIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setActiveIntro(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl z-10 border border-slate-100 p-6 flex flex-col space-y-4 animate-scaleIn">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500 fill-pink-100" />
                <h4 className="font-bold text-slate-800 text-sm">Personalized AI Match Intro</h4>
              </div>
              <button 
                onClick={() => setActiveIntro(null)} 
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-normal">
              Introducing <strong>{profile.firstName} {profile.lastName}</strong> to <strong>{activeIntro.match.firstName} {activeIntro.match.lastName}</strong> based on matching profile attributes:
            </p>

            <textarea
              readOnly
              value={activeIntro.emailText}
              className="w-full h-60 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-sans leading-relaxed focus:outline-none resize-none"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-400">
                {copySuccess ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </span>
                ) : (
                  `Copy template and send to ${activeIntro.match.firstName}`
                )}
              </span>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/10 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  Copy Intro Email
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIntro(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Match Success Modal Overlay */}
      {sentMatchSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSentMatchSuccess(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl z-10 border border-slate-100 p-6 flex flex-col items-center text-center space-y-4 animate-scaleIn">
            
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3px]" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">Match Sent Successfully!</h4>
              <p className="text-[11px] text-slate-500">
                A compatibility profile has been successfully dispatched to <strong>{profile.firstName} ({profile.email})</strong>.
              </p>
            </div>

            {/* Suggested match info block */}
            <div className="w-full bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-left text-xs space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Match Details</span>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800">{sentMatchSuccess.name}</span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-semibold text-slate-600">
                  {sentMatchSuccess.gender} • {sentMatchSuccess.age} Yrs
                </span>
              </div>
              
              <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/50">
                <p>📍 {sentMatchSuccess.city}</p>
                <p>💼 {sentMatchSuccess.designation} at {sentMatchSuccess.company}</p>
                <p>📬 {sentMatchSuccess.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSentMatchSuccess(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-98 transition-all duration-150 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDetailedView;
