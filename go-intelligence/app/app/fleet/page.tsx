import type { Metadata } from 'next';
import FleetClient from './FleetClient';

export const metadata: Metadata = {
  title: 'Fleet',
  description: 'GO Fleet — offshore vessel intelligence and database.',
};

export default function FleetPage() {
  return <FleetClient />;
}
