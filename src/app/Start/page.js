"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import '../../styles/start.css';

const ChapterSelection = () => {
    const router = useRouter();
    const [unlockedChapter, setUnlockedChapter] = useState(1); // 初期値を1に設定して第1章を必ず開始可能に

    // データ取得
    const fetchData = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/home');
            const datas = res.data;
            if (datas) {
                setUnlockedChapter(datas.length+1)
            }
            
        } catch (error) {
            console.error("データの取得でエラーが発生しました:", error);
        }
    };

    // ページが読み込まれる際にlocalStorageから進行状況を取得
    useEffect(() => {
        fetchData();
    }, [unlockedChapter]);


    const handleChapterClick = async (targetChapter) => {
        if (targetChapter <= unlockedChapter || targetChapter === 1) { // 第1章は常にクリック可能
            try {
                // ストーリーページに遷移
                router.push(`/Story?chapter=${targetChapter}`);
                
            } catch (error) {
                console.error("章のクリア時にエラーが発生しました:", error);
            }
        } else {
            alert("この章はまだロックされています。");
        }
    };

    return (
        <div className="container">
            <h2>Select a chapter to start</h2>
            <div className="buttonContainer">
                {[1, 2, 3, 4].map((chapter) => (
                    <button
                        key={chapter}
                        onClick={() => handleChapterClick(chapter)}
                        className={chapter <= unlockedChapter || chapter === 1 ? "unlocked" : "locked"} // 第1章は常に"unlocked"クラス
                        disabled={chapter > unlockedChapter && chapter !== 1} // 第1章以外はロックされる
                    >
                        第{chapter}章
                    </button>
                ))}
            </div>
            <Link href="/">
                <button className="backButton">戻る</button>
            </Link>
        </div>
    );
};

export default ChapterSelection;
