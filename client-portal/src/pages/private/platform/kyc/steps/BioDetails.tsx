import { Form, Button, Checkbox, Select, DatePicker } from "antd";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { GlobalStates } from "@store/slices/global";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { countries } from "../data/countries";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import KYCButton from "../components/Button";
import DateSelection from "../components/DateSelection";
import useVerification from "api/kyc/useVerification";
import { useCookies } from "react-cookie";
import { KycProp, setUserKYC } from "@store/slices/userBio";
import ProfilePic from "../components/profilePic/pic";
import { IDType } from "../data/id_type";
import useKyc from "api/kyc/useKycInfo";
import useVerificationUpdate from "api/kyc/useVerificationUpdate";
import Loading from "components/loading";
import { useNavigate } from "react-router-dom";

interface SignUpFormData {
  last_name: string;
  first_name: string;
  country: string;
  address: string;
  year: string;
  month: string;
  day: string;
  id_number: string;
  id_type: string,
  dob: string;
  id?: number | null;
  image: File | null;
  selfie: string | null
}

interface BioDetailsProps {
  handleNext: (dir: string) => void;
}

const BioDetails: React.FC<BioDetailsProps> = ({ handleNext }) => {
  const [doesKycExist, setDoesKycExist] = useState(false)
  const dispatch = useAppDispatch()
  const [cookies] = useCookies(["access_token"]);
  const { handleSubmit, register, reset, setValue, formState: { errors } } = useForm<SignUpFormData>();
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<SignUpFormData>({
    id: null,
    first_name: '',
    last_name: '',
    country: '',
    address: '',
    year: '',
    month: '',
    day: '',
    id_number: "",
    id_type: "",
    dob: "",
    selfie: null,
    image: null
  });


  const { mutate, isPending } = useVerification({
    onSuccess: (data) => {
      reset();
      toast.success("Success! Your KYC has been created.");
      dispatch(setUserKYC(data as KycProp));


      handleNext("next");
    },
  });

  const { mutate: mutateKYCData, isPending: isLoading } = useKyc({
    onSuccess: (data) => {
      if (data.results.length > 0) {
        const updatedFormData = {
          ...formData,
          ...data.results[0],
        };
        setDoesKycExist(true)

        setFormData(updatedFormData);
        console.log(updatedFormData, formData)

        form.setFieldsValue({
          id_number: updatedFormData.id_number,
          first_name: updatedFormData.user.first_name,
          last_name: updatedFormData.user.last_name,
          address: updatedFormData.address,

        });
      }

    },
  });
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useVerificationUpdate({
    onSuccess: (data) => {

      console.log("get data for KYC", data)
      toast.success("Update was successful")
      dispatch(setUserKYC(data as KycProp));
      handleNext("next")
    }
  })

  const onSubmit: SubmitHandler<SignUpFormData> = () => {

    if (!cookies?.access_token) {
      console.log(cookies.access_token)
      toast.error("Session expired: Please go to login")
    }

    const dob = formData.dob.trim() !== "" ? formData.dob : `${formData.year}-${formData.month}-${formData.day}`
    const profileImage = formData.image ?? null
    const formDataParse = new FormData();
    formDataParse.append("full_name", formData.first_name + ' ' + formData.last_name);
    formDataParse.append("country", formData.country);
    formDataParse.append("address", formData.address);
    formDataParse.append("id_type", formData.id_type);
    formDataParse.append("id_number", formData.id_number);
    formDataParse.append("dob", dob);

    profileImage && formDataParse.append("selfie", profileImage as Blob);



    if (doesKycExist) {
      mutateUpdate({
        id: formData.id,
        token: cookies.access_token,
        formData: formDataParse

      })
      // console.log("kyc updaate not working", Object.fromEntries(formDataParse), "heysdsds", formData.first_name, formDataParse.get('first_name'))

    }
    else {
      mutate({
        token: cookies.access_token,
        formData: formDataParse,
      });

    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    mutateKYCData({
      token: cookies.access_token
    })

  }, [])

  console.log(formData)


  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="w-full formContainer px-5">
      {/* <div className="m-auto w-max ">
      <ProfilePic 
        profilePic={formData?.selfie}
          handleProfileImg={(file) => {
            setFormData((prevData) => ({
              ...prevData,
              image: file,
            }));
          }} 
        />


      </div> */}
      <h5 className="text-white text-xl font-semibold my-2">Enter your details</h5>

      <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 justify-between">
          <div className="flex-1">
            <Form.Item
              name="first_name"
              validateStatus={errors.first_name ? "error" : ""}
              help={errors.first_name?.message}
            >
              <FormInput
                label="First name"
                type="text"
                id="first_name"
                placeholder="Enter your First"
                inputValue={formData.first_name}
                inputName="first_name"
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item
              name="last_name"
              validateStatus={errors.last_name ? "error" : ""}
              help={errors.last_name?.message}
            >
              <FormInput
                label="Last name"
                type="text"
                id="last_name"
                placeholder="Enter your Last"
                inputValue={formData.last_name}
                inputName="last_name"
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>
        </div>



        <div className="flex flex-col md:flex-row gap-1 md:gap-4 justify-between">


          <div className="flex-1">
            <Form.Item
              name="address"
              validateStatus={errors.address ? "error" : ""}
              help={errors.address?.message}
            >
              <FormInput
                label="Address"
                type="text"
                id="address"
                value={formData.address}
                placeholder="Enter Address"
                inputName="address"
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>


        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 justify-between">

          <div className="flex-1">

            <Form.Item
              validateStatus={errors.id_type ? "error" : ""}
              help={errors.id_type?.message}
            >
              <FormSelect

                data={IDType}
                label="ID Type"
                placeholder="Select ID Type"
                className="w-full selectHeight"
                id="id_type"
                name="id_type"
                selectedId={formData.id_type}

                onSelect={(value) => setFormData({ ...formData, id_type: value })}
              />
            </Form.Item>
          </div>


          <div className="flex-1">
            <Form.Item
              name="id_number"
              // initialValue={"hsdsd"}
              validateStatus={errors.id_number ? "error" : ""}
              help={errors.id_number?.message}
            >
              <FormInput
                label="ID Number"
                type="text"
                id="id_number"
                inputValue={"formData.id_number"}
                placeholder="Enter ID Number"
                inputName="id_number"
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>
        </div>

        <h5 className="text-white text-xl font-semibold mb-3">Enter your date of birth</h5>

        <DateSelection setFormData={setFormData} formData={formData} />

        <div className="flex my-4 gap-5 lg:gap-x-10 justify-between">
          <div className="flex-grow">
            <KYCButton
              text="Back"
              isLoading={false}
              disable={isPending}
              type="button"
              className="kyc-button text-base font-semibold back"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="flex-grow">
            <KYCButton
              text="Next"
              isLoading={isPending || isPendingUpdate}
              disable={isPending}
              type="submit"
              className="kyc-button text-base font-semibold"
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BioDetails;
