'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Story() {

    const [progress, setProgress] = useState(0); // ストーリの進み
    const [display, setDisplay] = useState(''); // 表示する台詞
    const [people, setPeople] = useState(null); // 喋るキャラクター
    const [chapterData, setChapterData] = useState(0);
    
    useEffect(() => {
        fetchStory();
    }, []);

    const fetchStory = async () => {
        try{
            const res = await axios.get('http://127.0.0.1:5000/story/3');
            setChapterData(res.data); // データ全体を保存
            setProgress(0); // 進捗を最初に戻す
            if (res.data.length > 0) {
                setDisplay(res.data[0].sentence); // 最初のセリフを表示
                setPeople(res.data[0].people); // 最初の話者を設定
            }
        } catch(error) {
            console.error("axiosのエラーが発生しました:", error);
        }
        
    };

    const handleNextSentence = () => {
        if (progress < chapterData.length - 1) {
            const nextProgress = progress + 1;
            setProgress(nextProgress);
            setDisplay(chapterData[nextProgress].sentence);
            setPeople(chapterData[nextProgress].people);
        } else {
            console.log("最後のセリフです"); // 最後のセリフに達したらメッセージを表示
        }
    };

    return (
        <div>
            <h1>Story</h1>
            <p><strong>話者 {people}:</strong> {display}</p>
            <button onClick={handleNextSentence}>次へ</button>
        </div>
    )
}

export default Story