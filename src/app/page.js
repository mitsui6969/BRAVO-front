"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../styles/home.css'; 

function Develop()  {
    const [showItems, setShowItems] = useState(false); 
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        if (showItems) {
            fetchItems();
        }
    }, [showItems]);

    const fetchItems = async () => {
        const res = await fetch('http://127.0.0.1:5000/items');
        const data = await res.json();
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
        fetchItems();
        setNewItem('');
    };

    const deleteItem = async (itemId) => {
        await fetch('http://127.0.0.1:5000/deleteItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: itemId }),
        });
        setItems(items.filter(item => item.id !== itemId));
    };

    return (
        <div className="container">
            <div className="titleContainer">
                <h1 className="title">グレンツェの旅</h1>
                <Link href={'/Start'}>
                    <button className="startButton">スタート</button>
                </Link>
            </div>
        </div>   
    );
}

export default Develop;
