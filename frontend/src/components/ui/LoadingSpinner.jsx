
export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="relative flex items-center justify-center">
        {/* Spinner Circle */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-emerald-600 border-b-transparent border-l-transparent border-r-transparent"></div>

        {/* Text in the middle of spinner */}
       
      </div>
    </div>
  );
}
