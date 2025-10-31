export const metadata = {
  title: "Pre-Launch Challenge",
  description: "Aerospace quiz with coffee coupon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
