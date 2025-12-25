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
            <div className='max-w-3xl mx-auto mt-10 p-5 bg-[var(--nav-bg)] border rounded shadow-md text-[var(--nav-text-sec)]'>
                <h2 className='text-xl font-semibold mb-3 text-center'>About This Page</h2>
                <p className='mb-4'>
                    This page is designed to display the current state of the backend. Since the GitHub repository is private, the README file is not publicly available.
                    To facilitate faster and smoother testing, the following sample accounts are provided:
                </p>
                <ul className='list-disc list-inside space-y-1'>
                    <li>admin_account_1@gmail.com – Admin&account1</li>
                    <li>supervisor_account_1@gmail.com – Supervisor&account1</li>
                    <li>user_account_1@gmail.com – User&account1</li>
                    <li>user_account_2@gmail.com – User&account2</li>
                </ul>
            </div>
        </div>
    );
}

export default Backend_Test;
