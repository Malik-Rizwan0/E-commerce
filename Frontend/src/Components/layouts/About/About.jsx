import { FaWhatsapp,  FaGithub, FaLinkedin, FaStore } from "react-icons/fa";
import './about.css';

const About = () => {
  const founder = {
    name: "Rizwan",
    role: "Frontend & MERN Stack Developer",
    avatar:
      "https://res.cloudinary.com/dnyfyjwv4/image/upload/c_fill,w_400,h_400,g_center,y_-50/v1757929863/Chair_Dp_le8ow8.jpg",
    bio: "I’m a passionate web developer specializing in building modern, scalable, and user-friendly ecommerce websites. With expertise in the MERN stack, React.js, and Redux Toolkit, I craft professional online stores that focus on performance and customer experience.",
social: {
  github: "https://github.com/Malik-Rizwan0",
  linkedin: "https://www.linkedin.com/in/malik-rizwan/",
  whatsapp:
    "https://wa.me/923249422392?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20web%20development%20project%20with%20you.%20Could%20you%20please%20share%20more%20details%20about%20your%20services%3F",
},
  };

  const brands = [
    {
      name: "Foodi",
      description: "A modern restaurant website designed to highlight flavors, menus, and customer experience.",
      link: "https://malik-rizwan0.github.io/FOODI/",
    },
    {
      name: "FitMaker",
      description: "“A fitness website built to showcase training programs, membership plans, and health goals.",
      link: "https://malik-rizwan0.github.io/FitMaker/",
    },
    {
      name: "Bussiness Website",
      description: "A professional software house website presenting services, expertise, and digital solutions",
      link: "https://malik-rizwan0.github.io/360lution.com/",
    },
  ];

  const skills = [
    "React.js",
    "Redux Toolkit",
    "Node.js",
    "Express.js",
    "MongoDB",
    "REST APIs",
    "Material UI",
    "Tailwind CSS",
    "Payment Gateway Integration",
  ];

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#4c4c4c] mb-2">
          About Me
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Showcasing my journey as a web developer and ecommerce specialist
        </p>

        {/* Founder Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left side */}
          <div className="md:col-span-4 flex flex-col items-center space-y-4">
            <img
              src={founder.avatar}
              alt={founder.name}
              className="w-40 h-40 rounded-full border-4 border-[#4c4c4c] object-cover"
            />
            <h2 className="text-xl font-semibold text-[#4c4c4c]">{founder.name}</h2>
            <p className="text-gray-600">{founder.role}</p>
            <div className="flex space-x-4">
              
              <a href={founder.social.github} target="_blank" rel="noreferrer">
                <FaGithub className="text-[#4c4c4c] text-xl" />
              </a>
              <a href={founder.social.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin className="text-[#4c4c4c] text-xl" />
              </a>
              <a href={founder.social.whatsapp} target="_blank" rel="noreferrer">
                <FaWhatsapp className=" text-[#4c4c4c] text-xl" />
              </a>
            </div>
          </div>

          {/* Right side */}
          <div className="md:col-span-8 bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{founder.bio}</p>
          </div>
        </div>

        {/* My Projects / Brands */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#4c4c4c] mb-4">
            Latest Projects
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Here are some websites I built to showcase my skills.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white project rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
              >
                <FaStore className="text-[#4c4c4c] text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#4c4c4c] mb-2">
                  {brand.name}
                </h3>
                <p className="text-gray-500 mb-4">{brand.description}</p>
                <a
                  href={brand.link}
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  Visit
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#4c4c4c] mb-4">
            My Skills
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Tools and technologies I use to build professional ecommerce sites
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="button"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
