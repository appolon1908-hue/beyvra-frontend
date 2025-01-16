import { Link } from 'react-router-dom'
import './notFound.scss'

const NotFoundPage = () => {
  return (
    <div className='notFoundPageContainer'>
        <h2>404</h2>
        <p>The page you are looking for is not found.</p>
        <Link to={'/'}>
          <button>Back to home</button>
        </Link>
    </div>
  )
}

export default NotFoundPage