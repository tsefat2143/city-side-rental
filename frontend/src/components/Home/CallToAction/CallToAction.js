import Indoor from '../../Images/indoor.jpg';
import './CallToAction.css'

const CallToAction = () => {
  return (
    <div className="CTA-wrapper">
      <div className="image-div">
        <img src={Indoor} alt="indoor"/>
      </div>
      <div className="text-overlay">
        <h2>Search. Save. Sell. Everything you need in one place</h2>
        <button>Register Today</button>
      </div>
    </div>
  )
}

export default CallToAction