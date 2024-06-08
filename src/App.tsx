import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure Tailwind CSS is configured

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

const App: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState<Comment>({ id: 0, name: '', email: '', body: '' });

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/comments')
      .then(response => setComments(response.data.slice(0, 10))) // Limit to first 10 comments for simplicity
      .catch(error => console.error('Error fetching comments:', error));
  }, []);

  const handleSubmit = () => {
    if (form.id === 0) {
      axios.post('https://jsonplaceholder.typicode.com/comments', form)
        .then(response => setComments([...comments, response.data]))
        .catch(error => console.error('Error adding comment:', error));
    } else {
      axios.put(`https://jsonplaceholder.typicode.com/comments/${form.id}`, form)
        .then(response => setComments(comments.map(c => c.id === form.id ? response.data : c)))
        .catch(error => console.error('Error updating comment:', error));
    }
    setForm({ id: 0, name: '', email: '', body: '' });
  };

  const handleEdit = (comment: Comment) => setForm(comment);

  const handleDelete = (id: number) => {
    axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`)
      .then(() => setComments(comments.filter(comment => comment.id !== id)))
      .catch(error => console.error('Error deleting comment:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comments CRUD App</h1>
      
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Body"
          value={form.body}
          onChange={e => setForm({ ...form, body: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleSubmit}
        >
          {form.id === 0 ? 'Add Comment' : 'Update Comment'}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Comments List</h2>
      {comments.map(comment => (
        <div key={comment.id} className="border p-4 mb-2">
          <h3 className="text-lg font-bold">{comment.name}</h3>
          <p className="text-sm">{comment.email}</p>
          <p>{comment.body}</p>
          <button
            className="bg-red-500 text-white p-2 rounded mr-2"
            onClick={() => handleDelete(comment.id)}
          >
            Delete
          </button>
          <button
            className="bg-yellow-500 text-white p-2 rounded"
            onClick={() => handleEdit(comment)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
