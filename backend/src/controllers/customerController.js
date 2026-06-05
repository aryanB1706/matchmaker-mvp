import Customer from '../models/Customer.js';
import OpenAI from 'openai';

// Initialize OpenAI SDK (using the Gemini compatibility layer)
const openai = process.env.GEMINI_API_KEY ? new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
}) : null;

// Helper to calculate age
const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Helper to format income in LPA
const formatIncome = (val) => {
  if (val === undefined || val === null) return 'N/A';
  return `₹${(val / 100000).toFixed(1)} LPA`;
};

// 1. Get all customer profiles with query filters
export const getCustomers = async (req, res) => {
  try {
    const { gender, city, religion, dietaryPreferences, maritalStatus, familyStructure, status } = req.query;
    const filter = {};

    if (gender) filter.gender = gender;
    if (city) filter.city = new RegExp(city, 'i');
    if (religion) filter.religion = new RegExp(religion, 'i');
    if (dietaryPreferences) filter.dietaryPreferences = dietaryPreferences;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    if (familyStructure) filter.familyStructure = familyStructure;
    if (status) filter.status = status;

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profiles',
      error: error.message
    });
  }
};

// 2. Get a single customer profile by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile',
      error: error.message
    });
  }
};

// 3. Update customer quick notes
export const updateCustomerNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { notes: notes || '' },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Notes updated successfully',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notes',
      error: error.message
    });
  }
};

// 4. Get compatible matches based on gender-specific matchmaking rules
export const getCustomerMatches = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const oppositeGender = customer.gender === 'Male' ? 'Female' : 'Male';
    const candidates = await Customer.find({ gender: oppositeGender });

    let matches = [];
    if (customer.gender === 'Male') {
      const maleAge = calculateAge(customer.dateOfBirth);
      matches = candidates.filter(c => {
        const femaleAge = calculateAge(c.dateOfBirth);
        return (
          femaleAge < maleAge &&
          c.income < customer.income &&
          c.height < customer.height &&
          c.wantKids === customer.wantKids
        );
      });
    } else {
      // Female customer matching rules: profession, values (dietary/family structure), relocation
      matches = candidates.filter(c => {
        const professionCompat = c.designation === customer.designation || c.currentCompany === customer.currentCompany;
        const valuesCompat = c.dietaryPreferences === customer.dietaryPreferences && c.familyStructure === customer.familyStructure;
        const relocateCompat = c.openToRelocate === customer.openToRelocate;
        return professionCompat && valuesCompat && relocateCompat;
      });
    }

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to find matches',
      error: error.message
    });
  }
};

// 5. Generate AI introduction email using Gemini SDK
export const generateAIIntro = async (req, res) => {
  try {
    const { id, matchId } = req.params;
    const customer = await Customer.findById(id);
    const match = await Customer.findById(matchId);

    if (!customer || !match) {
      return res.status(404).json({
        success: false,
        message: 'Customer or Match profile not found'
      });
    }

    const cAge = calculateAge(customer.dateOfBirth);
    const mAge = calculateAge(match.dateOfBirth);

    const cInfo = `
Name: ${customer.firstName} ${customer.lastName}
Gender: ${customer.gender}
Age: ${cAge} years
Height: ${customer.height} cm
Income: ${customer.income} INR annual
Current Company: ${customer.currentCompany}
Designation: ${customer.designation}
Marital Status: ${customer.maritalStatus}
Dietary Preferences: ${customer.dietaryPreferences}
Family Structure: ${customer.familyStructure}
Want Kids: ${customer.wantKids}
Open to Relocate: ${customer.openToRelocate}
Open to Pets: ${customer.openToPets}
Languages: ${customer.languagesKnown.join(', ')}
Undergraduate College: ${customer.undergraduateCollege}
Degree: ${customer.degree}
`;

    const mInfo = `
Name: ${match.firstName} ${match.lastName}
Gender: ${match.gender}
Age: ${mAge} years
Height: ${match.height} cm
Income: ${match.income} INR annual
Current Company: ${match.currentCompany}
Designation: ${match.designation}
Marital Status: ${match.maritalStatus}
Dietary Preferences: ${match.dietaryPreferences}
Family Structure: ${match.familyStructure}
Want Kids: ${match.wantKids}
Open to Relocate: ${match.openToRelocate}
Open to Pets: ${match.openToPets}
Languages: ${match.languagesKnown.join(', ')}
Undergraduate College: ${match.undergraduateCollege}
Degree: ${match.degree}
`;

    // Dynamic Fallback in case Gemini API is not initialized or fails
    const generateMockIntro = () => {
      const salutation = `Dear ${match.firstName},\n\n`;
      const introduction = `I hope you are doing well. I'm reaching out from Milan Matchmaking to introduce you to ${customer.firstName} ${customer.lastName}, who I think would be an exceptional match for you.\n\n`;
      
      let commonPoints = [];
      if (customer.dietaryPreferences === match.dietaryPreferences) {
        commonPoints.push(`your shared preference for a ${customer.dietaryPreferences} lifestyle`);
      }
      if (customer.familyStructure === match.familyStructure) {
        commonPoints.push(`your mutual alignment on a ${customer.familyStructure} family setup`);
      }
      if (customer.openToRelocate === 'Yes' && match.openToRelocate === 'Yes') {
        commonPoints.push(`your shared openness to relocate for the right partner`);
      }
      if (customer.wantKids === match.wantKids) {
        commonPoints.push(`your matching expectations about having children`);
      }
      if (customer.openToPets === match.openToPets) {
        commonPoints.push(`your identical comfort level regarding pets (${customer.openToPets})`);
      }
      if (customer.currentCompany === match.currentCompany || customer.designation === match.designation) {
        commonPoints.push(`your compatible careers as professionals in similar fields (${customer.designation})`);
      }

      let details = '';
      if (commonPoints.length > 0) {
        details = `We noticed a wonderful compatibility between you two, including ${commonPoints.slice(0, -1).join(', ')}${commonPoints.length > 1 ? ' and ' : ''}${commonPoints.slice(-1)}. `;
      } else {
        details = `${customer.firstName} is a talented ${customer.designation} at ${customer.currentCompany} who values family, lifestyle compatibility, and shares many of your core values. `;
      }

      const close = `With such strong alignments in your backgrounds and preferences, I would love to facilitate a quick connection. Please let me know if you would like me to set up an introductory call!\n\nWarm regards,\nThe Milan Matchmaking Team`;
      return salutation + introduction + details + close;
    };

    let introEmail = '';
    
    if (openai) {
      try {
        const prompt = `
Introduce candidate ${customer.firstName} ${customer.lastName} to ${match.firstName} ${match.lastName} based on their profile data.
Candidate 1 (Subject introducing):
${cInfo}
Candidate 2 (Recipient of email):
${mInfo}
Explain why they are a great fit based on their alignments (e.g. dietary preference, family setups, relocation alignment, pets, or careers). Address ${match.firstName} directly. Sign off as "The Milan Matchmaking Team".
`;
        const response = await openai.chat.completions.create({
          model: 'gemini-flash-latest',
          messages: [
            {
              role: 'system',
              content: 'You are an expert matchmaker. Strictly answer in 2 short sentences.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 60,
          temperature: 0.5
        });
        introEmail = response.choices[0].message.content;
      } catch (err) {
        console.warn('Gemini API call failed, using high-quality mock fallback:', err.message);
        introEmail = generateMockIntro();
      }
    } else {
      console.log('Gemini API Key missing, generating high-quality mock intro...');
      introEmail = generateMockIntro();
    }

    res.status(200).json({
      success: true,
      email: introEmail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate introduction email',
      error: error.message
    });
  }
};
