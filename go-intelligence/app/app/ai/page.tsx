import type { Metadata } from 'next';
import AIClient from './AIClient';

export const metadata: Metadata = {
  title: 'GO AI',
  description: 'GO AI — one query answered across every module.',
};

export default function AIPage() {
  return <AIClient />;
}
