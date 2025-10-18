import './register.css'

const register = () => {
  return (
    <div className="register-wrapper">
        <div className="register-div">
            <h2>Create Account</h2>
            <form>
                <input type="text" placeholder="Enter Your Full Name"/>
                <input type="email" placeholder="Enter Your Email Address"/>
                <input type="password" placeholder="Create Password. Minimum of 8 characters"/>
                <input type="password" placeholder="Verify Password"/>
                <button type="submit">Submit</button>
            </form>
            <p>If You Have An Account <span>Click Here</span></p>
        </div>
    </div>
  )
}

export default register