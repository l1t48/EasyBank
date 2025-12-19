import { useEffect, useState } from 'react';
import axios from 'axios';

function Backend_Test() {
    const [message, setMessage] = useState('Loading...');
    const VITE_API_Test = import.meta.env.VITE_API_Test;
    useEffect(() => {
        axios.get(VITE_API_Test)
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                setMessage('Error connecting to backend.');
                console.error(error);
            });
    }, []);

    return (
        <div className='w-full text-center text-2xl font-bold'>
            <p className='bg-purple-700 text-amber-50 p-5'>{message}</p>
        </div>
    );
}

export default Backend_Test;
