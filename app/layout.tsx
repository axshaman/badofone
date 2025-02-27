export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <head>
          <title>Badofone Chat</title>
          <meta name="description" content="Badofone Customer Support Chat" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className="bg-gray-100 text-gray-900">
          {children}
        </body>
      </html>
    );
  }
  