import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();

    const register = async () => {
        if (confirmPass === password) {
            try {
                const formData = { name, email, phone, password };
    
                const res = await axiosInstance.post("/user/register", formData);
                toast.success('Register success!')
                navigate('/login', { replace: true })
            } catch (err) {
                console.log(err.message);
                if (err?.response?.status === 400) {
                    toast.error(err?.response?.data?.msg)
                }
            }
        } else {
            toast.error('Passwords do not match');
        }
    }

    return ( 
        <div>
            <input type="text" placeholder="John Doe" onChange={(e) => setName(e.target.value)} required /><br />
            <input type="email" placeholder="johndoe@gmail.com" onChange={(e) => setEmail(e.target.value)} required /><br />
            <input type="phone" placeholder="077 334 5678" onChange={(e) => setPhone(e.target.value)} /><br />
            <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} required /><br />
            <input type="password" placeholder="confirm password" onChange={(e) => setConfirmPass(e.target.value)} required /><br />

            <button onClick={register}>Register</button>
        </div>
    );
}
 
export default Register;