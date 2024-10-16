"use client"
import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000')
      .then(response => response.text())
      .then(data => setMessage(data))
  }, []);

  return (
    <div>
      <h1>Next.js + Flask</h1>
      <p>{message}</p>
    </div>
  );
}