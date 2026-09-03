import type { Metadata } from 'next';
import './globals.css';
import './crm.css';

export const metadata: Metadata = {
  title: 'Faby CRM',
  description: 'Inbox WhatsApp para leads e conversas',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
