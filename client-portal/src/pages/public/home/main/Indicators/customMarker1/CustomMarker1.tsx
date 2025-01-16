import './customMarker1.scss'
const CustomMarker1 = () => {
  return (
    <div className='flex-container'>
    <div className="indicator-container">
      <div className="indicator-label-container">
        <div className='indicator-label'>
          <span className="label-text">$100</span>
          <div className='indicator-icon'>
            <svg width="22px" height="29px" viewBox="0 0 190.00 190.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" transform="rotate(0)">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M96.207 95.3649L51.967 142.36L39.391 129.784L85.168 85.1059L57.322 88.0569L56.98 71.8369L107.371 72.8129L110.609 124.815L94.332 125.173L96.207 95.3649Z" fill="#ffffff"></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="solid-line"></div>
      <div className="dashed-line"></div>
    </div>
  </div>
  )
}

export default CustomMarker1