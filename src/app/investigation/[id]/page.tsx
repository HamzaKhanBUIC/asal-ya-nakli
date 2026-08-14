import React from 'react';
import InvestigationClientContent from './client-page';

export async function generateStaticParams() {
  return [{ id: 'AYN-DEMO' }];
}

export default function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  return <InvestigationClientContent params={params} />;
}
