"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '/src/styles/story.css'

function Story() {
    const router = useRouter();

    const [progress, setProgress] = useState(0); // ストーリーの進行
    const [display, setDisplay] = useState(''); // 表示する台詞
    const [people, setPeople] = useState(null); // 話者のキャラクター
    const [peoplePic, setPeoplePic] = useState(''); // 表示する立ち絵
    const [chapter, setChapter] = useState(1); // 現在の章
    const [chapterData, setChapterData] = useState(null); // 章のデータ
    const [choices, setChoices] = useState([]); // 選択肢のデータ
    const [choiceEnd, setChoiceEnd] = useState(null); // 選択肢の終わりのインデックス
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchStory();
    }, [chapter]);

    const fetchStory = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:5000/story/${chapter}`);
            console.log("データ受け取り完了:", res.data);
            setChapterData(res.data); // データ全体を保存
            setProgress(0); // 進捗をリセット
            setChoiceEnd(null); // 選択肢の範囲をリセット

            if (res.data.length > 0) {
                setDisplay(res.data[0].sentence); // 最初のセリフを表示
                setSpeaker(res.data[0].people); // 話者を設定
            }
        } catch (error) {
            console.error("axiosのエラーが発生しました:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const setSpeaker = (speakerId) => {
        switch (speakerId) {
            case 0:
                setPeople("");
                setPeoplePic("");
                break;
            case 1:
                setPeople("??");
                setPeoplePic("");
                break;
            case 2:
                setPeople("グレンツェ");
                setPeoplePic("/character/Grenze.png");
                break;
            case 3:
                setPeople("ピーゲル");
                setPeoplePic("/character/piegel.png");
                break;
            case 4:
                setPeople("トルテ");
                setPeoplePic("/character/torte.png");
                break;
            case 5:
                setPeople("欲望の王");
                setPeoplePic("/character/king_desire.png");
                break;
            case 6:
                setPeople("氷の女王");
                setPeoplePic("/character/Queen_ice.png");
                break;
            case 7:
                setPeople("トロイ");
                setPeoplePic("/character/troy.png");
                break;
            default:
                setPeople("");
                setPeoplePic("");
                break;
        }
    };

    const handleNextSentence = () => {
        if (chapterData && progress < chapterData.length - 1) {
            const nextProgress = progress + 1;
            if (choiceEnd !== null && nextProgress > choiceEnd) {
                console.log("選択肢の終わりに達しました");
                if (chapter === 4) {
                    router.push("/Ending");
                } else {
                    setChapter(chapter + 1);
                }
                return;
            }

            setProgress(nextProgress);
            const nextSentence = chapterData[nextProgress];
            // setDisplay(nextSentence.sentence || '');
            // setChoices(nextSentence.state && Array.isArray(nextSentence.sentence) ? nextSentence.sentence : []);

            if (nextSentence.state && Array.isArray(nextSentence.sentence)) {
                setChoices(nextSentence.sentence); // 選択肢を設定
                setDisplay(''); // セリフの表示を空にする
            } else {
                setDisplay(nextSentence.sentence); // 通常のセリフを表示
                setChoices([]); // 選択肢をクリア
            }

            setSpeaker(nextSentence.people); // 次の話者に応じて立ち絵を更新
        } else if (chapterData) {
            console.log("最後のセリフです");
            if (chapter === 4) {
                router.push("/Ending");
            } else {
                setChapter(chapter + 1);
            }
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
    }

    return (
        <div className='StoryPage'>
            <div className='charaPic'>
                {peoplePic && <Image src={peoplePic} height={100} width={100} alt={`${people}の立ち絵`} />}
            </div>

            <div className='display-area'>
                <h3>{people}</h3>
                <p className='display-moji'>{display}</p>
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
        </div>
    );
}

export default Story;
