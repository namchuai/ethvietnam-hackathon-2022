import React from 'react';
import OurTeam from './OurTeam';
import ServiceClever from './ServiceClever';
import OurAdvisor from './OurAdvisor';
import OurBacker from './OutBacker';
import Subscriber from './Subscriber';
import FeatureProject from './FeatureProject';
import RoadMap from './RoadMap';

function Home() {
  return (
    <div>
      <ServiceClever />
      <FeatureProject />
      <OurAdvisor />
      <OurTeam />
      <OurBacker />
      <RoadMap />
      <Subscriber />
    </div>
  );
}

export default Home;
