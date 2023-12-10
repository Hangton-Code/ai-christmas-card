import { Provider } from "@/lib/provider";
import { notonSansHk } from "./layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <html lang="en">
        <body className={notonSansHk.className}>{children}</body>
        <Toaster />
      </html>
    </Provider>
  );
}
