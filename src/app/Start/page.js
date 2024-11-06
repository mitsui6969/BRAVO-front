"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../../styles/start.css';

const ChapterSelection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const unlockedChapterParam = searchParams.get('unlockedChapter'); // クエリから現在の章を取得
    const [unlockedChapter, setUnlockedChapter] = useState(1);

    // クエリパラメータから進行状況を設定
    useEffect(() => {
        if (unlockedChapterParam) {
            const chapterNumber = parseInt(unlockedChapterParam.replace('chapter_', ''), 10);
            setUnlockedChapter(chapterNumber);
        }
    }, [unlockedChapterParam]);

    const handleChapterClick = (targetChapter) => {
        //if (targetChapter <= unlockedChapter) {
            router.push(`/Story?page=chapter_${targetChapter}&unlockedChapter=chapter_${unlockedChapter}`);
        //} else {
        //    alert("この章はまだロックされています。");
        //}
    };

    return (
        <div className="container">
            <h2>開始する章を選んでください</h2>
            <div className="buttonContainer">
                {[1, 2, 3, 4].map((chapter) => (
                    <button
                        key={chapter}
                        onClick={() => handleChapterClick(chapter)}
                        className={chapter <= unlockedChapter ? "unlocked" : "locked"}
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

