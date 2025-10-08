
let style = {
    form: {
        backgroundColor: "black",
        height: "30vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    email: {
        padding: "1em",
        width: "40%",
        marginRight: "10px",
        borderRadius: "10px",
        fontSize: "1.1rem"
    },
    button: {
        padding: "1em",
        backgroundColor: "#3b82f6",
        borderRadius: "10px",
        fontSize: "1.1rem",
        border: "none",
        color: "white"
    }
}

const newsletter = () => {
  return (
    <div className="newsletter-div">
        <form style={style.form}>
            <input type="email" style={style.email} placeholder="Subscribe To Our Newsletter" />
            <button type="submit" style={style.button}>Submit</button>
        </form>
    </div>
  )
}

export default newsletter;