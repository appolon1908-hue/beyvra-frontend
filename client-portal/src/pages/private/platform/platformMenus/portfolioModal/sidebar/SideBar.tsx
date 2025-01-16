import { useAppSelector } from '@store/hooks';
import { Modal } from 'antd';
import useUpdateUser from 'api/user/useUpdateUser';
import Loading from 'components/loading';
import ProfilePic from 'pages/private/platform/kyc/components/profilePic/pic';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import './sidebar.scss';

interface portfolioSideProps {
  sideItems: any[];
  handlePortfolio: () => void
  handleLogout: () => void
  selectedNav: string
  setSelectedNav: React.Dispatch<React.SetStateAction<string>>
}

const PortfolioSideBar: React.FC<portfolioSideProps> = ({ selectedNav, sideItems, handlePortfolio, setSelectedNav, handleLogout }) => {

  const { user } = useAppSelector(state => state.user)
  const [cookies] = useCookies(["access_token"]);
  const [show, setShow] = useState(false);

  const { mutate, isPending } = useUpdateUser({
    onSuccess: (data) => {
      toast.success("Image Uploaded")

    }
  })

  const handlePicUpdate = (file: File) => {
    mutate({
      token: cookies.access_token,
      data: {
        profile_picture: file
      }
    })

  }

  return (
    <div className='sidebarWrapper px-2 md:px-5 py-6 rounded-2xl sideNav overflow-y-auto'>

      <div className='profile-pic-info-container profileInfoContainer'>
        <div className=" relative profile-pic-container profilePicImage">
          {isPending && (
            <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center rounded-full'>
              <Loading />
            </div>
          )}
          <ProfilePic
            profilePic={user?.profile_picture ?? null}
            handleProfileImg={handlePicUpdate}
          />
        </div>
        <div className='flex flex-col justify-center'>
          <p className='my-2 text-base text-center font-bold'> {`${user?.first_name} ${user?.last_name}`}</p>
          <p className='text-[#2dd674] text-sm text-center'>{user?.trader_id}</p>
          <button
            onClick={() => {
              setShow(false);
              handleLogout();
            }}
            className="logoutBtnSml "
          >
            Log out
          </button>

        </div>
      </div>
      <div className='profileInfoMenuContainer'>
      
      <ul className='smul mt-5 mb-3 bg-[#373737] rounded-2xl py-1'>
        {sideItems.map((item: any) => (
          <li
            key={item.name}
            className={`smli px-2 py-2 my-1 text-center rounded-2xl cursor-pointer font-medium hover:text-[#28bd66] ${item.name === selectedNav && "text-[#28bd66] "}`}
            onClick={() => {

              setSelectedNav(item.name);

            }}
          >
            <span className='text-xs md:text-sm font-medium'>{item.label}</span>
            
          </li>
        ))}

      </ul>
      
      </div>

      <button className={`logoutBtnBig text-black my-2 py-[5px] px-4 text-center rounded-3xl cursor-pointer font-bold bg-[#28bd66] w-full`} onClick={() => setShow(true)}><span className='text-xs md:text-sm font-medium'>Log Out </span></button>

      <Modal
        open={show}
        rootClassName="portfolioProfile" onOk={() => setShow(false)}
        onCancel={() => setShow(false)}
        footer={null}
        maskClosable={false}
        centered
      >
        <div className='confirmEmailContainer'>
          <span className='confirmEmailTitle'>Log out</span>
          <span className='confirmEmailSubTitle'>Are you sure you want to log out?</span>
          <button
            onClick={() => {
              setShow(false);
              handleLogout();
            }}
            className="confirmEmailContinueButton"
          >
            Log out
          </button>
          <button
            onClick={() => {
              setShow(false);
            }}
            className="confirmEmailCancelButton"
          >
            Cancel
          </button>
        </div>
      </Modal>


    </div>
  )
}

export default PortfolioSideBar