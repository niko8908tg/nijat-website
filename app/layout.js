import "./globals.css";

export const metadata = {
  title: "Nicat — Personal Archive",
  description: "Projects, workshops, posters and notes by Nicat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

