"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '/src/styles/story.css'


function Story() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const chapterParam = parseInt(searchParams.get('chapter'), 10); // クエリから現在の章を取得
    const [progress, setProgress] = useState(0); // ストーリーの進行
    const [display, setDisplay] = useState(''); // 表示する台詞
    const [people, setPeople] = useState(null); // 話者のキャラクター
    const [peoplePic, setPeoplePic] = useState(''); // 表示する立ち絵
    const [chapter, setChapter] = useState(chapterParam || 1); // 現在の章
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
            console.log("データ受け取り完了:", chapter);
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
        if (choices.length > 0) return;
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

    const handleChoice = async (choice) => {
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
            const res = await axios.post('http://127.0.0.1:5000/story/save', {
                choice: choice.id,
                chapter: chapter,
            });
            console.log("選択が保存されました");
        } catch (error) {
            console.error("選択肢の保存でエラーが発生しました:", error);
        }
        
    };


    return (
        <div className='StoryPage' onClick={handleNextSentence}>
            <div className='charaPic'>
                {peoplePic && <Image src={peoplePic} height={100} width={100} alt={`${people}の立ち絵`} />}
            
            {choices.length !== 0 && 
                    <div className='choices-area'>
                        <h2>選択肢</h2>
                        {choices.map((choice) => (
                            <button key={choice.id} onClick={() => handleChoice(choice)}>
                                {choice.content}
                            </button>
                        ))}
                    </div>
            }
        </div>

            <div className='display-area'>
                <h3 className='chara-name'>{people}</h3>
                <p className='display-moji'>{display}</p>
            </div>

        </div>
    );
}

export default Story;

