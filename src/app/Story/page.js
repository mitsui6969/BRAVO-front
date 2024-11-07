"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

function Story() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chapterParam = searchParams.get('chapter'); // クエリから現在の章を取得
    const [progress, setProgress] = useState(0); // ストーリーの進行
    const [display, setDisplay] = useState(''); // 表示する台詞
    const [people, setPeople] = useState(null); // 話者のキャラクター
    const [chapter, setChapter] = useState(1); // 現在の章
    const [chapterData, setChapterData] = useState(null); // 章のデータ
    const [choices, setChoices] = useState([]); // 選択肢のデータ
    const [choiceEnd, setChoiceEnd] = useState(null); // 選択肢の終わりのインデックス

    useEffect(() => {
        const initialChapter = chapterParam ? parseInt(chapterParam, 10) : 1;
        setChapter(initialChapter);
        fetchStory(initialChapter); // 初期章に基づいてストーリーデータを取得
    }, [chapterParam]);

    const fetchStory = async (currentChapter) => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/story/${currentChapter}`);
            setChapterData(res.data); // データ全体を保存
            setProgress(0); // 進捗をリセット
            setChoiceEnd(null); // 選択肢の範囲をリセット
            if (res.data.length > 0) {
                setDisplay(res.data[0].sentence); // 最初のセリフを表示
                setPeopleName(res.data[0].people); // 最初の話者を設定
            }
        } catch (error) {
            console.error("axiosのエラーが発生しました:", error);
        }
    };

    const setPeopleName = (peopleCode) => {
        switch (peopleCode) {
            case 0:
                setPeople("");
                break;
            case 1:
                setPeople("??");
                break;
            case 2:
                setPeople("グレンツェ");
                break;
            case 3:
                setPeople("ピーゲル");
                break;
            case 4:
                setPeople("トルテ");
                break;
            case 5:
                setPeople("欲望の王");
                break;
            case 6:
                setPeople("氷の女王");
                break;
            case 7:
                setPeople("トロイ");
                break;
            default:
                setPeople("");
                break;
        }
    };

    const handleNextSentence = () => {
        if (chapterData && progress < chapterData.length - 1) {
            const nextProgress = progress + 1;

            if (choiceEnd !== null && nextProgress > choiceEnd) {
                handleChapterCompletion();
                return;
            }

            setProgress(nextProgress);
            const nextSentence = chapterData[nextProgress];
            if (nextSentence.state && Array.isArray(nextSentence.sentence)) {
                setChoices(nextSentence.sentence); // 選択肢を設定
                setDisplay(''); // セリフの表示を空にする
            } else {
                setDisplay(nextSentence.sentence); // 通常のセリフを表示
                setChoices([]); // 選択肢をクリア
            }
            setPeopleName(nextSentence.people);

        } else if (chapterData) {
            handleChapterCompletion();
        }
    };

    const handleChoice = async (choice) => {
        const nextProgress = choice.start;
        setProgress(nextProgress);

        const nextSentence = chapterData[nextProgress];
        setDisplay(nextSentence.sentence);
        setPeopleName(nextSentence.people);
        setChoices([]);
        setChoiceEnd(choice.end);

        try {
            await axios.post('http://127.0.0.1:5000/story/save', {
                choice: choice.id,
                chapter: chapter,
            });
            console.log("選択が保存されました");
        } catch (error) {
            console.error("選択肢の保存でエラーが発生しました:", error);
        }
    };

    const handleChapterCompletion = () => {
        if (chapter === 4) {
            router.push("/Ending");
        } else {
            const nextChapter = chapter + 1;

            // 現在の章をクリア済みとして保存
            const maxUnlockedChapter = Math.max(
                nextChapter,
                parseInt(localStorage.getItem('unlockedChapter') || '1', 10)
            );
            localStorage.setItem('unlockedChapter', maxUnlockedChapter);

            // Startページに遷移
            router.push(`/Start?chapter=${nextChapter}`);
        }
    };

    return (
        <div>
            <h1>Story</h1>
            <p><strong>話者 {people}:</strong> {display}</p>
            {choices.length === 0 ? (
                <button onClick={handleNextSentence}>次へ</button>
            ) : (
                <div>
                    <h2>選択肢</h2>
                    {choices.map((choice) => (
                        <button key={choice.id} onClick={() => handleChoice(choice)}>
                            {choice.content}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Story;
