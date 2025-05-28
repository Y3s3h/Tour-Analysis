import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const features = [
  {
    title: "Create Tours Easily",
    desc: "Build interactive product tours without writing a single line of code.",
    icon: "🚀",
  },
  {
    title: "Share Anywhere",
    desc: "Export and embed your tours across websites, apps, or demos.",
    icon: "🔗",
  },
  {
    title: "Track Engagement",
    desc: "See how users interact with your tours in real-time.",
    icon: "📊",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] overflow-hidden flex flex-col items-center px-4">
      {/* Floating animated blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute w-72 h-72 bg-pink-500 opacity-30 rounded-full filter blur-3xl animate-blob left-1/2 top-1/3 animation-delay-4000" />
        <div className="absolute w-72 h-72 bg-cyan-400 opacity-30 rounded-full filter blur-3xl animate-blob left-1/3 top-2/3 animation-delay-6000" />
      </div>

      {/* Hero Section */}
      <motion.div
        className="z-10 text-white text-center mt-32 max-w-3xl p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to Interactive Tour Builder
        </h1>
        <p className="text-gray-200 text-lg mb-6">
          Empower your users with beautiful, guided product walkthroughs in just
          a few clicks.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {/* <Link
            onClick={handleGetStarted}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition text-white font-semibold shadow-md"
          >
            Get Started
          </Link> */}
          <button
            onClick={handleGetStarted}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition text-white font-semibold shadow-md"
          >
            Get Started
          </button>
          <Link
            to="/dashboard"
            className="px-6 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition text-white font-semibold"
          >
            View Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="z-10 mt-20 grid md:grid-cols-3 gap-6 w-full max-w-6xl">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md shadow-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-200">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <footer className="z-10 mt-20 text-gray-400 text-sm pb-10">
        © {new Date().getFullYear()} TourBuilder — All Rights Reserved.
      </footer>
    </div>
  );
}
