import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Section from '../../../Common/AppSection';

// Dynamically import `DiscussionEmbed` on the client-side only
const DiscussionEmbed = dynamic(
  () => import('disqus-react').then((mod) => mod.DiscussionEmbed),
  { ssr: false }
);

export default function CommentProject(props) {
  const [showComments] = useState(true);

  useEffect(() => {}, []);

  return (
    <>
      {showComments && (
        <Section>
          <DiscussionEmbed
            shortname="clever"
            config={
              {
                /* Your config here */
              }
            }
          />
        </Section>
      )}
    </>
  );
}
