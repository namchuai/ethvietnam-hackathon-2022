import { useEffect, useState } from 'react';
import Section from '../../Common/AppSection';
import Basic from './Basic';
import Reward from './Reward';
import Story from './Story';
import Verification from './Verification';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import Processing from '../../Common/Processing';
import { checkEkycProfile } from 'apps/clever-launch-frontend/services/user';
import {
  getContries,
  getPendingProject,
  getYears,
} from 'apps/clever-launch-frontend/services/create-project';
import { useDispatch } from 'react-redux';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';
import ModalWarningUnsaved from './Components/Modal/ModalWarningUnsaved';

export interface IReward {
  title: string;
  totalAmount: number;
  description: string;
  estDeliveryMonth: number;
  estDeliveryYear: number;
  price: string;
  rewardType: string;
  deliveryNote?: string;
}

export interface IStateBasic {
  title: string;
  subTitle: string;
  fundRaisingMethod: any;
  fundingGoal: any;
  durationInDay: any;
  introType: string;
  introUrl: string;
  tags: Array<any>;
  story?: any;
  walletAddress?: string;
  contactEmail?: string;
}

export interface IUserInfo {
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  walletAddress: string;
  contactEmail: string;
}

function CreateProject() {
  const { account } = useWeb3React();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpLoad, setIsUpLoad] = useState(false);
  const [eKycStatus, setEKycStatus] = useState('NotStarted');
  const [listYears, setListYears] = useState([]);
  const [listCountries, setListCountries] = useState([]);
  const [isShowModalUnsaved, setIsShowModalUnsaved] = useState(false);
  const [tabId, setTabId] = useState('basic');
  const [typeMethodFundraising, setTypeMethodFundraising] =
    useState('LookingForDonors');

  const route = useRouter();
  const { id: projectId, tab } = route.query as { id?: string; tab?: string };

  const handleCheckEkycProfile = async () => {
    try {
      const { data, status } = await checkEkycProfile(account);
      if (status == 200 && data) {
        setEKycStatus(data?.eKycStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetCountry = async () => {
    try {
      const { data, status } = await getContries();
      if (status == 200 || status == 201) {
        setListCountries(
          data?.map((item) => {
            return {
              value: item,
              name: item,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetYear = async () => {
    try {
      const { data, status } = await getYears();
      if (status == 200 || status == 201) {
        setListYears(
          data?.map((item) => {
            return {
              value: String(item),
              id: item,
              name: String(item),
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tabId);

  useEffect(() => {
    handleGetYear();
    handleGetCountry();
  }, []);

  useEffect(() => {
    account && handleCheckEkycProfile();
  }, [account]);

  return (
    <div className={'pb-10'}>
      <>
        {isUpLoad ? (
          <Processing
            ekycStatus={eKycStatus}
            isProcessing={isProcessing}
            setIsUpLoad={setIsUpLoad}
          />
        ) : (
          <>
            <Section>
              <div className="text-[36px] font-semibold">
                Create your project
              </div>
            </Section>

            <div className="border-b" />
            <Section>
              <div className="flex justify-start items-center gap-[3px]">
                {listTab
                  .filter((tab) =>
                    typeMethodFundraising !== 'LookingForDonors'
                      ? tab.tabId !== 'rewards'
                      : tab.tabId !== ''
                  )
                  .map((item, index) => {
                    return (
                      <button
                        key={index}
                        className={`py-[8px] px-[12px] ${
                          tab == item.tabId
                            ? 'bg-[#E4E7EC] text-[#1F4690] rounded-[6px]'
                            : ''
                        } text-[14px] font-normal text-[#4D4D4D]`}
                        onClick={() => {
                          route.push({
                            pathname: '/create-project/[id]',
                            query: { id: `${projectId}`, tab: item.tabId },
                          });
                        }}
                      >
                        {item.title}
                      </button>
                    );
                  })}
              </div>
            </Section>

            <div className="border-b" />
            {tab == TABS.BASIC && (
              <Basic
                projectId={projectId}
                setTypeMethodFundraising={setTypeMethodFundraising}
              />
            )}
            {tab == TABS.REWARD &&
              typeMethodFundraising === 'LookingForDonors' && (
                <Reward projectId={projectId} listYears={listYears} />
              )}
            {tab == TABS.STORY && <Story projectId={projectId} />}
            {tab == TABS.VERIFICATION && (
              <Verification
                eKycStatus={eKycStatus}
                projectId={projectId}
                setIsUpLoad={setIsUpLoad}
                setIsProcessing={setIsProcessing}
                listCountries={listCountries}
              />
            )}
          </>
        )}
      </>
      <ModalWarningUnsaved
        visible={isShowModalUnsaved}
        closeHandler={() => setIsShowModalUnsaved(false)}
        tabId={tabId}
        projectId={projectId}
      />
    </div>
  );
}

const listTab = [
  {
    tabId: 'basic',
    title: 'Basic',
  },
  {
    tabId: 'rewards',
    title: 'Rewards',
  },
  {
    tabId: 'story',
    title: 'Story',
  },
  {
    tabId: 'verification',
    title: 'Verification',
  },
];

export default CreateProject;
