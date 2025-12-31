import { useEffect, useState } from 'react';
import { API } from "../../Services/APIs";
import Navbar from "../General-Componenets/Navbar";

function Backend_Test() {
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch(API.test.testBackend);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                setMessage('Error connecting to backend.');
            }
        };
        fetchMessage();
    }, []);

    return (
        <div className='w-full main-content mt-10'>
            <Navbar />
            <p className='text-center text-2xl font-bold bg-[var(--nav-bg)] text-[var(--nav-text-sec)] border-b border-t p-5'>
                {message}
            </p>
        </div>
    );
}

export default Backend_Test;
