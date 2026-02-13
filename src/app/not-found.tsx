import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-[#E0B700] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#E0B700] text-white font-semibold rounded-full hover:bg-[#c9a400] transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
