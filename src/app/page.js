"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Modal from 'react-modal';
import '../styles/home.css'; 
import Button from '@/components/Button/Button';

Modal.setAppElement("body");

function Home()  {
    const [choiceData, setChoiceData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        if (choiceData) {
            fetchData();
        }
    }, [choiceData]);

    // データ取得
    const fetchData = async () => {
        const res = await axios.get('http://127.0.0.1:5000/home');
        const data = await res.json();
        setChoiceData(data);
    };

    // データ削除
    const handleDeleteData = async () => {
        await axios.post('http://127.0.0.1:5000/home/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setChoiceData(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="titleContainer">
                <h1 className="title">グレンツェの旅</h1>

                <div className='home-button-component'>
                    <Link href={'/Start'}>
                        <Button className='start-button'>スタート</Button>
                    </Link>

                    <Button className='reset-button button-outline' onClick={() => setIsModalOpen(true)}>リセット</Button>
                </div>
                <Modal className='reset-modal' isOpen={isModalOpen}>
                    <h1 className='reset-font'>本当にリセットしますか？</h1>
                    <p className='reset-font'>リセットすると今までのデータは全て削除されます。</p>
                    <div className='reset-modal-buttons'>
                        <Button className='return-bun' onClick={() => setIsModalOpen(false)}>戻る</Button>
                        <Button className='reset-true-Butotn button-outline' onClick={handleDeleteData}>リセット</Button>
                    </div>
                </Modal>
            </div>
        </div>   
    );
}

export default Home;
