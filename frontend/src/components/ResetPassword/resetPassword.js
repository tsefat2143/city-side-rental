import { useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import "./resetPassword.css"

const ResetPassword = () => {
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const {token} = useParams();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({newPassword, confirmPassword})
      });

      const data = await res.json();
      setMessage(data.message || data.error)

      if (res.ok) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("Something went wrong")
    }
  };

  return (
    <div className="reset-password-wrapper">
        <div className="reset-password-div">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                {message && <p>{message}</p>}
                <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => {setPassword(e.target.value)}}/>
                <input type='password' placeholder='Confirm New Password' value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                <button type='submit'>Reset Password</button>
            </form>
        </div>
    </div>
  )
}

export default ResetPassword;