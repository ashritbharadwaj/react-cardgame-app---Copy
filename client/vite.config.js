import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// import { fetchIP } from './fetchIP';

// async function setupServerConfig() {
//   const host = await fetchIP(); // Fetch the IP address asynchronously
//   const port = 5000; // Replace with your desired port number

//   return {
//     host,
//     port,
//   };
// }

// export default defineConfig(async () => {
//   const serverConfig = await setupServerConfig();

//   return {
//     plugins: [react()],
//     server: serverConfig,
//   };
// });
