'use client'
import { useEffect, useState } from "react";
import React from 'react'
import axios from 'axios';

function Ending() {
    const [endData, setEndData] = useState(null);
    const [endTitle, setEndTitle] = useState('title');
    const [end, setEnd] = useState('content');

    useEffect(() => {
        fetchEnding();
    }, []);
    
    const fetchEnding = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/end');
            setEndData(res.data);
            console.log("受け取ったデータ:", res.data);

            const jsonData = res.data.json_file;
            const endId = res.data.end_id;

            if (jsonData && jsonData[endId]) {
                setEndTitle(jsonData[endId].title); // エンドタイトルを設定
                setEnd(jsonData[endId].content); // 詳細を設定
            } else {
                console.log("データが正しくありません:", res.data);
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