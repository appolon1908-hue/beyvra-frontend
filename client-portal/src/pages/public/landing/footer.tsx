import "./landing.scss";


const Footer = () => {
  return (
    <footer className="footersection">

        <div className="container">
            
            <div className="footer__container">
                <h1>TRADX</h1>

                <p>
                Tradx.io is an international broker that provides its users access to 100+ financial instruments on its platform.
                </p>

                <h4>Coderstra SRL</h4>
                <h4>#1-33-23663-1</h4>
                <h4>Av.lope de vega #13, Plaza Progreso 506 Santo Domingo</h4>
                <h4>Dominican Republic</h4>
               
            </div>
            
            <div className="footer__container margintop">

                <a href="/reg"><h4>Terms and Conditions</h4></a>
                <a href="/prv"><h4>Privacy Policy</h4></a>

            </div>

            <div className="footer__container">
                
            </div>

            <div className="footer__container">

                <ul data-test="footer-social" className="get__social">
                    
                    <li data-test="footer-social-twitter" className="social__item" data-ga="click/footer/socials/X">
                        <a className="href_url_params" href="#" title="X" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
                                <g fill="#fff" clip-path="url(#a)">
                                    <path fill-rule="evenodd" d="M28 2H12C6.477 2 2 6.477 2 12v16c0 5.523 4.477 10 10 10h16c5.523 0 10-4.477 10-10V12c0-5.523-4.477-10-10-10ZM12 0C5.373 0 0 5.373 0 12v16c0 6.627 5.373 12 12 12h16c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12H12Z" clip-rule="evenodd"></path>
                                    <path d="m21.7 18.72 6.069-7.053H26.33l-5.27 6.124-4.207-6.124H12l6.364 9.261L12 28.325h1.438l5.564-6.468 4.444 6.468H28.3l-6.6-9.605Zm-1.969 2.29-.645-.923-5.13-7.338h2.209l4.14 5.922.645.922 5.381 7.698h-2.208L19.73 21.01Z"></path>
                                </g>
                                <defs>
                                    <clipPath id="a">
                                        <path fill="#fff" d="M0 0h40v40H0z"></path>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </li>
                    
                    <li data-test="footer-social-facebook" className="social__item" data-ga="click/footer/socials/Facebook">
                        <a className="href_url_params" href="#" title="Facebook" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <g clip-path="url(#clip0_4683_7182)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 2H12C6.47715 2 2 6.47715 2 12V28C2 33.5228 6.47715 38 12 38H28C33.5228 38 38 33.5228 38 28V12C38 6.47715 33.5228 2 28 2ZM12 0C5.37258 0 0 5.37258 0 12V28C0 34.6274 5.37258 40 12 40H28C34.6274 40 40 34.6274 40 28V12C40 5.37258 34.6274 0 28 0H12Z" fill="white">
                                    </path>
                                    <path d="M21.6668 30.0005V21.1116H24.6298L25.3705 17.4079H21.6668V15.9264C21.6668 14.4449 22.409 13.7042 23.889 13.7042H25.3705V10.0005C24.6298 10.0005 23.7112 10.0005 22.4075 10.0005C19.6853 10.0005 17.9631 12.1346 17.9631 15.1857V17.4079H15.0001V21.1116H17.9631V30.0005H21.6668Z" fill="white">
                                    </path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_4683_7182">
                                        <rect width="40" height="40" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </li>

                    <li data-test="footer-social-instagram" className="social__item" data-ga="click/footer/socials/Instagram">
                        <a className="href_url_params" href="#" title="Instagram" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <g clip-path="url(#clip0_4683_7186)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 2H12C6.47715 2 2 6.47715 2 12V28C2 33.5228 6.47715 38 12 38H28C33.5228 38 38 33.5228 38 28V12C38 6.47715 33.5228 2 28 2ZM12 0C5.37258 0 0 5.37258 0 12V28C0 34.6274 5.37258 40 12 40H28C34.6274 40 40 34.6274 40 28V12C40 5.37258 34.6274 0 28 0H12Z" fill="white"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 29C24.9706 29 29 24.9706 29 20C29 15.0294 24.9706 11 20 11C15.0294 11 11 15.0294 11 20C11 24.9706 15.0294 29 20 29ZM20.0003 25.9998C23.314 25.9998 26.0003 23.3135 26.0003 19.9998C26.0003 16.6861 23.314 13.9998 20.0003 13.9998C16.6865 13.9998 14.0003 16.6861 14.0003 19.9998C14.0003 23.3135 16.6865 25.9998 20.0003 25.9998Z" fill="white"></path>
                                    <circle cx="31" cy="9" r="2" fill="white"></circle>
                                </g>
                                <defs>
                                    <clipPath id="clip0_4683_7186">
                                        <rect width="40" height="40" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </li>
                    
                    <li data-test="footer-social-youtube" className="social__item" data-ga="click/footer/socials/YouTube">
                        <a className="href_url_params" href="#" title="YouTube" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <g clip-path="url(#clip0_4683_7184)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 2H12C6.47715 2 2 6.47715 2 12V28C2 33.5228 6.47715 38 12 38H28C33.5228 38 38 33.5228 38 28V12C38 6.47715 33.5228 2 28 2ZM12 0C5.37258 0 0 5.37258 0 12V28C0 34.6274 5.37258 40 12 40H28C34.6274 40 40 34.6274 40 28V12C40 5.37258 34.6274 0 28 0H12Z" fill="white"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 11.9998C20.855 11.9998 21.732 12.0218 22.582 12.0578L23.586 12.1058L24.547 12.1628L25.447 12.2238L26.269 12.2878C27.161 12.356 28.0004 12.7367 28.6395 13.3628C29.2786 13.9889 29.6764 14.8203 29.763 15.7108L29.803 16.1358L29.878 17.0458C29.948 17.9888 30 19.0168 30 19.9998C30 20.9828 29.948 22.0108 29.878 22.9538L29.803 23.8638C29.79 24.0098 29.777 24.1508 29.763 24.2888C29.6764 25.1794 29.2784 26.0109 28.6391 26.637C27.9999 27.2631 27.1602 27.6437 26.268 27.7118L25.448 27.7748L24.548 27.8368L23.586 27.8938L22.582 27.9418C21.7218 27.9791 20.861 27.9985 20 27.9998C19.139 27.9985 18.2782 27.9791 17.418 27.9418L16.414 27.8938L15.453 27.8368L14.553 27.7748L13.731 27.7118C12.839 27.6435 11.9996 27.2628 11.3605 26.6367C10.7214 26.0106 10.3236 25.1792 10.237 24.2888L10.197 23.8638L10.122 22.9538C10.0455 21.9709 10.0048 20.9856 10 19.9998C10 19.0168 10.052 17.9888 10.122 17.0458L10.197 16.1358C10.21 15.9898 10.223 15.8488 10.237 15.7108C10.3235 14.8205 10.7212 13.9892 11.3601 13.3631C11.999 12.737 12.8381 12.3563 13.73 12.2878L14.551 12.2238L15.451 12.1628L16.413 12.1058L17.417 12.0578C18.2775 12.0204 19.1387 12.0011 20 11.9998ZM18 17.5748V22.4248C18 22.8868 18.5 23.1748 18.9 22.9448L23.1 20.5198C23.1914 20.4671 23.2673 20.3914 23.3201 20.3001C23.3729 20.2088 23.4007 20.1052 23.4007 19.9998C23.4007 19.8943 23.3729 19.7907 23.3201 19.6994C23.2673 19.6081 23.1914 19.5324 23.1 19.4798L18.9 17.0558C18.8088 17.0031 18.7053 16.9754 18.5999 16.9754C18.4945 16.9754 18.3911 17.0031 18.2998 17.0559C18.2086 17.1086 18.1329 17.1844 18.0802 17.2756C18.0276 17.3669 17.9999 17.4704 18 17.5758V17.5748Z" fill="white"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_4683_7184">
                                        <rect width="40" height="40" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </li>

                    <li data-test="footer-social-linkedin" className="social__item" data-ga="click/footer/socials/LinkedIn">
                        <a className="href_url_params" href="#" title="LinkedIn" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <g clip-path="url(#clip0_4683_7184)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 2H12C6.47715 2 2 6.47715 2 12V28C2 33.5228 6.47715 38 12 38H28C33.5228 38 38 33.5228 38 28V12C38 6.47715 33.5228 2 28 2ZM12 0C5.37258 0 0 5.37258 0 12V28C0 34.6274 5.37258 40 12 40H28C34.6274 40 40 34.6274 40 28V12C40 5.37258 34.6274 0 28 0H12Z" fill="white"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 14H8V29H11V14ZM9.5 12.5C8.67157 12.5 8 11.8284 8 11C8 10.1716 8.67157 9.5 9.5 9.5C10.3284 9.5 11 10.1716 11 11C11 11.8284 10.3284 12.5 9.5 12.5ZM14 14H17V16H17.03C17.8 15 19.1 14 21 14C24.5 14 27 16.3 27 20.5V29H24V21C24 19.4 22.9 18.5 21.5 18.5C20 18.5 19 19.5 19 21V29H16V14H14Z" fill="white"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_4683_7184">
                                        <rect width="40" height="40" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </li>

                </ul>
                
            </div>

        </div>

        <div className="rightreserved">
            <h4> <span >Tradx.io </span> | Owned and Controlled by Codestra.co
            2023 © Tradx.io, All Rights Reserved </h4>
        </div>

        
    </footer>
  );
};


export default Footer;
