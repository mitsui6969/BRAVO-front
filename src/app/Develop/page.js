// 参考コード 最終的に消す
"use client"
import { useState, useEffect } from 'react';

function Develop() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const res = await fetch('http://127.0.0.1:5000/items');
        const data = await res.json();
        console.log(data);
        setItems(data);
    };

    const addItem = async () => {
        if (!newItem) return;
        const res = await fetch('http://127.0.0.1:5000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem }),
        });
        const data = await res.json();
        fetchItems();
        setItems([...items, data]);
        setNewItem('');
    };

    const deletItem = async ( itemId ) => {
        const res = await fetch('http://127.0.0.1:5000/deletItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: itemId }),
        });
        const data = await res.json();
        setItems(items.filter(item => item.id !== itemId));
        setNewItem('');
    };

    return (
        <div>
        <h1>Next.js + Flask + SQLite</h1>
        <ul>
            {items.map((item) => (
            <li key={item.id}>
                {item.name}
                <button onClick={() => deletItem(item.id)}>Del</button>
            </li>
            ))}
        </ul>
        <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem}>Add Item</button>
        </div>
    );
}

export default Develop