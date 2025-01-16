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
    <div className='conditionHeader'>
      <div>

        <h1>{t("tradingConditions")}</h1>
     
        <p>{t("tradingConditinsTxt")}</p>
      </div>
      <div className='dropdown'>
        <Select 
        className='conditionSelection'
        onChange={handleChange}
        defaultValue="any"
        style={{minWidth: 190}}
        // suffixIcon={<DropdownIcon1 />}
        // popupClassName="assetsDropdown"

        options={[
          {value: "any", label: "Select Platform"}
        ]}
        />
        
        <Select 
        className='conditionSelection'
        onChange={handleChange}
        defaultValue="any"
        style={{minWidth: 190}}
        // suffixIcon={<DropdownIcon1 />}
        // popupClassName="assetsDropdown"

        options={[
          {value: "any", label: "Select Asset Category"}
        ]}
        />
        
      </div>

      <div className='searchCon'>
      <SearchBar className="setRadius"
              placeholder="Search by asset name"
              />


      </div>

    </div>
  )
}

export default Header