import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  height: {
    type: Number, // in cm, e.g., 175
    required: [true, 'Height is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  undergraduateCollege: {
    type: String,
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  income: {
    type: Number, // Annual income in local currency/INR
    min: [0, 'Income cannot be negative']
  },
  currentCompany: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
    required: [true, 'Marital status is required'],
    enum: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']
  },
  languagesKnown: {
    type: [String],
    default: []
  },
  siblings: {
    type: Number,
    default: 0,
    min: [0, 'Siblings count cannot be negative']
  },
  caste: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    required: [true, 'Religion is required'],
    trim: true
  },
  wantKids: {
    type: String,
    enum: ['Yes', 'No', 'Maybe'],
    default: 'Maybe'
  },
  openToRelocate: {
    type: String,
    enum: ['Yes', 'No', 'Maybe'],
    default: 'Maybe'
  },
  openToPets: {
    type: String,
    enum: ['Yes', 'No', 'Maybe'],
    default: 'Maybe'
  },
  dietaryPreferences: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Eggetarian', 'Vegan', 'Jain'],
    required: [true, 'Dietary preference is required']
  },
  familyStructure: {
    type: String,
    enum: ['Joint', 'Nuclear'],
    required: [true, 'Family structure is required']
  },
  status: {
    type: String,
    enum: ['Searching', 'Matched', 'On Hold'],
    default: 'Searching'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
