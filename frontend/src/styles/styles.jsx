export const styles = {
  body: `bg-gray-100 font-sans text-gray-800`,
  container: `container mx-auto p-4 md:p-8`,
  header: `bg-pink-500 text-white p-6 shadow-md rounded-lg mb-8 flex justify-between items-center`,
  card: `bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105`,
  button: `bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed`,
  input: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-shadow`,
  modalOverlay: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`,
  modalContent: `bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all`,
};
