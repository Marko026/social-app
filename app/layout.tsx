import { authOptions } from '@/lib/auth-options';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { IBM_Plex_Sans } from 'next/font/google';
import { cookies } from 'next/headers';
import '../styles/prism.css';
import SessionProvider from './context/SessionProvider';
import { ThemeProvider } from './context/ThemeProvider';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const cookiesProvider = cookies();
  const theme = cookiesProvider.get('theme')?.value || 'dark';

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <html lang="en" className={`${theme}`}>
          <body
            className={`${ibmPlexSans.className} min-h-screen dark:bg-black-900 bg-white-200`}>
            <main className="max-w-screen-xxl mx-auto">{children}</main>
          </body>
        </html>
      </SessionProvider>
    </ThemeProvider>
  );
}
