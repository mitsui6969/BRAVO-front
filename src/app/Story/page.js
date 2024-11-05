'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Story() {

    const [progress, setProgress] = useState(0); // ストーリーの進行
    const [display, setDisplay] = useState(''); // 表示する台詞
    const [people, setPeople] = useState(null); // 話者のキャラクター
    const [chapter, setChapter] = useState(3); // 現在の章
    const [chapterData, setChapterData] = useState(null); // 章のデータ
    const [choices, setChoices] = useState([]); // 選択肢のデータ
    const [choiceEnd, setChoiceEnd] = useState(null); // 選択肢の終わりのインデックス

    useEffect(() => {
        fetchStory();
    }, []);

    const fetchStory = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/story/${chapter}`);
            setChapterData(res.data); // データ全体を保存
            setProgress(0); // 進捗をリセット
            setChoiceEnd(null); // 選択肢の範囲をリセット
            if (res.data.length > 0) {
                setDisplay(res.data[0].sentence); // 最初のセリフを表示
                setPeople(res.data[0].people); // 最初の話者を設定
            }
        } catch (error) {
            console.error("axiosのエラーが発生しました:", error);
        }
    };

    const handleNextSentence = () => {
        // 範囲外であれば進行しない
        if (chapterData && progress < chapterData.length - 1) {
            const nextProgress = progress + 1;

            // 選択肢範囲の終わりに達した場合、進行を止める
            if (choiceEnd !== null && nextProgress > choiceEnd) {
                console.log("選択肢の終わりに達しました");
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

            setPeople(nextSentence.people); // 話者を更新
        } else if (chapterData) {
            console.log("最後のセリフです"); // 最後のセリフに達したらメッセージを表示
            setChapter(chapter + 1);
        }
    };

    const handleChoice = async(choice) => {
        console.log("選択肢:", choice.content);
        console.log("送信するデータ:", JSON.stringify({ choice: choice.id, chapter: chapter }));
        const nextProgress = choice.start;
        setProgress(nextProgress);

        const nextSentence = chapterData[nextProgress];
        setDisplay(nextSentence.sentence); // 選択肢に基づいたセリフを表示
        setPeople(nextSentence.people); // 話者を設定
        setChoices([]); // 選択肢をクリア

        // 選択肢の範囲（end）を設定
        setChoiceEnd(choice.end);

        try {
            const res = await fetch('http://127.0.0.1:5000/story/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ choice: choice.id, chapter: chapter }),
            });
            if (!res.ok) {
                throw new Error("Failed to save choice data");
            }
            console.log("選択が保存されました");
        } catch (error) {
            console.error("選択肢の保存でエラーが発生しました:", error);
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
