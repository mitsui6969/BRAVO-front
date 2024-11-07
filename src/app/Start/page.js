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
            const data = res.data;
            // 必要に応じてchoiceDataなどのセットが必要であればここで行います
        } catch (error) {
            console.error("データの取得でエラーが発生しました:", error);
        }
    };

    // ページが読み込まれる際にlocalStorageから進行状況を取得
    useEffect(() => {
        const savedChapter = parseInt(localStorage.getItem('unlockedChapter') || '1', 10);
        setUnlockedChapter(savedChapter); // 最大アンロック章の設定
        fetchData(); // データ取得関数の呼び出し
    }, []);

    // 章のクリア時にlocalStorageを更新
    const markChapterAsCleared = (chapter) => {
        const newUnlockedChapter = Math.max(chapter + 1, unlockedChapter);
        setUnlockedChapter(newUnlockedChapter);
        localStorage.setItem('unlockedChapter', newUnlockedChapter);
    };

    const handleChapterClick = async (targetChapter) => {
        if (targetChapter <= unlockedChapter || targetChapter === 1) { // 第1章は常にクリック可能
            try {
                // 前の章をクリア済みとして更新
                markChapterAsCleared(targetChapter);
                
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
