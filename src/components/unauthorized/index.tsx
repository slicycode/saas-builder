import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl md:text-6xl">Unauthorized acccess!</h1>
      <p>Please contact support or your agency owner to get access</p>
      <Link href="/" className="mt-4 rounded-lg bg-primary px-4 py-2">
        Back to home
      </Link>
    </div>
  );
};

export default Unauthorized;
