export const metadata = {
  title: 'branch teast',
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
