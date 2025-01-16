import React from 'react'
import "./header.scss"
import { Select } from 'antd'
import { DropdownIcon1 } from 'assets/icons'
import SearchBar from 'components/searchBar/SearchBar'
import { useTranslation } from 'react-i18next'
// import { DropdownIcon } from 'assets/icons'

const Header = () => {
  const {t}=  useTranslation()
  const handleChange = () => {

  }
  return (
    <div className='cfdAssetHeader'>
      <div>

        <h1>{t("cfdAssetList")}</h1>
     
        <p>{t("cfDAssetListTxt")}</p>
        <span>{t("cfd_total_asset")}: 491</span>

      </div>
      <div className='dropdown'>
              
      </div>

     
    </div>
  )
}

export default Header