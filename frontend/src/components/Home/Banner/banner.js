import Apartment from '../../Images/apartment-building.jpg';
import './banner.css'

const banner = () => {
  return (
    <div className="home-wrapper">
        <div className="image-div">
            <img src={Apartment} alt="City Side Rentals Banner"/>
        </div>
        <div className="text-overlay">
            <h1>
              Welcome to Spotlight Estates <br/>
              Check Out Our Listings
            </h1>
        </div>
    </div>
  )
}

export default banner;