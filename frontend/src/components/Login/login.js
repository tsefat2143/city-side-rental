import './login.css'

const login = () => {
  return (
    <div className="login-wrapper">
        <div className="login-div">
            <h2>Sign In</h2>
            <form>
                <input type="email" placeholder="Enter Your Email Address"/>
                <input type="password" placeholder="Enter Your Password"/>
                <button type="submit">Submit</button>
            </form>
            <p>Need To Register <span>Click Here</span></p>
        </div>
    </div>
  )
}

export default login