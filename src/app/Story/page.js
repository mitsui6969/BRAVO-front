"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '/src/styles/story.css'
import Button from '@/components/Button/Button';


function Story() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const chapterParam = parseInt(searchParams.get('chapter'), 10); // クエリから現在の章を取得
    const [progress, setProgress] = useState(0); // ストーリーの進行
    const [display, setDisplay] = useState(''); // 表示する台詞
    const [people, setPeople] = useState(null); // 話者のキャラクター
    const [peoplePic, setPeoplePic] = useState(''); // 表示する立ち絵
    const [peoplePosition, setPeoplePosition] = useState('left'); // 立ち絵位置
    const [chapter, setChapter] = useState(chapterParam || 1); // 現在の章
    const [chapterData, setChapterData] = useState(null); // 章のデータ
    const [choices, setChoices] = useState([]); // 選択肢のデータ
    const [choiceEnd, setChoiceEnd] = useState(null); // 選択肢の終わりのインデックス
    const [isLoading, setIsLoading] = useState(false);
    const [backgroundPic, setBackgroundPic] = useState(`/backImages/chapter${chapter}.png`); // 背景画像
    const [isFading, setIsFading] = useState(false); // フェードインアウト


    useEffect(() => {
        fetchStory();
        setBackgroundPic(`/backImages/chapter${chapter}.png`);
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
        let character = "";
        let characterPic = "";
        let position = "left"; // Default position

        switch (speakerId) {
            case 0:
                character = "";
                characterPic = "";
                break;
            case 1:
                character = "??";
                characterPic = "";
                break;
            case 2:
                character = "グレンツェ";
                characterPic = "/character/Grenze.png";
                position = "right"; // グレンツェのみ右
                break;
            case 3:
                character = "ピーゲル";
                characterPic = "/character/piegel.png";
                break;
            case 4:
                character = "トルテ";
                characterPic = "/character/torte.png";
                break;
            case 5:
                character = "欲望の王";
                characterPic = "/character/king_desire.png";
                break;
            case 6:
                character = "氷の女王";
                characterPic = "/character/Queen_ice.png";
                break;
            case 7:
                character = "トロイ";
                characterPic = "/character/troy.png";
                break;
            default:
                character = "";
                characterPic = "";
                break;
        }

        setPeople(character);
        setPeoplePic(characterPic);
        setPeoplePosition(position);
    };

    const handleNextSentence = () => {
        if (choices.length > 0) return;
        if (chapterData && progress < chapterData.length - 1) {
            const nextProgress = progress + 1;

            if (choiceEnd !== null && nextProgress > choiceEnd) {
                console.log("選択肢の終わりに達しました");
                if (chapter === 4) {
                    triggerFade(() => router.push("/Ending"));
                    // router.push("/Ending");
                } else {
                    triggerFade(() => setChapter(chapter+1));
                    // setChapter(chapter + 1);
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
                triggerFade(() => router.push("/Ending"));
                // router.push("/Ending");
            } else {
                triggerFade(() => setChapter(chapter+1))
                // setChapter(chapter + 1);
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
        setSpeaker(nextSentence.people)// 話者を設定
        setChoices([]); // 選択肢をクリア

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

    const triggerFade = (callback) => {
        setIsFading(true); // フェードアウト開始
        setTimeout(() => {
            callback();
            setIsFading(false); // フェードイン開始
        }, 500); // フェードアウト後の遅延時間（0.5秒）
    };


    return (
        <div className={`chapter-background-image ${isFading ? 'fade-out-in' : 'fade-in'}`}>
            <div className='StoryPage' onClick={handleNextSentence}>
                <div className='charaPic'>
                    {peoplePic && <Image src={peoplePic} height={380} width={380} className={`characters ${peoplePosition === "right" ? "right" : "left"}`} alt={`${people}の立ち絵`} />}
                
                {choices.length !== 0 && 
                        <div className='choices-area'>
                            {choices.map((choice) => (
                                <Button className='choiceBtn' key={choice.id} onClick={() => handleChoice(choice)}>
                                    {choice.content}
                                </Button>
                            ))}
                        </div>
                }
                </div>

                <div className='display-area'>
                    <h3 className='chara-name'>{people}</h3>
                    <p className='display-moji'>{display}</p>
                </div>
            </div>
            
            <Image src={backgroundPic} fill style={{ objectFit: "cover" }} className='backgound-pic-chapter' alt='backgroundpic'/>
        </div>
    );
}

export default Story;

