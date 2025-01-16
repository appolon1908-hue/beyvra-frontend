import React from 'react'
import "./header.scss"
import { Select } from 'antd'
import { DropdownIcon1 } from 'assets/icons'
import SearchBar from 'components/searchBar/SearchBar'
import { useTranslation } from 'react-i18next'
// import { DropdownIcon } from 'assets/icons'

const Header = () => {
  const {t} = useTranslation()
  const handleChange = () => {

  }
  return (
    <div className='expDateHeader'>
      <div>

        <h1>{t("expirationDate")}</h1>
     
        <p>{t("expirationDateTxt")}</p>
        <span>{t("cfd_total_asset")}: 491</span>
      </div>
      

      

    </div>
  )
}

export default Header