import React, { useState, useEffect } from 'react';
import instance from '../../utils/axios.js';
const axios = instance; 
const AddSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Fetch all subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/subject');
      // Ensure subjects is always an array
      setSubjects(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch subjects');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Create Subject
  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await axios.post('/admin/subject', { name });
      setName('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setError('Failed to create subject');
    }
  };

  // Delete Subject
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/subject/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setError('Failed to delete subject');
    }
  };

  // Start Editing
  const startEditing = (subject) => {
    setEditingId(subject._id);
    setEditingName(subject.name);
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Update Subject
  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/subject/${editingId}`, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setError('Failed to update subject');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Subjects</h1>

      {/* Add Subject */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter Subject Name"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold"
        >
          Add
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 mb-4 bg-red-800 text-white rounded">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center p-4">Loading subjects...</div>
      ) : (
        /* List of Subjects */
        <div className="grid gap-4">
          {Array.isArray(subjects) && subjects.length > 0 ? (
            subjects.map((subject) => (
              <div
                key={subject._id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded shadow"
              >
                {editingId === subject._id ? (
                  <div className="flex gap-4 w-full">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 w-full"
                    />
                    <button
                      onClick={handleUpdate}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-lg font-medium">{subject.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(subject)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subject._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center p-6 bg-gray-800 rounded">
              No subjects available. Add your first subject above.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddSubject;