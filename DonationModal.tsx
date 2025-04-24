import { FC } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Make a Donation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
              50 USDC
            </button>
            <button className="p-4 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
              100 USDC
            </button>
            <button className="p-4 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
              200 USDC
            </button>
          </div>
          
          <div className="relative">
            <input
              type="number"
              placeholder="Custom amount"
              className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              USDC
            </span>
          </div>
          
          <textarea
            placeholder="Add a message (optional)"
            className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 h-24"
          ></textarea>
          
          <button 
            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;