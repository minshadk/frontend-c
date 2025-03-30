import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClipboardCheck, FaUsers, FaBolt } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">Civic Fix</h1>
        {/* <Link
          to="/login"
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Report an Issue
        </Link> */}
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold leading-tight"
        >
          Civic Fix – Report Issues, Spark Change!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg"
        >
          A smarter way to improve your city. Report civic issues, track resolutions, and make a difference!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link
            to="/login"
            className="mt-6 inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Report an Issue
          </Link>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaMapMarkerAlt className="text-blue-500 text-4xl" />, title: "Report", text: "Easily report city issues with just a few clicks." },
            { icon: <FaClipboardCheck className="text-indigo-500 text-4xl" />, title: "Track", text: "Monitor the status of your complaint in real time." },
            { icon: <FaUsers className="text-green-500 text-4xl" />, title: "Get Involved", text: "Join a community working for a better city." }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mt-3">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Why Civic Fix?</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { icon: <FaBolt className="text-yellow-500 text-4xl" />, title: "Instant Reporting", text: "Quickly report and track issues effortlessly." },
            { icon: <FaUsers className="text-green-500 text-4xl" />, title: "Community Driven", text: "Join a movement of active citizens improving their city." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 bg-gray-100 shadow-md rounded-lg"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mt-3">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { text: "Civic Fix made reporting issues effortless. My complaint was resolved in just a few days!", name: "John Doe" },
            { text: "Finally, a platform where citizens have a voice! I love the transparency and updates.", name: "Emily Smith" }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 bg-white shadow-md rounded-lg"
            >
              <p className="text-gray-600">{testimonial.text}</p>
              <span className="block mt-4 font-semibold">{testimonial.name}</span>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Call to Action */}
   
    </div>
  );
};

export default LandingPage;
