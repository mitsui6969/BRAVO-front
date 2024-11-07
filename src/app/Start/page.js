"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/start.css';

const ChapterSelection = () => {
    const router = useRouter();
    const [unlockedChapter, setUnlockedChapter] = useState(1);

    // ページが読み込まれる際にlocalStorageから進行状況を取得
    useEffect(() => {
        const savedChapter = parseInt(localStorage.getItem('unlockedChapter') || '1', 10);
        setUnlockedChapter(savedChapter); // 最大アンロック章の設定
    }, []);

    const handleChapterClick = (targetChapter) => {
        if (targetChapter <= unlockedChapter) {
            router.push(`/Story?chapter=${targetChapter}`);
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
                        className={chapter <= unlockedChapter ? "unlocked" : "locked"}
                        disabled={chapter > unlockedChapter} // ロックされた章のボタンを無効化
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
