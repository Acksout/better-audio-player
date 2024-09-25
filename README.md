# Better Audio Player

Better Audio Player is a sleek, modern web application that allows you to host and stream your music files directly from Google Drive. With a clean interface and powerful audio playback capabilities, it's the perfect solution for music producers, DJs, and audio enthusiasts who want to organize and access their sound libraries with ease.

![Better Audio Player Screenshot](https://i.imgur.com/bndJCZm.png)

## Features

- 🎵 Stream audio files directly from Google Drive
- 📁 Browse folders and files with an intuitive interface
- ▶️ Built-in audio player with playback controls
- 🔊 Volume control and seek functionality
- 📱 Responsive design for desktop and mobile devices
- 🚀 Fast and efficient with Next.js and React
- 🎨 Stylish UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm or yarn
- A Google Cloud Platform account
- A Google Drive folder containing your audio files

## Setting Up Your Own Server

Follow these steps to set up your own Better Audio Player server:

1. Clone the repository:

   ```
   git clone https://github.com/Acksout/better-audio-player.git
   cd better-audio-player
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up Google Cloud Platform:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Drive API for your project
   - Create credentials (OAuth 2.0 Client ID) for a Web application
   - Download the client configuration file

4. Configure environment variables:

   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     GOOGLE_REFRESH_TOKEN=your_refresh_token
     GOOGLE_CLIENT_EMAIL=your_client_email
     GOOGLE_PRIVATE_KEY=your_private_key
     GOOGLE_DRIVE_DIRECTORY_ID=your_drive_folder_id
     ```

5. Run the development server:

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deploying to Production

To deploy Better Audio Player to a production environment, we recommend using [Vercel](https://vercel.com), the platform built by the creators of Next.js.

1. Push your code to a GitHub repository.

2. Sign up for a Vercel account and connect it to your GitHub account.

3. Import your Better Audio Player repository into Vercel.

4. Configure your environment variables in the Vercel dashboard.

5. Deploy your application.

Vercel will automatically build and deploy your application, providing you with a production URL.

## Contributing

Contributions to Better Audio Player are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Drive API](https://developers.google.com/drive)
- [Howler.js](https://howlerjs.com/)

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

Happy music hosting! 🎶
