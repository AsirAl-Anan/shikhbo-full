
import Cq from '../models/Cq.js';
import User from '../models/User.js'; // Assuming you have a User model

// Admin signin controller
export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find admin user
    const admin = await User.findOne({ email });
    
  

    

    res.status(200).json({ 
      success: true, 
      user: adminData 
    });
  } catch (error) {
    console.error('Admin signin error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Add new CQ controller
export const addCq = async (req, res) => {
  try {
    const {
      stem,
      a,
      b,
      c,
      d,
      board,
      year,
      subject,
      chapter,
      topic
    } = req.body;

    // Validate required fields
    if (!stem || !a?.question || !a?.answer || 
        !b?.question || !b?.answer || 
        !c?.question || !c?.answer || 
        !d?.question || !d?.answer || 
        !board || !year || !subject || !chapter || !topic) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new CQ
    const newCq = new Cq({
      stem,
      a,
      b,
      c,
      d,
      board,
      year,
      subject,
      chapter,
      topic
    });

    // Save to database
    await newCq.save();

    res.status(201).json({ 
      success: true, 
      message: 'Question added successfully',
      cq: newCq 
    });
  } catch (error) {
    console.error('Add CQ error:', error);
    res.status(500).json({ message: 'Server error while adding question' });
  }
};

// Get dashboard statistics controller
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts from database
    const userCount = await User.countDocuments();
    const questionCount = await Cq.countDocuments();

    res.status(200).json({
      userCount,
      questionCount
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};