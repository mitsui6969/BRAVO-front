// 一番最初に表示される画面
"use client"
import { useState, useEffect } from 'react';

function Develop() {
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
        const data = await res.json();
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
        <div style={styles.container}>
            {!showItems ? (
                <div style={styles.titleContainer}>
                    <h1 style={styles.title}>グレンツェの旅</h1>
                    <button style={styles.startButton} onClick={() => setShowItems(true)}>
                        スタート
                    </button>
                </div>
            ) : (
                <div style={styles.listContainer}>
                    <ul style={styles.list}>
                        {items.map((item) => (
                            <li key={item.id} style={styles.listItem}>
                                {item.name}
                                <button style={styles.deleteButton} onClick={() => deleteItem(item.id)}>Del</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="？"
                        style={styles.input}
                    />
                    <button style={styles.addButton} onClick={addItem}>Add Item</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("/title.png")',  // publicフォルダ内にある背景画像(森の背景のやつ)
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        flexDirection: 'column',
    },
    titleContainer: {
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景を半透明
        padding: '20px',
        borderRadius: '10px',
    },
    title: {
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    startButton: {
        padding: '12px 30px',
        fontSize: '1.2rem',
        color: '#fff',
        backgroundColor: '#0070f3',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    listContainer: {
        width: '80%',
        maxWidth: '500px',
        textAlign: 'center',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #ddd',
    },
    deleteButton: {
        padding: '4px 8px',
        backgroundColor: '#ff4d4d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '20px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    addButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        marginTop: '10px',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};

export default Develop;