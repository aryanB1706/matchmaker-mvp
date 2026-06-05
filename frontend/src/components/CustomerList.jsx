import React from 'react';
import { MapPin, Calendar, Heart, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const CustomerList = ({ customers, onSelectCustomer }) => {
  // Helper to calculate age
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Helper for Status Tag styling
  const getStatusTag = (status) => {
    switch (status) {
      case 'Matched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 border border-pink-100 text-pink-700 rounded-full text-xs font-bold shadow-xs">
            <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            Matched
          </span>
        );
      case 'On Hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-xs font-bold shadow-xs">
            <Clock className="w-3 h-3 text-amber-500" />
            On Hold
          </span>
        );
      case 'Searching':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs font-bold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Searching
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((profile) => {
        const isMale = profile.gender === 'Male';
        return (
          <div
            key={profile._id}
            onClick={() => onSelectCustomer(profile)}
            className="group relative bg-white border border-slate-100 hover:border-pink-200/60 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Gender indicator strip */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
              isMale ? 'from-sky-400 to-indigo-500' : 'from-pink-400 to-rose-500'
            } scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>

            <div className="space-y-4">
              {/* Header: Name, Age, Status */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  {/* Initials badge */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-transform duration-300 group-hover:scale-105 ${
                    isMale ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {profile.firstName.slice(0, 1)}{profile.lastName.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-rose-500 transition-colors">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isMale ? 'Male' : 'Female'} • {calculateAge(profile.dateOfBirth)} Yrs
                    </p>
                  </div>
                </div>

                {/* Status tag */}
                {getStatusTag(profile.status)}
              </div>

              {/* Middle details: City & Marital Status */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate font-medium">{profile.city}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[10px]">
                    {profile.maritalStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover visual cue */}
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold group-hover:text-rose-500 transition-colors">
              <span>View Matchmaking Profile</span>
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerList;
