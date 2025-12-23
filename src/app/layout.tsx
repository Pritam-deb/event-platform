import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Event Management",
  description: "Events CRUD platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
