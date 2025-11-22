
import { useState } from 'react';

const LoginView = () => {

    const [key, setKey] = useState('');

    return (
        <div className='absolute bg-gray-500 w-screen h-screen left-0 top-0 flex flex-col items-center justify-around'>
            <div className='h-1/2 bg-blue-800 w-2/3'>
                <p>Login</p>
            </div>
            <div className='bg-blue-200  w-2/3'>
                <p>Create User</p>
            </div>
        </div>
    );

};

export default LoginView;
