import { ArrowDownOS } from 'assets/icons';
import { useEffect, useRef, useState } from 'react';
import { localFlagHandler } from 'i18n/helpers';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './languageSelectorDropDown.scss';
import { useTranslation } from 'react-i18next';


interface NavbarProps {
    countryCode: string;
    setCountryCode: (prevCountryCode:string)=>void;
    loading: boolean;
}
const LanguageSelectorDropDown = () => {
    const { t, i18n } = useTranslation();
    const [countryCode, setCountryCode] = useState(i18n.resolvedLanguage || 'en')

    const navigate = useNavigate()

    const dispatch = useDispatch()
  
    // const getVisitorIp = async()=>{
    //   setLoading(true)
    //   try {
    //     const response = await fetch('https://api.ipify.org')
    //     const data   = await response.text()
    //     setIpAddress(data)
    //   } catch (error) {
    //     setLoading(false)
    //   }
    // }
  
    // const fetchIpInfo = async ()=>{
    //   try {
    //     const response = await fetch(`http://ip-api.com/json/${ipAddress}`)
    //     const data = await response.json()
    //     setGeoInfo(data)
    //     setLoading(false)
    //   } catch (error) {
    //     setCountryCode('EN');
    //     setLoading(false)
    //   }
    // }
    // useEffect(()=>{
    //   getVisitorIp()
    // },[])
  
    // useEffect(()=>{
    //   fetchIpInfo()
    //   if(geoInfo){
    //     setCountryCode(geoInfo?.countryCode)
    //   }
    // },[ipAddress])

    const [toggleLanguageSelector,setToggleLanguageSelector] = useState(false)
    const languageSelectorRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        setToggleLanguageSelector(false);
      }
    };

    const onLanguageChange = (lang = "EN") => {
        setCountryCode(lang)
        setToggleLanguageSelector(false)
        i18n.changeLanguage(lang.toLocaleLowerCase());
    };
    
    useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []);

    return (
        <div className='languageSelectorContainer'>
            <div className='languageButton' onClick={()=>setToggleLanguageSelector(!toggleLanguageSelector)}>
                <img src={localFlagHandler(countryCode.toLocaleLowerCase())} alt="" />
                <h2 className="text-white">{countryCode.toLocaleUpperCase()}</h2>
                <ArrowDownOS height="15" width="10"/>
            </div>
            
            <div ref={languageSelectorRef} className={`languageDropDownMenu ${toggleLanguageSelector ? 'showLanguageDropDown': 'closeLanguageDropDown'}`}>
                <div className='languageValue' onClick={()=>{
                    onLanguageChange('en')
                    }}>
                <img src={localFlagHandler('en')} alt="" />
                <h2>{t("languageEnglish")}</h2>
                </div>
                <div className='languageValue' onClick={()=>{
                    onLanguageChange('es')
                    }}>
                <img src={localFlagHandler('es')} alt="" />
                <h2>{t("languageSpanish")}</h2>
                </div>
                <div className='languageValue' onClick={()=>{
                    onLanguageChange('ja')

                }}>
                    <img src={localFlagHandler('ja')} alt="" />
                    <h2>{t("languageJapanese")}</h2>
                </div>
                <div className='languageValue' onClick={()=>{
                    onLanguageChange('ar')
                }}>
                    <img src={localFlagHandler('ar')} alt="" />
                    <h2>{t("languageArabic")}</h2>
                </div>
                <div className='languageValue' onClick={()=>{
                    onLanguageChange('hi')
                }}>
                <img src={localFlagHandler('hi')} alt="" />
                <h2>{t("languageHindi")}</h2>
                </div>
            </div>
        </div>
    );
}

export default LanguageSelectorDropDown;
