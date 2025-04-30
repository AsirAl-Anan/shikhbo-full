import { useState , useEffect} from 'react';
import instance from '../../utils/axios';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex justify-between items-center z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">×</button>
    </div>
  );
};

const AddQuestion = () => {
  const initialFormState = {
    stem: '',
    a: { question: '', answer: '' },
    b: { question: '', answer: '' },
    c: { question: '', answer: '' },
    d: { question: '', answer: '' },
    board: 'Dhaka',
    year: '2024',
    subject: 'Physics 1st Paper',
    chapter: '',
    topic: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
 const [subjects, setSubjects] = useState([]);
  const boards = ['Dhaka', 'Rajshahi', 'Comilla', 'Chittagong', 'Barisal', 'Sylhet', 'Dinajpur', 'Mymensingh'];
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const years = [];
  for (let i = 2015; i <= 2024; i++) {
    years.push(i.toString());
  }
  const fetchSubjects = async () => {
    try{
      
      const res = await instance.get('/admin/subject');

      setSubjects(res.data);
    } catch (error) {
      
      console.error('Failed to fetch subjects:', error);
     }
   }
   useEffect(() => {
  fetchSubjects()
   }, []);
  console.log("s",subjects)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionChange = (option, field, value) => {
    setFormData(prev => ({
      ...prev,
      [option]: { ...prev[option], [field]: value }
    }));
    
    // Clear error if exists
    const errorKey = `${option}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };
 
  const validateForm = () => {
    const newErrors = {};
    
    // Validate stem
    if (!formData.stem.trim()) {
      newErrors.stem = 'Stem is required';
    }
    
    // Validate options
    ['a', 'b', 'c', 'd'].forEach(option => {
      if (!formData[option].question.trim()) {
        newErrors[`${option}.question`] = `Option ${option.toUpperCase()} question is required`;
      }
      if (!formData[option].answer.trim()) {
        newErrors[`${option}.answer`] = `Option ${option.toUpperCase()} answer is required`;
      }
    });
    
    // Validate chapter and topic
    if (!formData.chapter.trim()) {
      newErrors.chapter = 'Chapter is required';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
     const res= await instance.post('/admin/cq', formData);
      setToast({
        show: true,
        message: 'Question added successfully!',
        type: 'success'
      });
      console.log(res)
      setFormData(initialFormState);
    } catch (err) {
      console.error('Failed to add question:', err);
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to add question. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add New Question</h1>
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6">
        {/* Stem field */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2" htmlFor="stem">
            Stem <span className="text-red-500">*</span>
          </label>
          <textarea
            id="stem"
            name="stem"
            rows="3"
            value={formData.stem}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.stem ? 'border-red-500' : 'border-gray-600'
            }`}
          ></textarea>
          {errors.stem && <p className="text-red-500 text-sm mt-1">{errors.stem}</p>}
        </div>

        {/* Option fields */}
        {['a', 'b', 'c', 'd'].map((option) => (
          <div key={option} className="mb-6 border border-gray-700 rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Option {option.toUpperCase()}</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor={`${option}-question`}>
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`${option}-question`}
                value={formData[option].question}
                onChange={(e) => handleOptionChange(option, 'question', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors[`${option}.question`] ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors[`${option}.question`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`${option}.question`]}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2" htmlFor={`${option}-answer`}>
                Answer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`${option}-answer`}
                value={formData[option].answer}
                onChange={(e) => handleOptionChange(option, 'answer', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors[`${option}.answer`] ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors[`${option}.answer`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`${option}.answer`]}</p>
              )}
            </div>
          </div>
        ))}

        {/* Metadata fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="board">
              Board <span className="text-red-500">*</span>
            </label>
            <select
              id="board"
              name="board"
              value={formData.board}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {boards.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="year">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="subject">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
  id="subject"
  name="subject"
  value={formData.subject}
  onChange={handleInputChange}
  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
  {subjects?.map((subject) => (
    <option key={subject._id} value={subject.name}>
      {subject.name}
    </option>
  ))}
</select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="chapter">
              Chapter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="chapter"
              name="chapter"
              value={formData.chapter}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.chapter ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.chapter && <p className="text-red-500 text-sm mt-1">{errors.chapter}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2" htmlFor="topic">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.topic ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors duration-200"
        >
          {loading ? 'Submitting...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;