'use client'
import { useEffect, useState } from "react";
import React from 'react'
import axios from 'axios';
import '../../styles/ending.css'
import Button from "@/components/Button/Button";
import Link from "next/link";

function Ending() {
    const [endData, setEndData] = useState(null);
    const [endTitle, setEndTitle] = useState('title');
    const [end, setEnd] = useState('content');
    const [endID, setEndID] = useState(null);
    const [isFadingIn, setIsFadingIn] = useState(false);

    useEffect(() => {
        setIsFadingIn(true); // フェードインをトリガー
        fetchEnding();
    }, []);
    
    const fetchEnding = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/end');
            setEndData(res.data);
            console.log("受け取ったデータ:", res.data);

            const jsonData = res.data.json_file;
            const endId = res.data.end_id;

            setEndID(endId + 1);

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
        <div className={`end-component ${isFadingIn ? 'fade-in' : ''}`}>
            <div className="end-contens">
                <h2 className="end-id">End:{endID}</h2>
                <h1 className="end-title">{endTitle}</h1>
                <p className="end-data">{end}</p>

                <Link href={'/'}>
                    <Button className='end-to-home'>ホームへ</Button>
                </Link>
            </div>
        </div>
    )
}

export default Ending