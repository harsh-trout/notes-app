export const metadata = {
  title: 'Notes',
  description: 'Simple notes app',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
