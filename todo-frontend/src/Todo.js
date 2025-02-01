import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    const apiUrl = "http://localhost:8000";
    
    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => setTodos(res));
    };

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setError("Unable to create Todo item");
                }
            }).catch(() => setError("Unable to create Todo item"));
        }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    setTodos(todos.map((item) => item._id === editId ? { ...item, title: editTitle, description: editDescription } : item));
                    setEditId(-1);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setError("Unable to update Todo item");
                }
            }).catch(() => setError("Unable to update Todo item"));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl + '/todos/' + id, { method: "DELETE" })
                .then(() => setTodos(todos.filter((item) => item._id !== id)));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Mern ToDo App</h1>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex gap-2 mb-4">
                    <input placeholder="Title" className="border p-2 rounded w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input placeholder="Description" className="border p-2 rounded w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Add</button>
                </div>
                <ul className="space-y-3">
                    {todos.map((item) => (
                        <li key={item._id} className="bg-gray-200 p-3 rounded flex justify-between items-center">
                            {editId === item._id ? (
                                <div className="flex gap-2 w-full">
                                    <input className="border p-1 rounded w-full" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                    <input className="border p-1 rounded w-full" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                </div>
                            ) : (
                                <div>
                                    <p className="font-bold">{item.title}</p>
                                    <p>{item.description}</p>
                                </div>
                            )}
                            <div className="flex gap-2">
                                {editId === item._id ? (
                                    <>
                                        <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleUpdate}>Update</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => setEditId(-1)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(item)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(item._id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}