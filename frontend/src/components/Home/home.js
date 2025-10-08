import Banner from './Banner/banner'
import CallToAction from './CallToAction/CallToAction'
import Newsletter from './Newsletter/newsletter'
import Listings from './Listings/listings'

const Home = () => {
  return (
    <>
      <Banner/>
      <Listings/>
      <CallToAction/>
      <Newsletter/>
    </>
  )
}

export default Home