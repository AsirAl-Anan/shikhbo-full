import { useEffect, useState } from 'react';

import instance from '../../utils/axios.js';
const axios = instance;
const AddSubjectMenu = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [chapters, setChapters] = useState([{ name: '', topics: [''] }]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('/admin/subject');
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddChapter = () => {
    setChapters([...chapters, { name: '', topics: [''] }]);
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleTopicChange = (chapterIndex, topicIndex, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].topics[topicIndex] = value;
    setChapters(updatedChapters);
  };

  const handleAddTopic = (chapterIndex) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].topics.push('');
    setChapters(updatedChapters);
  };

  const handleRemoveTopic = (chapterIndex, topicIndex) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].topics.splice(topicIndex, 1);
    setChapters(updatedChapters);
  };

  const handleRemoveChapter = (index) => {
    const updatedChapters = [...chapters];
    updatedChapters.splice(index, 1);
    setChapters(updatedChapters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', { name: subjectName, chapters });
    try {
      await axios.post('/admin/subject', { name: subjectName, chapters });
      setSubjectName('');
      setChapters([{ name: '', topics: [''] }]);
      fetchSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/subject/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    const subject = subjects.find((s) => s._id === id);
    setSubjectName(subject.name);
    setChapters(subject.chapters.map((chapter) => ({
      name: chapter.name,
      topics: chapter.topics
    })));
    // Optional: You can delete the old one immediately or add an 'update' feature separately.
    await handleDelete(id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Subject</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          required
        />

        {chapters.map((chapter, idx) => (
          <div key={idx} className="bg-gray-700 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Chapter Name"
                value={chapter.name}
                onChange={(e) => handleChapterChange(idx, 'name', e.target.value)}
                className="w-full p-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveChapter(idx)}
                className="ml-4 text-red-400 hover:text-red-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {chapter.topics.map((topic, topicIdx) => (
                <div key={topicIdx} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Topic Name"
                    value={topic}
                    onChange={(e) => handleTopicChange(idx, topicIdx, e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(idx, topicIdx)}
                    className="ml-2 text-red-400 hover:text-red-600 text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddTopic(idx)}
                className="mt-2 text-green-400 hover:text-green-600 text-sm"
              >
                + Add Topic
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddChapter}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
        >
          + Add Chapter
        </button>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
        >
          Save Subject
        </button>
      </form>

      <div className="mt-12 max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Existing Subjects</h2>
        {subjects.length === 0 ? (
          <p className="text-gray-400">No subjects added yet.</p>
        ) : (
          subjects.map((subject) => (
            <div key={subject._id} className="bg-gray-800 p-4 rounded-lg space-y-4 shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{subject.name}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(subject._id)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="pl-4 space-y-2">
                {subject.chapters.map((chapter, idx) => (
                  <div key={idx}>
                    <p className="text-lg font-semibold">{chapter.name}</p>
                    <ul className="list-disc list-inside text-gray-400">
                      {chapter.topics.map((topic, tIdx) => (
                        <li key={tIdx}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddSubjectMenu;
