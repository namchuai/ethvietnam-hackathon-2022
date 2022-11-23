import Layout from '../../components/Common/AppLayout';
import SettingPage from '../../components/Page/Setting';
export function Setting() {
  return (
    <div>
      <Layout pageTitle={'Home Page'} mainContent={<SettingPage />} />
    </div>
  );
}

export default Setting;
