import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Customer from '../models/Customer.js';

dotenv.config();

const maleFirstNames = [
  "Aarav", "Aditya", "Amit", "Arjun", "Aniket", "Abhishek", "Anshul", "Akash", "Balaji", "Chetan",
  "Dev", "Deepak", "Dhruv", "Gaurav", "Ishaan", "Jay", "Jitendra", "Kabir", "Kartik", "Kunal",
  "Madhav", "Manish", "Mayank", "Nikhil", "Nitin", "Parth", "Pranav", "Rahul", "Raj", "Rohan",
  "Rishabh", "Rohit", "Sameer", "Sandeep", "Sanjay", "Shreyas", "Siddharth", "Sumit", "Tarun", "Udit",
  "Varun", "Vijay", "Vikas", "Vinay", "Vivek", "Yash", "Abhinav", "Harish", "Manoj", "Rakesh"
];

const femaleFirstNames = [
  "Aadya", "Aakanksha", "Aanchal", "Aditi", "Aishwarya", "Akshara", "Ananya", "Anjali", "Anusha", "Aparna",
  "Archana", "Avani", "Bhavna", "Deepika", "Divya", "Ekta", "Isha", "Ishita", "Jyoti", "Kavita",
  "Kirti", "Mansi", "Megha", "Neha", "Nidhi", "Nisha", "Pooja", "Prachi", "Priyanka", "Radhika",
  "Ritu", "Sakshi", "Shalini", "Shreya", "Shruti", "Sneha", "Sonali", "Swati", "Tanvi", "Tanya",
  "Upasana", "Vaishali", "Vandana", "Varsha", "Vidya", "Yashi", "Riya", "Meera", "Nikita", "Komal"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Patel", "Mehta", "Iyer", "Nair", "Reddy", "Rao", "Joshi",
  "Kulkarni", "Deshmukh", "Patil", "Singh", "Kumar", "Mishra", "Shukla", "Pandey", "Trivedi", "Bhat",
  "Chatterjee", "Sen", "Banerjee", "Das", "Choudhury", "Goel", "Bansal", "Garg", "Saxena", "Johri"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Gurgaon", "Noida"];
const colleges = [
  "IIT Bombay", "IIT Delhi", "BITS Pilani", "Delhi University", "Mumbai University", 
  "VIT Vellore", "SRM University", "Manipal Institute of Technology", "RV College of Engineering", 
  "St. Xavier's College", "Christ University", "SRCC Delhi"
];
const degrees = ["B.Tech", "B.E", "B.Sc", "B.Com", "BBA", "BCA", "BA", "MBBS", "BDS", "LLB"];
const companies = ["TCS", "Infosys", "Wipro", "Cognizant", "Google", "Amazon", "Microsoft", "Flipkart", "Paytm", "Zomato", "Deloitte", "EY"];
const designations = [
  "Software Engineer", "Senior Software Engineer", "Product Manager", "Analyst", 
  "Consultant", "Associate", "Project Manager", "Data Scientist", "Marketing Manager", "UX Designer"
];
const religions = ["Hindu", "Sikh", "Jain", "Christian", "Muslim", "Buddhist"];
const castesByReligion = {
  "Hindu": ["Brahmin", "Kshatriya", "Vaishya", "Kayastha", "Maratha", "Patel", "Rajput", "Yadav", "Nair", "Iyer", "Iyengar"],
  "Sikh": ["Jat", "Khatri", "Arora", "Ramgarhia"],
  "Jain": ["Oswal", "Agarwal", "Khandelwal", "Porwal"],
  "Christian": ["Roman Catholic", "Protestant", "Syrian Christian"],
  "Muslim": ["Sunni", "Shia"],
  "Buddhist": ["Neo-Buddhist", "Mahayana"]
};
const maritalStatuses = ["Never Married", "Never Married", "Never Married", "Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const wantKidsOptions = ["Yes", "No", "Maybe"];
const relocateOptions = ["Yes", "No", "Maybe"];
const petsOptions = ["Yes", "No", "Maybe"];
const dietaryPreferencesOptions = ["Veg", "Non-Veg", "Eggetarian", "Vegan", "Jain"];
const familyStructures = ["Nuclear", "Joint"];
const languages = ["English", "Hindi", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Punjabi", "Malayalam"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProfile = (index, gender) => {
  const isMale = gender === 'Male';
  const firstName = isMale ? maleFirstNames[index] : femaleFirstNames[index];
  const lastName = getRandomElement(lastNames);
  
  // Date of Birth: age 23 to 34 (based on 2026 current year)
  const age = getRandomNumber(23, 34);
  const birthYear = 2026 - age;
  const birthMonth = getRandomNumber(0, 11);
  const birthDay = getRandomNumber(1, 28);
  const dateOfBirth = new Date(Date.UTC(birthYear, birthMonth, birthDay));

  // Height (cm)
  const height = isMale ? getRandomNumber(165, 185) : getRandomNumber(150, 172);

  // Email (ensure unique)
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index + 1}@example.com`;

  // Phone (10-digit, start with 7, 8 or 9)
  const phoneNumber = `${getRandomNumber(7, 9)}${getRandomNumber(100000000, 999999999).toString().slice(0, 9)}`;

  // Religion and Caste
  const religion = getRandomElement(religions);
  const casteOptions = castesByReligion[religion] || ["General"];
  const caste = getRandomElement(casteOptions);

  // Income: 5 LPA to 45 LPA (in INR)
  const income = Math.round(getRandomNumber(500000, 4500000) / 50000) * 50000;

  // Languages known (2 to 4 languages)
  const knownLangs = new Set(["English"]); // Almost everyone in this segment knows English
  if (religion === "Sikh") knownLangs.add("Punjabi");
  
  const numLangs = getRandomNumber(2, 4);
  while (knownLangs.size < numLangs) {
    knownLangs.add(getRandomElement(languages));
  }

  // Status distribution: 70% Searching, 20% Matched, 10% On Hold
  const randStatus = Math.random();
  const status = randStatus < 0.7 ? 'Searching' : randStatus < 0.9 ? 'Matched' : 'On Hold';

  return {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    country: "India",
    city: getRandomElement(cities),
    height,
    email,
    phoneNumber,
    undergraduateCollege: getRandomElement(colleges),
    degree: getRandomElement(degrees),
    income,
    currentCompany: getRandomElement(companies),
    designation: getRandomElement(designations),
    maritalStatus: getRandomElement(maritalStatuses),
    languagesKnown: Array.from(knownLangs),
    siblings: getRandomNumber(0, 3),
    caste,
    religion,
    wantKids: getRandomElement(wantKidsOptions),
    openToRelocate: getRandomElement(relocateOptions),
    openToPets: getRandomElement(petsOptions),
    dietaryPreferences: getRandomElement(dietaryPreferencesOptions),
    familyStructure: getRandomElement(familyStructures),
    status
  };
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();

    console.log('Clearing existing customer profiles...');
    await Customer.deleteMany({});
    console.log('Database cleared.');

    const profiles = [];

    // Generate 50 Males and 50 Females
    for (let i = 0; i < 50; i++) {
      profiles.push(generateProfile(i, 'Male'));
      profiles.push(generateProfile(i, 'Female'));
    }

    console.log(`Generating and inserting ${profiles.length} customer profiles...`);
    
    const inserted = await Customer.insertMany(profiles);
    console.log(`Successfully seeded ${inserted.length} profiles!`);
    
    // Quick validation counts
    const maleCount = inserted.filter(p => p.gender === 'Male').length;
    const femaleCount = inserted.filter(p => p.gender === 'Female').length;
    console.log(`Stats - Male: ${maleCount}, Female: ${femaleCount}`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
