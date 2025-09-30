
import { useForm, ValidationError } from "@formspree/react";

function ContactUs() {
  const [state, handleSubmit] = useForm("mwpngovd"); // Replace with your Formspree ID

  return (
    <div className="min-h-screen flex flex-col pt-5 bg-gray-50">
      {/* Header */}
      <header className="text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-gray-700">We’d love to hear from you!</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full">
          {/* Left Side: Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600">
              Have questions or want to work with us? Fill out the form and we’ll
              get back to you shortly.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">📍 Address</h3>
                <p className="text-gray-600">Lahore, Pakistan</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">📧 Email</h3>
                <p className="text-gray-600">malikrizwan1076@gmail.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">📞 Phone</h3>
                <p className="text-gray-600">+92 324 9422392</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            {state.succeeded ? (
              <p className="text-green-600 font-medium text-center">
                ✅ Thanks for your message! We’ll get back to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none"
                  />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none "
                  ></textarea>
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-[#ec7140] text-white py-3 rounded-lg cursor-pointer hover:bg-[#f25012]  transition disabled:opacity-50"
                >
                  {state.submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

 
    </div>
  );
}

export default ContactUs;
