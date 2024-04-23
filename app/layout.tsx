import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './context/ThemeProvider';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesProvider = cookies();
  const theme = cookiesProvider.get('theme')?.value || 'light';

  return (
    <ThemeProvider theme={theme}>
      <html lang="en" className={`${theme}`}>
        <body
          className={`${inter.className} min-h-screen ${
            theme === 'dark' ? 'bg-[#000]' : 'bg-white-100'
          } `}>
          <main className="max-w-screen-xxl mx-auto">{children}</main>
        </body>
      </html>
    </ThemeProvider>
  );
}
