import { Metadata } from 'next';

import PrivacyPolicy from '@/features/privacy/components/PrivacyPolicy';
import { POLICY_METADATA } from '@/features/privacy/constants/policy-content';

export const metadata: Metadata = {
  title: POLICY_METADATA.title,
  description: POLICY_METADATA.description,
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
