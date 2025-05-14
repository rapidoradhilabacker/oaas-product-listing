import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FaLinkedinIn />
            </a>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-500">
              &copy; {new Date().getFullYear()} WorkshopHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
