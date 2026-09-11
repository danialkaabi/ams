import type { Metadata } from 'next';
import MapsClient from './MapsClient';

export const metadata: Metadata = {
  title: 'Maps & Layers',
  description: 'GO Maps & Layers — spatial intelligence for the offshore fleet.',
};

export default function MapsPage() {
  return <MapsClient />;
}
