import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import './portfolioModal.scss'
import ProfileModal from 'components/profileModal';
import Trading from './trading/Trading';
import VerificationPage from './verification/VerificationPage';
import Settings from './settings/Settings';
import useKyc from 'api/kyc/useKycInfo';
import { useCookies } from 'react-cookie';
import { IUserKYCProps } from '@interfaces';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setPortfolioWindow } from '@store/slices/app';
import useLogout from 'hooks/useLogout';
import PortfolioSideBar from './sidebar/SideBar';
import Password from './password';
import IKYC from '@interfaces/IKYC';
import MenuListCard from 'components/menuListCard/MenuListCard';
import { ExitIcon } from 'assets/icons';


interface PortfolioModalProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRightDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRightSubDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>

}

const getTitle = (name: string): string => {
  switch (name) {
    case "personal_info":
      return "Personal Information";
    case "verification":
      return "Verification";
    case "portfolio":
      return "Portfolio";
    case "password":
      return "Password";
    case "trading":
      return "Trading";
    case "setting":
      return "Settings";
    default:
      return "Unknown";
  }
};

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isModalOpen, setModalOpen, setIsRightDrawerOpen, setIsRightSubDrawerOpen }) => {
  const [userProfile, setUserProfile] = useState<IUserKYCProps>()
  const [kycInfo, setKycInfo] = useState<string>("F")
  const dispatch = useAppDispatch()

  const { logout } = useLogout()
  const handleLogout = () => { void logout(); };

  const [selectedNav, setSelectedNav] = useState("personal_info")
  const [cookies] = useCookies(["access_token"])
  const handlePortfolioNavigation = () => {
    dispatch(setPortfolioWindow(true));
    setModalOpen(false)
    setIsRightSubDrawerOpen(false)
    setIsRightDrawerOpen(false)

  }

  const { mutate, data, isPending } = useKyc({
    onSuccess: (data) => {
      console.log('@@###', data);

      setKycInfo(data?.results[0]?.status || 'F');
    },
    onError: () => {

    }
  })


  useEffect(() => {
    mutate({
      token: cookies.access_token
    })
  }, [cookies.access_token, mutate])





  const sideItems = [
    { name: "personal_info", label: "Personal", component: <ProfileModal userKyc={kycInfo} /> },
    { name: "trading", label: "Trading", component: <Trading /> },
    { name: "setting", label: "Settings", component: <Settings /> },
  ]

  return (
    <>
      <Modal
        rootClassName='portfolioProfileModal'
        open={isModalOpen}
        title={getTitle(selectedNav)}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={null}
        maskClosable={true}
        centered
      >
        <div className='portfolioWrapper'>
          <PortfolioSideBar
            sideItems={sideItems}
            handlePortfolio={handlePortfolioNavigation}
            setSelectedNav={setSelectedNav}
            handleLogout={handleLogout}
            selectedNav={selectedNav}
          />
          <div className='px-3 py-0 text-white h-full overflow-y-auto rounded font-bold main-conatain hide-scrollbar portfolioWrapper-div2'>
            {[...sideItems].map(item => {
              if (item.name == selectedNav) {
                return item.component
              }
            })}
          </div>
        </div>

      </Modal>
    </>
  )
}

export default PortfolioModal
