import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const res = await axios.get('/api/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Create Subject
  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await axios.post('/api/subjects', { name });
      setName('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Subject
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
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
      await axios.put(`/api/subjects/${editingId}`, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
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

      {/* List of Subjects */}
      <div className="grid gap-4">
        {subjects.map((subject) => (
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
        ))}
      </div>
    </div>
  );
};

export default AddSubject;
