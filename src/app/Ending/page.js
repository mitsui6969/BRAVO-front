'use client'
import { useEffect, useState } from "react";
import React from 'react'
import axios from 'axios';

function Ending() {
    const [endTitle, setEndTitle] = useState('title');
    const [end, setEnd] = useState('content');

    useEffect(() => {
        fetchEnding();
    }, []);
    
    const fetchEnding = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/story/3');
            setChapterData(res.data);
            if (res.data.length > 0) {
                setEndTitle(res.data[0].title); // エンドタイトルを設定
                setEnd(res.data[0].content); // 詳細を設定
            }
        } catch (error) {
            console.error("axiosのエラーが発生しました:", error);
        }
    };

    return (
        <div>
            <h1>Ending</h1>
            <h2>{endTitle}</h2>
            <p>{end}</p>
        </div>
    )
}

export default Ending